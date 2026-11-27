import { useEffect, useState } from "react"

// Works like useState, but also saves the value in localStorage
// so the data is still there after a page refresh.
export function useLocalStorage(key, initialValue) {
  const [value, setValue] = useState(() => {
    try {
      const saved = localStorage.getItem(key)
      return saved !== null ? JSON.parse(saved) : initialValue
    } catch {
      return initialValue
    }
  })

  // useEffect runs after render whenever `value` changes -> save it.
  useEffect(() => {
    try {
      localStorage.setItem(key, JSON.stringify(value))
    } catch {
      // storage can be blocked (private mode); the app still works in memory
    }
  }, [key, value])

  return [value, setValue]
}
