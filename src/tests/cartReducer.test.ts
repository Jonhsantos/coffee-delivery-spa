import { describe, expect, it } from 'vitest'
import { createCartReducer } from '../reducers/cartReducer'
import type { Coffee } from '../types/coffee'

const coffee: Coffee = {
  id: 'a',
  name: 'Teste',
  description: '',
  imageUrl: '',
  category: 'teste',
  priceCents: 100,
}
const reducer = createCartReducer({ a: coffee, b: { ...coffee, id: 'b' } })

describe('reducer do carrinho', () => {
  it('consolida e mantém estado anterior imutável', () => {
    const initial = [{ productId: 'a', quantity: 2 }]
    const next = reducer(initial, {
      type: 'ADD_ITEM',
      productId: 'a',
      quantity: 3,
    })
    expect(next).toEqual([{ productId: 'a', quantity: 5 }])
    expect(initial).toEqual([{ productId: 'a', quantity: 2 }])
    expect(
      reducer(next, { type: 'ADD_ITEM', productId: 'b', quantity: 1 }),
    ).toHaveLength(2)
  })
  it.each([0, -1, 1.5, Number.MAX_SAFE_INTEGER + 1])(
    'rejeita quantidade %s',
    (quantity) => {
      expect(
        reducer([], { type: 'ADD_ITEM', productId: 'a', quantity }),
      ).toEqual([])
    },
  )
  it('rejeita produto desconhecido e overflow', () => {
    expect(
      reducer([], { type: 'ADD_ITEM', productId: '__proto__', quantity: 1 }),
    ).toEqual([])
    const items = [{ productId: 'a', quantity: Number.MAX_SAFE_INTEGER }]
    expect(
      reducer(items, { type: 'ADD_ITEM', productId: 'a', quantity: 1 }),
    ).toBe(items)
    expect(reducer(items, { type: 'INCREMENT_ITEM', productId: 'a' })).toBe(
      items,
    )
  })
  it('incrementa, decrementa, remove e limpa', () => {
    const items = [{ productId: 'a', quantity: 1 }]
    expect(
      reducer(items, { type: 'INCREMENT_ITEM', productId: 'a' })[0].quantity,
    ).toBe(2)
    expect(reducer(items, { type: 'DECREMENT_ITEM', productId: 'a' })).toEqual(
      [],
    )
    expect(reducer(items, { type: 'REMOVE_ITEM', productId: 'a' })).toEqual([])
    expect(reducer(items, { type: 'CLEAR_CART' })).toEqual([])
  })
})
