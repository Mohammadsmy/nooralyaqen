import { createContext, useCallback, useContext, useEffect, useState } from 'react'
import { ls } from '../utils/helpers'

// The visitor's place, shared by Home, Prayer Times and Qibla.
// It comes from the device (GPS) or from a city the visitor picked, and is remembered.
const PlaceContext = createContext(null)
const KEY = 'noorpath-place'

function gpsMessage(err) {
  if (!navigator.geolocation) return 'This browser cannot share your location. Search for your city instead.'
  if (err?.code === 1) return 'Location access is turned off for this site. Search for your city instead.'
  if (err?.code === 3) return 'Finding your location took too long. Search for your city instead.'
  return 'Your location could not be found. Search for your city instead.'
}

export function PlaceProvider({ children }) {
  const [place, setPlaceState] = useState(() => ls.get(KEY, null))
  const [locating, setLocating] = useState(false)
  const [error, setError] = useState(null)

  const setPlace = useCallback((p) => {
    setPlaceState(p)
    setError(null)
    ls.set(KEY, p)
  }, [])

  const locate = useCallback(() => {
    if (!navigator.geolocation) { setError(gpsMessage()); return }
    setLocating(true)
    setError(null)
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        setPlace({ name: 'Your location', region: '', lat: pos.coords.latitude, lon: pos.coords.longitude, source: 'gps' })
        setLocating(false)
      },
      (err) => { setError(gpsMessage(err)); setLocating(false) },
      { timeout: 10000, maximumAge: 600000 }
    )
  }, [setPlace])

  // A saved GPS fix is refreshed quietly; a city the visitor chose is kept as is.
  useEffect(() => {
    if (place?.source === 'gps' && navigator.permissions?.query) {
      navigator.permissions.query({ name: 'geolocation' }).then(s => { if (s.state === 'granted') locate() }).catch(() => {})
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  return (
    <PlaceContext.Provider value={{ place, setPlace, locate, locating, error }}>
      {children}
    </PlaceContext.Provider>
  )
}

export function usePlace() {
  return useContext(PlaceContext)
}
