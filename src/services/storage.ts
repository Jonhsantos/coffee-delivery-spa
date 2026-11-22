export const STORAGE_KEYS = {
  cart: 'coffee:cart:v1',
  theme: 'coffee:theme:v1',
  order: 'coffee:last-order:v1',
} as const

export type StorageRead =
  | { status: 'ok'; value: unknown }
  | { status: 'missing' | 'invalid' | 'unavailable' }

export function readStorage(key: string): StorageRead {
  try {
    const value = localStorage.getItem(key)
    if (value === null) return { status: 'missing' }
    try {
      return { status: 'ok', value: JSON.parse(value) as unknown }
    } catch {
      return { status: 'invalid' }
    }
  } catch {
    return { status: 'unavailable' }
  }
}

export function writeStorage(key: string, value: unknown): boolean {
  try {
    const json = JSON.stringify(value)
    if (json === undefined) return false
    localStorage.setItem(key, json)
    return true
  } catch {
    return false
  }
}

export function createMemoryFallbackStorage() {
  const memory = new Map<string, unknown>()
  const pending = new Set<string>()
  return {
    read(key: string): StorageRead {
      if (pending.has(key)) return { status: 'ok', value: memory.get(key) }
      const result = readStorage(key)
      if (result.status === 'unavailable' && memory.has(key)) {
        return { status: 'ok', value: memory.get(key) }
      }
      if (result.status === 'ok') memory.set(key, result.value)
      return result
    },
    write(key: string, value: unknown): { persisted: boolean } {
      memory.set(key, value)
      const persisted = writeStorage(key, value)
      if (persisted) pending.delete(key)
      else pending.add(key)
      return { persisted }
    },
  }
}
