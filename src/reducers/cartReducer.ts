import type { CartItem } from '../types/cart'
import type { Coffee } from '../types/coffee'

export type CartAction =
  | { type: 'ADD_ITEM'; productId: string; quantity: number }
  | { type: 'INCREMENT_ITEM'; productId: string }
  | { type: 'DECREMENT_ITEM'; productId: string }
  | { type: 'REMOVE_ITEM'; productId: string }
  | { type: 'CLEAR_CART' }

export function createCartReducer(
  catalogById: Readonly<Record<string, Coffee>>,
) {
  return (items: CartItem[], action: CartAction): CartItem[] => {
    if (action.type === 'CLEAR_CART') return []
    const index = items.findIndex((item) => item.productId === action.productId)
    if (action.type === 'ADD_ITEM') {
      if (
        !Object.hasOwn(catalogById, action.productId) ||
        !Number.isSafeInteger(action.quantity) ||
        action.quantity < 1
      )
        return items
      if (index < 0)
        return [
          ...items,
          { productId: action.productId, quantity: action.quantity },
        ]
      const quantity = items[index].quantity + action.quantity
      if (!Number.isSafeInteger(quantity)) return items
      return items.map((item, i) =>
        i === index ? { ...item, quantity } : item,
      )
    }
    if (index < 0) return items
    if (
      action.type === 'REMOVE_ITEM' ||
      (action.type === 'DECREMENT_ITEM' && items[index].quantity === 1)
    ) {
      return items.filter((_, i) => i !== index)
    }
    const quantity =
      items[index].quantity + (action.type === 'INCREMENT_ITEM' ? 1 : -1)
    if (!Number.isSafeInteger(quantity) || quantity < 1) return items
    return items.map((item, i) => (i === index ? { ...item, quantity } : item))
  }
}
