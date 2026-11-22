import { expect, test } from 'vitest'
import { coffees } from '../data/coffees'

test('catálogo tem IDs únicos, preços válidos e imagens distintas', () => {
  expect(coffees).toHaveLength(14)
  expect(new Set(coffees.map((coffee) => coffee.id)).size).toBe(coffees.length)
  expect(new Set(coffees.map((coffee) => coffee.imageUrl)).size).toBe(
    coffees.length,
  )
  for (const coffee of coffees) {
    expect(coffee.name.trim()).not.toBe('')
    expect(coffee.description.trim()).not.toBe('')
    expect(coffee.category.trim()).not.toBe('')
    expect(Number.isSafeInteger(coffee.priceCents)).toBe(true)
    expect(coffee.priceCents).toBeGreaterThan(0)
    expect(coffee.imageUrl).toMatch(/\.png(?:\?.*)?$/)
  }
})
