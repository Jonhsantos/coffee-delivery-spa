import { expect, it } from 'vitest'
import type { Coffee } from '../types/coffee'
import { selectCartTotals } from '../utils/cartSelectors'

const coffee: Coffee = {
  id: 'a',
  name: 'Teste',
  description: '',
  imageUrl: '',
  category: 'teste',
  priceCents: 890,
}
const catalog = { a: coffee, b: { ...coffee, id: 'b', priceCents: 1250 } }

it('soma unidades e valores dos produtos', () => {
  expect(
    selectCartTotals(
      [
        { productId: 'a', quantity: 2 },
        { productId: 'b', quantity: 1 },
      ],
      catalog,
    ),
  ).toEqual({
    unitCount: 3,
    subtotalCents: 3030,
    deliveryFeeCents: 500,
    totalCents: 3530,
  })
})
it('calcula carrinho vazio', () => {
  expect(selectCartTotals([], catalog)).toEqual({
    unitCount: 0,
    subtotalCents: 0,
    deliveryFeeCents: 0,
    totalCents: 0,
  })
})
it('rejeita produto desconhecido, duplicado ou quantidade inválida', () => {
  expect(() =>
    selectCartTotals([{ productId: '__proto__', quantity: 1 }], catalog),
  ).toThrow()
  expect(() =>
    selectCartTotals(
      [
        { productId: 'a', quantity: 1 },
        { productId: 'a', quantity: 1 },
      ],
      catalog,
    ),
  ).toThrow()
  expect(() =>
    selectCartTotals([{ productId: 'a', quantity: 0 }], catalog),
  ).toThrow()
})
it('rejeita overflow de contagem', () => {
  expect(() =>
    selectCartTotals(
      [
        { productId: 'a', quantity: Number.MAX_SAFE_INTEGER },
        { productId: 'b', quantity: 1 },
      ],
      catalog,
    ),
  ).toThrow()
})
