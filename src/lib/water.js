const WATER_PROGRESS_STORAGE_KEY = "fsc-task-manager:water-progress"

const getTodayKey = () => {
  const today = new Date()
  const year = today.getFullYear()
  const month = `${today.getMonth() + 1}`.padStart(2, "0")
  const day = `${today.getDate()}`.padStart(2, "0")

  return `${year}-${month}-${day}`
}

const getStorageKey = () => `${WATER_PROGRESS_STORAGE_KEY}:${getTodayKey()}`

export const createWaterOptions = (options, selectedMl = 0) =>
  options.map((option) => ({
    ...option,
    checked: selectedMl > 0 && option.valueMl <= selectedMl,
  }))

export const getStoredWaterSelection = () => {
  if (typeof window === "undefined") {
    return 0
  }

  const storedValue = window.localStorage.getItem(getStorageKey())
  const parsedValue = Number(storedValue)

  return Number.isFinite(parsedValue) ? parsedValue : 0
}

export const persistWaterSelection = (selectedMl) => {
  if (typeof window === "undefined") {
    return
  }

  window.localStorage.setItem(getStorageKey(), String(selectedMl))
}

export const clearStoredWaterSelection = () => {
  if (typeof window === "undefined") {
    return
  }

  window.localStorage.removeItem(getStorageKey())
}
