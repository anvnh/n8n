// LocalStorage utility wrapper with type safety

const PREFIX = 'n8n_dashboard_'

export const storage = {
  get<T>(key: string, defaultValue?: T): T | null {
    try {
      const item = localStorage.getItem(PREFIX + key)
      return item ? JSON.parse(item) : (defaultValue ?? null)
    } catch {
      return defaultValue ?? null
    }
  },

  set<T>(key: string, value: T): void {
    try {
      localStorage.setItem(PREFIX + key, JSON.stringify(value))
    } catch (error) {
      console.error(`Failed to save ${key} to localStorage`, error)
    }
  },

  remove(key: string): void {
    localStorage.removeItem(PREFIX + key)
  },

  clear(): void {
    const keys = Object.keys(localStorage)
    keys.filter(k => k.startsWith(PREFIX)).forEach(k => localStorage.removeItem(k))
  },
}
