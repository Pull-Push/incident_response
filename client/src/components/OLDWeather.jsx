import { useEffect, useState, useRef } from "react"
import { getDash } from "../services/api"
import maplibregl from 'maplibre-gl'
import 'maplibre-gl/dist/maplibre-gl.css'

export default function WeatherMap() {
    const [weather, setWeather] = useState(null)
    const [location, setLocation] = useState(null)
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState(null)

    const mapContainer = useRef(null)
    const map = useRef(null)

    useEffect(() => {
        const fetchWeather = async () => {
            try {
                setLoading(true)
                const data = await getDash()
                setWeather(data.local)
                setLocation(data.locationInfo)
            } catch (err) {
                setError(err.message)
                console.error("error fetching weather", err)
            } finally {
                setLoading(false)
            }
        }
        fetchWeather()
    }, [])

    useEffect(() => {
        if (map.current) return
        if (!mapContainer.current) return

        map.current = new maplibregl.Map({
            container: mapContainer.current,
            style: 'https://tiles.openfreemap.org/styles/bright',
            center: [-74.059, 40.948],
            zoom: 10
        })

        map.current.addControl(new maplibregl.NavigationControl(), 'top-right')

        const marker = new maplibregl.Marker({ draggable: true })
            .setLngLat([-74.06880195032551, 40.94538141690225])
            .addTo(map.current)

        marker.on('dragend', () => {
            const lngLat = marker.getLngLat()
            if (confirm('Open in Google Maps?')) {
                window.open(
                    `https://www.google.com/maps/search/?api=1&query=${lngLat.lat},${lngLat.lng}`,
                    '_blank',
                    'noopener,noreferrer'
                )
            }
        })

        map.current.addControl(
            new maplibregl.GeolocateControl({
                positionOptions: { enableHighAccuracy: true },
                trackUserLocation: true
            })
        )

        return () => { map.current?.remove() }
    }, [loading])

    if (loading) return <div className="loading">Loading weather data...</div>
    if (error) return <div className="error-banner">{error}</div>

    // Split weather into day/night pairs for display
    const dayPeriods = weather.filter((_, i) => i % 2 === 0).slice(0, 4)
    const nightPeriods = weather.filter((_, i) => i % 2 !== 0).slice(0, 4)

    return (
        <div className="weather-map-container">
            {/* Weather Section */}
            

            {/* Map Section */}
            <div className="map-section">
                <div className="section-header">
                    <h2>🗺 Service Area Map</h2>
                </div>
                <div className="map-container">
                    <div ref={mapContainer} className="map-canvas" />
                </div>
            </div>
        </div>
    )
}
