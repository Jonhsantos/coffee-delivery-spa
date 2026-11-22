import { describe, expect, it } from 'vitest'
import { calculateTotals, DELIVERY_FEE_CENTS, formatBRL } from '../utils/money'

describe('valores monetários', () => {
  it('calcula valores em centavos e frete fixo', () => {
    expect(DELIVERY_FEE_CENTS).toBe(500)
    expect(
      calculateTotals([
        { priceCents: 890, quantity: 2 },
        { priceCents: 1250, quantity: 1 },
      ]),
    ).toEqual({
      subtotalCents: 3030,
      deliveryFeeCents: 500,
      totalCents: 3530,
    })
    expect(formatBRL(3530).replace(/\s/g, ' ')).toBe('R$ 35,30')
  })

  it('zera o frete no carrinho vazio', () => {
    expect(calculateTotals([])).toEqual({
      subtotalCents: 0,
      deliveryFeeCents: 0,
      totalCents: 0,
    })
  })

  it.each([
    { priceCents: 0, quantity: 1 },
    { priceCents: 100, quantity: -1 },
    { priceCents: 1.5, quantity: 1 },
    { priceCents: 1, quantity: 1.5 },
    { priceCents: Number.MAX_SAFE_INTEGER, quantity: 2 },
    { priceCents: Number.MAX_SAFE_INTEGER, quantity: 1 },
  ])('rejeita item inválido ou overflow: %o', (item) => {
    expect(() => calculateTotals([item])).toThrow(RangeError)
  })

  it('rejeita valores inválidos na formatação', () => {
    expect(() => formatBRL(-1)).toThrow(RangeError)
    expect(() => formatBRL(1.5)).toThrow(RangeError)
  })

  it('preserva centavos no limite inteiro seguro', () => {
    expect(formatBRL(Number.MAX_SAFE_INTEGER).replace(/\s/g, ' ')).toBe(
      'R$ 90.071.992.547.409,91',
    )
  })
})
