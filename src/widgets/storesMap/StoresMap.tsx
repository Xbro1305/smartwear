import { useEffect } from 'react'
import { MapContainer, Marker, TileLayer, useMap } from 'react-leaflet'
import * as L from 'leaflet'
import 'leaflet/dist/leaflet.css'

// Красный «пин» (teardrop) как кастомная иконка Leaflet
const redPin = L.divIcon({
  className: '',
  iconSize: [30, 40],
  iconAnchor: [15, 40],
  html: `<svg width="30" height="40" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
    <path fill="#DC2A1F" stroke="#ffffff" stroke-width="0.6"
      d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5a2.5 2.5 0 1 1 0-5 2.5 2.5 0 0 1 0 5z"/>
  </svg>`,
})

function FitBounds({ points }: { points: [number, number][] }) {
  const map = useMap()
  useEffect(() => {
    if (points.length === 1) {
      map.setView(points[0], 15)
    } else if (points.length > 1) {
      map.fitBounds(points as L.LatLngBoundsExpression, { padding: [50, 50], maxZoom: 15 })
    }
  }, [points, map])
  return null
}

// points — массив [lat, lng]
export const StoresMap = ({ points }: { points: [number, number][] }) => {
  if (!points.length) return null
  return (
    <MapContainer
      center={points[0]}
      zoom={12}
      scrollWheelZoom={false}
      style={{ height: '100%', width: '100%' }}
    >
      <TileLayer
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
      />
      {points.map((p, i) => (
        <Marker key={i} position={p} icon={redPin} />
      ))}
      <FitBounds points={points} />
    </MapContainer>
  )
}
