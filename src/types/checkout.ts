export type PaymentMethod = 'credit' | 'debit' | 'cash'
export type Theme = 'light' | 'dark'

export interface DeliveryAddress {
  cep: string
  street: string
  number: string
  complement?: string
  neighborhood: string
  city: string
  uf: string
}
