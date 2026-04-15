import { useEffect, useRef } from 'react'
import maplibregl from 'maplibre-gl'
import 'maplibre-gl/dist/maplibre-gl.css'

export default function SiteMap({props}) {
        const mapContainer = useRef(null)
        const map = useRef(null)
        const mainLong = (props.mainLong ? props.mainLong : -74.059)
        const mainLat = (props.mainLat? props.mainLat : 40.948)
        const subSites = props.subsites

        useEffect(() =>{
            const timer = setTimeout(() => {
                if (map.current) return
                if (!mapContainer.current) return
                    map.current = new maplibregl.Map({
                        container: mapContainer.current,
                        style: 'https://tiles.openfreemap.org/styles/bright',
                        center: [mainLong, mainLat],
                        zoom: 12
                    })
                map.current.addControl(new maplibregl.NavigationControl(), 'top-right')
    
                const marker = new maplibregl.Marker({ 
                    color: "#EA4335",
                    draggable: true 
                    })
                    .setLngLat([mainLong, mainLat])
                    .addTo(map.current)

                marker.on('click', () => {
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
    }, [mainLong, mainLat, subSites])

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