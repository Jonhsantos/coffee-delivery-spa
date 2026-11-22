import type { Coffee } from './coffee'

export interface CartItem {
  productId: Coffee['id']
  quantity: number
}
