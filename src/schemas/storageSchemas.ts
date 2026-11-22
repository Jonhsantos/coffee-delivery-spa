import { z } from 'zod'
import type { CartItem } from '../types/cart'
import type { Coffee } from '../types/coffee'
import { selectCartTotals } from '../utils/cartSelectors'
import { calculateTotals } from '../utils/money'

const positiveInteger = z.int().positive()
const text = z.string().trim().min(1)
const itemSchema = z.object({ productId: text, quantity: positiveInteger })
export const themeSchema = z.enum(['light', 'dark'])
const ufs = [
  'AC',
  'AL',
  'AP',
  'AM',
  'BA',
  'CE',
  'DF',
  'ES',
  'GO',
  'MA',
  'MT',
  'MS',
  'MG',
  'PA',
  'PB',
  'PR',
  'PE',
  'PI',
  'RJ',
  'RN',
  'RS',
  'RO',
  'RR',
  'SC',
  'SP',
  'SE',
  'TO',
] as const

export const orderSchema = z
  .object({
    id: text,
    createdAt: z.iso.datetime({ offset: true }),
    items: z
      .array(
        z.object({
          productId: text,
          name: text,
          priceCents: positiveInteger,
          quantity: positiveInteger,
          lineTotalCents: positiveInteger,
        }),
      )
      .min(1),
    address: z.object({
      cep: z.string().regex(/^\d{8}$/),
      street: text,
      number: text,
      complement: z.string().optional(),
      neighborhood: text,
      city: text,
      uf: z.enum(ufs),
    }),
    paymentMethod: z.enum(['credit', 'debit', 'cash']),
    subtotalCents: z.int().nonnegative(),
    deliveryFeeCents: z.int().nonnegative(),
    totalCents: z.int().nonnegative(),
  })
  .superRefine((order, ctx) => {
    try {
      const ids = new Set(order.items.map((item) => item.productId))
      const totals = calculateTotals(order.items)
      const valid =
        ids.size === order.items.length &&
        order.items.every(
          (item) =>
            Number.isSafeInteger(item.priceCents * item.quantity) &&
            item.lineTotalCents === item.priceCents * item.quantity,
        ) &&
        totals.subtotalCents === order.subtotalCents &&
        totals.deliveryFeeCents === order.deliveryFeeCents &&
        totals.totalCents === order.totalCents
      if (!valid)
        ctx.addIssue({ code: 'custom', message: 'Pedido inconsistente.' })
    } catch {
      ctx.addIssue({ code: 'custom', message: 'Pedido inconsistente.' })
    }
  })

export function sanitizeCart(
  input: unknown,
  catalog: Readonly<Record<string, Coffee>>,
): CartItem[] {
  if (!Array.isArray(input)) return []
  const items = new Map<string, number>()
  for (const candidate of input) {
    const parsed = itemSchema.safeParse(candidate)
    if (!parsed.success || !Object.hasOwn(catalog, parsed.data.productId))
      continue
    const sum = (items.get(parsed.data.productId) ?? 0) + parsed.data.quantity
    if (!Number.isSafeInteger(sum)) continue
    const next = new Map(items)
    next.set(parsed.data.productId, sum)
    try {
      selectCartTotals(
        [...next].map(([productId, quantity]) => ({ productId, quantity })),
        catalog,
      )
      items.set(parsed.data.productId, sum)
    } catch {
      continue
    }
  }
  return [...items].map(([productId, quantity]) => ({ productId, quantity }))
}
