import { createContext } from 'react'
import type { CartItem } from '../types/cart'

export interface CartContextValue {
  items: CartItem[]
  unitCount: number
  subtotalCents: number
  deliveryFeeCents: number
  totalCents: number
  addItem(productId: string, quantity: number): void
  incrementItem(productId: string): void
  decrementItem(productId: string): void
  removeItem(productId: string): void
  clearCart(): void
}

export const CartContext = createContext<CartContextValue | null>(null)
