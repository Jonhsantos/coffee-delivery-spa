import { render, screen } from '@testing-library/react'
import { expect, test } from 'vitest'
import App from '../App'

test('renderiza a base da aplicação', () => {
  render(<App />)

  expect(
    screen.getByRole('heading', { name: 'Coffee Delivery' }),
  ).toBeInTheDocument()
})
