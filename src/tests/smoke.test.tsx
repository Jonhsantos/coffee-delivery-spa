import { render, screen } from '@testing-library/react'
import { expect, test } from 'vitest'
import App from '../App'
import { CartProvider } from '../contexts/CartProvider'

test('renderiza a base da aplicação', () => {
  render(
    <CartProvider>
      <App />
    </CartProvider>,
  )

  expect(
    screen.getByRole('heading', { name: 'Nossos cafés' }),
  ).toBeInTheDocument()
})
