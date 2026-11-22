import { useState } from 'react'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { expect, test, vi } from 'vitest'
import { QuantityControl } from '../components/QuantityControl'

function Example() {
  const [quantity, setQuantity] = useState(1)
  return (
    <QuantityControl
      productName="Café"
      quantity={quantity}
      onChange={setQuantity}
    />
  )
}

test('controla quantidade por clique e teclado, respeitando mínimo', async () => {
  const user = userEvent.setup()
  render(<Example />)
  const minus = screen.getByRole('button', {
    name: 'Diminuir quantidade de Café',
  })
  const plus = screen.getByRole('button', {
    name: 'Aumentar quantidade de Café',
  })
  expect(minus).toBeDisabled()
  await user.tab()
  expect(plus).toHaveFocus()
  await user.keyboard('{Enter}')
  expect(screen.getByText('2')).toBeInTheDocument()
  await user.click(minus)
  expect(screen.getByText('1')).toBeInTheDocument()
  expect(minus).toBeDisabled()
})

test.each([0, -1, 1.5, Number.MAX_SAFE_INTEGER + 1])(
  'bloqueia quantidade inválida %s',
  async (quantity) => {
    const onChange = vi.fn()
    render(
      <QuantityControl
        productName="Café"
        quantity={quantity}
        onChange={onChange}
      />,
    )
    expect(screen.getByRole('button', { name: /aumentar/i })).toBeDisabled()
    expect(screen.getByRole('button', { name: /diminuir/i })).toBeDisabled()
    expect(onChange).not.toHaveBeenCalled()
  },
)

test('bloqueia incremento acima do inteiro seguro', () => {
  render(
    <QuantityControl
      productName="Café"
      quantity={Number.MAX_SAFE_INTEGER}
      onChange={vi.fn()}
    />,
  )
  expect(screen.getByRole('button', { name: /aumentar/i })).toBeDisabled()
})
