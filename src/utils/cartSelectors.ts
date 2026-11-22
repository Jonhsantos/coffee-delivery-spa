import type { CartItem } from '../types/cart'
import type { Coffee } from '../types/coffee'
import { calculateTotals } from './money'

export function selectCartTotals(
  items: readonly CartItem[],
  catalogById: Readonly<Record<string, Coffee>>,
) {
  let unitCount = 0
  const seen = new Set<string>()
  const pricedItems = items.map((item) => {
    if (
      !Object.hasOwn(catalogById, item.productId) ||
      seen.has(item.productId) ||
      !Number.isSafeInteger(item.quantity) ||
      item.quantity < 1
    ) {
      throw new RangeError('Item de carrinho inválido.')
    }
    seen.add(item.productId)
    unitCount += item.quantity
    if (!Number.isSafeInteger(unitCount))
      throw new RangeError('Quantidade excede o limite seguro.')
    return {
      priceCents: catalogById[item.productId].priceCents,
      quantity: item.quantity,
    }
  })
  return { unitCount, ...calculateTotals(pricedItems) }
}
