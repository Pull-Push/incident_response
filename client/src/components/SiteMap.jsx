import { useEffect, useRef } from 'react'
import maplibregl from 'maplibre-gl'
import 'maplibre-gl/dist/maplibre-gl.css'

export default function SiteMap({ mainLat, mainLong, subsites }) {
        // console.log('props lat', mainLat)
        const mapContainer = useRef(null)
        const map = useRef(null)
        const customerMainLong = (mainLong ? mainLong : null)
        const customerMainLat = (mainLat ? mainLat : null)
        const customerSubSites = subsites
        // console.log('mainLong', mainLong)
        // console.log('mainLat', mainLat)


        useEffect(() =>{
            const timer = setTimeout(() => {
                if (map.current) return
                if (!mapContainer.current) return
                
                if(customerMainLat != null && customerMainLong != null){
                    map.current = new maplibregl.Map({
                        container: mapContainer.current,
                        style: 'https://tiles.openfreemap.org/styles/bright',
                        center: [customerMainLong, customerMainLat],
                        zoom: 12
                    })
                    map.current.addControl(new maplibregl.NavigationControl(), 'top-right')
                    
                    const marker = new maplibregl.Marker({ 
                        color: "#EA4335",
                        draggable: true 
                    })
                    .setLngLat([customerMainLong, customerMainLat])
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
                    if (customerSubSites && customerSubSites.length > 0){
                    customerSubSites.forEach(site => {
                        if (!site.lat || !site.long) return
                            const siteMarker = new maplibregl.Marker({ color: '#00D4FF', draggable:true })
                                .setLngLat([site.long, site.lat])
                                .addTo(map.current)

                        siteMarker.on('dragend', () => {
                            const lngLat = siteMarker.getLngLat()
                                if (confirm('Open in Google Maps?')) {
                                    window.open(
                                    `https://www.google.com/maps/search/?api=1&query=${lngLat.lat},${lngLat.lng}`,
                                    '_blank',
                                    'noopener,noreferrer'
                                )
                            }
                        })
                    })
                }

                }else{
                    map.current = new maplibregl.Map({
                        container: mapContainer.current,
                        style: 'https://tiles.openfreemap.org/styles/bright',
                        center: [-74.56, 40.07],
                        zoom: 7
                    })
                    map.current.addControl(new maplibregl.NavigationControl(), 'top-right')
                }
                
                // PROPER WAY TO DO MAP CLICK EVENTS! NEEDS TO BE map.currrent.on not map.on
                map.current.on('click', (e) =>{
                    // console.log('The map was clicked at ', e.lngLat)
                    if(confirm('Open in Google Maps?')) {
                        window.open(
                            `https://www.google.com/maps/search/?api=1&query=${e.lngLat.lat},${e.lngLat.lng}`,
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
        clearTimeout(timer);
        map.current?.remove(); 
        map.current = null;
    }
    }, [mainLong, mainLat, subsites])


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