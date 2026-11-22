export const DELIVERY_FEE_CENTS = 500

export interface PricedItem {
  priceCents: number
  quantity: number
}

function positiveSafeInteger(value: number): boolean {
  return Number.isSafeInteger(value) && value > 0
}

export function calculateTotals(items: readonly PricedItem[]) {
  const subtotalCents = items.reduce((subtotal, item) => {
    if (
      !positiveSafeInteger(item.priceCents) ||
      !positiveSafeInteger(item.quantity)
    ) {
      throw new RangeError(
        'Preço e quantidade devem ser inteiros positivos seguros.',
      )
    }
    const lineTotal = item.priceCents * item.quantity
    const nextSubtotal = subtotal + lineTotal
    if (
      !Number.isSafeInteger(lineTotal) ||
      !Number.isSafeInteger(nextSubtotal)
    ) {
      throw new RangeError('O subtotal excede o limite seguro.')
    }
    return nextSubtotal
  }, 0)
  const deliveryFeeCents = items.length ? DELIVERY_FEE_CENTS : 0
  const totalCents = subtotalCents + deliveryFeeCents
  if (!Number.isSafeInteger(totalCents))
    throw new RangeError('O total excede o limite seguro.')
  return { subtotalCents, deliveryFeeCents, totalCents }
}

export function formatBRL(cents: number): string {
  if (!Number.isSafeInteger(cents) || cents < 0) {
    throw new RangeError('O valor deve ser um inteiro não negativo seguro.')
  }
  const value = BigInt(cents)
  const fraction = String(value % 100n).padStart(2, '0')
  return new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL',
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  })
    .formatToParts(value / 100n)
    .map((part) => (part.type === 'fraction' ? fraction : part.value))
    .join('')
}
