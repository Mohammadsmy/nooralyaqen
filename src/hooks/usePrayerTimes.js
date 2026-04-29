import { useState, useEffect } from 'react'
import { aladhanApi } from '../utils/api'

export function usePrayerTimes(lat, lon) {
  const [data, setData] = useState(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)

  useEffect(() => {
    if (lat == null || lon == null) return
    setLoading(true)
    setError(null)
    aladhanApi.getPrayerTimes(lat, lon)
      .then(res => setData(res.data))
      .catch(err => setError(err.message))
      .finally(() => setLoading(false))
  }, [lat, lon])

  return { data, loading, error }
}
