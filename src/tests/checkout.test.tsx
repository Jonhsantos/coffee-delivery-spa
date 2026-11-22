import { render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { afterEach, expect, test, vi } from 'vitest'
import App from '../App'
import { CartProvider } from '../contexts/CartProvider'
import { STORAGE_KEYS } from '../services/storage'

afterEach(() => {
  vi.restoreAllMocks()
  vi.unstubAllGlobals()
  localStorage.clear()
  window.history.replaceState({}, '', '/')
})

test('consulta CEP e preserva snapshot após finalizar pedido fictício', async () => {
  localStorage.setItem(
    STORAGE_KEYS.cart,
    JSON.stringify([{ productId: 'expresso-tradicional', quantity: 2 }]),
  )
  window.history.replaceState({}, '', '/checkout')
  vi.stubGlobal(
    'fetch',
    vi.fn().mockResolvedValue({
      ok: true,
      json: async () => ({
        logradouro: 'Rua Teste',
        bairro: 'Centro',
        localidade: 'São Paulo',
        uf: 'SP',
      }),
    }),
  )
  const user = userEvent.setup()
  render(
    <CartProvider>
      <App />
    </CartProvider>,
  )
  await user.type(screen.getByLabelText('CEP'), '01001000')
  expect(await screen.findByDisplayValue('Rua Teste')).toBeInTheDocument()
  await user.type(screen.getByLabelText('Número'), '10')
  await user.click(screen.getByLabelText('Cartão de crédito'))
  await user.click(screen.getByRole('button', { name: 'Confirmar pedido' }))
  expect(
    await screen.findByRole('heading', { name: 'Uhu! Pedido confirmado' }),
  ).toBeInTheDocument()
  const order = JSON.parse(
    localStorage.getItem(STORAGE_KEYS.order) ?? '{}',
  ) as { totalCents: number }
  expect(order.totalCents).toBe(2480)
  await waitFor(() =>
    expect(
      JSON.parse(localStorage.getItem(STORAGE_KEYS.cart) ?? 'null'),
    ).toEqual([]),
  )
})

test('não confirma quando o CEP não foi verificado', async () => {
  localStorage.setItem(
    STORAGE_KEYS.cart,
    JSON.stringify([{ productId: 'expresso-tradicional', quantity: 1 }]),
  )
  window.history.replaceState({}, '', '/checkout')
  const user = userEvent.setup()
  render(
    <CartProvider>
      <App />
    </CartProvider>,
  )
  await user.click(screen.getByRole('button', { name: 'Confirmar pedido' }))
  expect(localStorage.getItem(STORAGE_KEYS.order)).toBeNull()
  expect(
    (await screen.findAllByText('Campo obrigatório')).length,
  ).toBeGreaterThan(0)
})

test('CEP inexistente não autoriza confirmação', async () => {
  localStorage.setItem(
    STORAGE_KEYS.cart,
    JSON.stringify([{ productId: 'expresso-tradicional', quantity: 1 }]),
  )
  window.history.replaceState({}, '', '/checkout')
  vi.stubGlobal(
    'fetch',
    vi.fn().mockResolvedValue({ ok: true, json: async () => ({ erro: true }) }),
  )
  const user = userEvent.setup()
  render(
    <CartProvider>
      <App />
    </CartProvider>,
  )
  await user.type(screen.getByLabelText('CEP'), '99999999')
  expect(await screen.findByText('CEP não encontrado.')).toBeInTheDocument()
  expect(localStorage.getItem(STORAGE_KEYS.order)).toBeNull()
})

test('erro ao salvar pedido preserva carrinho', async () => {
  localStorage.setItem(
    STORAGE_KEYS.cart,
    JSON.stringify([{ productId: 'expresso-tradicional', quantity: 1 }]),
  )
  window.history.replaceState({}, '', '/checkout')
  vi.stubGlobal(
    'fetch',
    vi.fn().mockResolvedValue({
      ok: true,
      json: async () => ({
        logradouro: 'Rua Teste',
        bairro: 'Centro',
        localidade: 'São Paulo',
        uf: 'SP',
      }),
    }),
  )
  const setItem = Storage.prototype.setItem
  vi.spyOn(Storage.prototype, 'setItem').mockImplementation(function (
    this: Storage,
    key,
    value,
  ) {
    if (key === STORAGE_KEYS.order) throw new Error('quota')
    return setItem.call(this, key, value)
  })
  const user = userEvent.setup()
  render(
    <CartProvider>
      <App />
    </CartProvider>,
  )
  await user.type(screen.getByLabelText('CEP'), '01001000')
  await screen.findByDisplayValue('Rua Teste')
  await user.type(screen.getByLabelText('Número'), '10')
  await user.click(screen.getByLabelText('Dinheiro'))
  await user.click(screen.getByRole('button', { name: 'Confirmar pedido' }))
  expect(
    await screen.findByText(
      'Não foi possível salvar o pedido. Tente novamente.',
    ),
  ).toBeInTheDocument()
  expect(
    screen.getByRole('link', { name: 'Carrinho: 1 unidades' }),
  ).toBeInTheDocument()
})
