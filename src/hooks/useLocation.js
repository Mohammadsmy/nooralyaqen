import { useState, useEffect } from 'react'

export function useLocation() {
  const [location, setLocation] = useState(null)
  const [error, setError] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!navigator.geolocation) {
      setError('Geolocation is not supported by your browser.')
      setLoading(false)
      return
    }

    navigator.geolocation.getCurrentPosition(
      (pos) => {
        setLocation({ lat: pos.coords.latitude, lon: pos.coords.longitude })
        setLoading(false)
      },
      (err) => {
        setError(err.message || 'Location permission denied.')
        setLoading(false)
      },
      { timeout: 10000 }
    )
  }, [])

  return { location, error, loading }
}
