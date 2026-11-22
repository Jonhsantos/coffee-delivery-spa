import { StrictMode } from 'react'
import { render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { afterEach, expect, test, vi } from 'vitest'
import { CartProvider } from '../contexts/CartProvider'
import { useCart } from '../hooks/useCart'
import { STORAGE_KEYS } from '../services/storage'

function Consumer() {
  const cart = useCart()
  return (
    <>
      <p>Unidades: {cart.unitCount}</p>
      <p>Subtotal: {cart.subtotalCents}</p>
      <button onClick={() => cart.addItem('expresso-tradicional', 2)}>
        Adicionar
      </button>
    </>
  )
}

afterEach(() => {
  vi.restoreAllMocks()
  localStorage.clear()
})

test('hidrata antes de escrever e persiste após alteração e remontagem', async () => {
  localStorage.setItem(
    STORAGE_KEYS.cart,
    JSON.stringify([{ productId: 'expresso-tradicional', quantity: 1 }]),
  )
  const user = userEvent.setup()
  const view = render(
    <StrictMode>
      <CartProvider>
        <Consumer />
      </CartProvider>
    </StrictMode>,
  )
  expect(screen.getByText('Unidades: 1')).toBeInTheDocument()
  await user.click(screen.getByRole('button', { name: 'Adicionar' }))
  expect(screen.getByText('Unidades: 3')).toBeInTheDocument()
  expect(screen.getByText('Subtotal: 2970')).toBeInTheDocument()
  await waitFor(() =>
    expect(JSON.parse(localStorage.getItem(STORAGE_KEYS.cart)!)).toEqual([
      { productId: 'expresso-tradicional', quantity: 3 },
    ]),
  )
  view.unmount()
  render(
    <CartProvider>
      <Consumer />
    </CartProvider>,
  )
  expect(screen.getByText('Unidades: 3')).toBeInTheDocument()
})

test('mantém carrinho em memória e avisa quando gravação falha', async () => {
  vi.spyOn(Storage.prototype, 'setItem').mockImplementation(() => {
    throw new Error('quota')
  })
  const user = userEvent.setup()
  render(
    <CartProvider>
      <Consumer />
    </CartProvider>,
  )
  expect(await screen.findByRole('status')).toHaveTextContent(
    'apenas nesta sessão',
  )
  await user.click(screen.getByRole('button', { name: 'Adicionar' }))
  expect(screen.getByText('Unidades: 2')).toBeInTheDocument()
})

test('não sobrescreve storage quando leitura inicial está bloqueada', async () => {
  vi.spyOn(Storage.prototype, 'getItem').mockImplementation(() => {
    throw new Error('bloqueado')
  })
  const write = vi.spyOn(Storage.prototype, 'setItem')
  const user = userEvent.setup()
  render(
    <CartProvider>
      <Consumer />
    </CartProvider>,
  )
  expect(screen.getByRole('status')).toHaveTextContent('apenas nesta sessão')
  await user.click(screen.getByRole('button', { name: 'Adicionar' }))
  expect(screen.getByText('Unidades: 2')).toBeInTheDocument()
  expect(write).not.toHaveBeenCalled()
})
