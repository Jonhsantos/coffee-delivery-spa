import { useEffect, useReducer, useState, type ReactNode } from 'react'
import { coffees } from '../data/coffees'
import { createCartReducer, type CartAction } from '../reducers/cartReducer'
import { sanitizeCart } from '../schemas/storageSchemas'
import { readStorage, STORAGE_KEYS, writeStorage } from '../services/storage'
import type { CartItem } from '../types/cart'
import { selectCartTotals } from '../utils/cartSelectors'
import { CartContext } from './CartContext'

const catalog = Object.fromEntries(coffees.map((coffee) => [coffee.id, coffee]))
const cartReducer = createCartReducer(catalog)

function safeReducer(items: CartItem[], action: CartAction): CartItem[] {
  const next = cartReducer(items, action)
  try {
    selectCartTotals(next, catalog)
    return next
  } catch {
    return items
  }
}

function initialCart() {
  const stored = readStorage(STORAGE_KEYS.cart)
  return {
    items: stored.status === 'ok' ? sanitizeCart(stored.value, catalog) : [],
    readable: stored.status !== 'unavailable',
  }
}

export function CartProvider({ children }: { children: ReactNode }) {
  const [initial] = useState(initialCart)
  const [items, dispatch] = useReducer(safeReducer, initial.items)
  const [storageFailed, setStorageFailed] = useState(false)
  const totals = selectCartTotals(items, catalog)

  useEffect(() => {
    if (!initial.readable) return
    let active = true
    queueMicrotask(() => {
      if (active) setStorageFailed(!writeStorage(STORAGE_KEYS.cart, items))
    })
    return () => {
      active = false
    }
  }, [initial.readable, items])

  return (
    <CartContext.Provider
      value={{
        items,
        ...totals,
        addItem: (productId, quantity) =>
          dispatch({ type: 'ADD_ITEM', productId, quantity }),
        incrementItem: (productId) =>
          dispatch({ type: 'INCREMENT_ITEM', productId }),
        decrementItem: (productId) =>
          dispatch({ type: 'DECREMENT_ITEM', productId }),
        removeItem: (productId) => dispatch({ type: 'REMOVE_ITEM', productId }),
        clearCart: () => dispatch({ type: 'CLEAR_CART' }),
      }}
    >
      {(!initial.readable || storageFailed) && (
        <p role="status">
          Não foi possível salvar o carrinho. Ele será mantido apenas nesta
          sessão.
        </p>
      )}
      {children}
    </CartContext.Provider>
  )
}
