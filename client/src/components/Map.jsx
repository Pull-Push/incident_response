import { useEffect, useRef } from 'react'
import maplibregl from 'maplibre-gl'
import 'maplibre-gl/dist/maplibre-gl.css'

export default function Map(){
    const mapContainer = useRef(null)
    const map = useRef(null)
    
    useEffect(() => {
            const timer = setTimeout(() =>{

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
                }, 100)
            return () => { 
                clearTimeout(timer)
                map.current?.remove() }
        }, [])
    return(
            <div className="map-section">
                <div className="section-header">
                    <h2>🗺 Service Area Map</h2>
                </div>
                <div className="map-container">
                    <div ref={mapContainer} className="map-canvas" />
                </div>
            </div>
    )
}