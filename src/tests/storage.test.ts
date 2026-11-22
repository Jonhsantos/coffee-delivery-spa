import { afterEach, describe, expect, it, vi } from 'vitest'
import {
  orderSchema,
  sanitizeCart,
  themeSchema,
} from '../schemas/storageSchemas'
import {
  createMemoryFallbackStorage,
  readStorage,
  STORAGE_KEYS,
  writeStorage,
} from '../services/storage'
import type { Coffee } from '../types/coffee'

const coffee: Coffee = {
  id: 'a',
  name: 'Teste',
  description: '',
  imageUrl: '',
  category: 'teste',
  priceCents: 100,
}
const order = {
  id: 'pedido',
  createdAt: '2026-11-22T12:00:00.000Z',
  items: [
    {
      productId: 'a',
      name: 'Teste',
      priceCents: 100,
      quantity: 2,
      lineTotalCents: 200,
    },
  ],
  address: {
    cep: '01001000',
    street: 'Rua',
    number: '1',
    neighborhood: 'Bairro',
    city: 'Cidade',
    uf: 'SP',
  },
  paymentMethod: 'cash',
  subtotalCents: 200,
  deliveryFeeCents: 500,
  totalCents: 700,
}
afterEach(() => {
  vi.restoreAllMocks()
  localStorage.clear()
})

describe('storage validado', () => {
  it('trata ausência, JSON inválido e leitura após escrita', () => {
    expect(readStorage(STORAGE_KEYS.cart).status).toBe('missing')
    localStorage.setItem(STORAGE_KEYS.cart, '{')
    expect(readStorage(STORAGE_KEYS.cart).status).toBe('invalid')
    expect(
      writeStorage(STORAGE_KEYS.cart, [{ productId: 'a', quantity: 2 }]),
    ).toBe(true)
    expect(readStorage(STORAGE_KEYS.cart)).toEqual({
      status: 'ok',
      value: [{ productId: 'a', quantity: 2 }],
    })
  })
  it('sinaliza storage bloqueado e quota', () => {
    vi.spyOn(Storage.prototype, 'getItem').mockImplementation(() => {
      throw new Error('bloqueado')
    })
    vi.spyOn(Storage.prototype, 'setItem').mockImplementation(() => {
      throw new Error('quota')
    })
    expect(readStorage(STORAGE_KEYS.cart).status).toBe('unavailable')
    expect(writeStorage(STORAGE_KEYS.cart, [])).toBe(false)
    const fallback = createMemoryFallbackStorage()
    expect(
      fallback.write(STORAGE_KEYS.cart, [{ productId: 'a', quantity: 1 }]),
    ).toEqual({
      persisted: false,
    })
    expect(fallback.read(STORAGE_KEYS.cart)).toEqual({
      status: 'ok',
      value: [{ productId: 'a', quantity: 1 }],
    })
  })
  it('saneia itens e consolida duplicados', () => {
    expect(
      sanitizeCart(
        [
          { productId: 'a', quantity: 2 },
          { productId: 'a', quantity: 3 },
          { productId: 'b', quantity: 1 },
          { productId: 'a', quantity: -1 },
        ],
        { a: coffee },
      ),
    ).toEqual([{ productId: 'a', quantity: 5 }])
    expect(sanitizeCart({}, { a: coffee })).toEqual([])
  })
  it('valida tema e integridade do snapshot', () => {
    expect(themeSchema.safeParse('dark').success).toBe(true)
    expect(themeSchema.safeParse('invalido').success).toBe(false)
    expect(orderSchema.safeParse(order).success).toBe(true)
    expect(orderSchema.safeParse({ ...order, totalCents: 1 }).success).toBe(
      false,
    )
    expect(
      orderSchema.safeParse({
        ...order,
        address: { ...order.address, uf: 'XX' },
      }).success,
    ).toBe(false)
  })
})
