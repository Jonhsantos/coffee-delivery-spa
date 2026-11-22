import type { DeliveryAddress, PaymentMethod } from './checkout'
import type { Coffee } from './coffee'

export interface OrderItemSnapshot {
  productId: Coffee['id']
  name: string
  priceCents: number
  quantity: number
  lineTotalCents: number
}

export interface Order {
  id: string
  createdAt: string
  items: OrderItemSnapshot[]
  address: DeliveryAddress
  paymentMethod: PaymentMethod
  subtotalCents: number
  deliveryFeeCents: number
  totalCents: number
}
