import { useEffect, useState, useRef  } from "react";
import { getWeather } from "../services/api";
import NavBar from "../components/NavBar";

import maplibregl, { Marker } from 'maplibre-gl';
import 'maplibre-gl/dist/maplibre-gl.css';


export default function Dashboard(){
const [weather, setWeather ] = useState(null)
const [location, setLocation] = useState(null)
const [loading, setLoading ] = useState(true)
const [error, setError ] = useState(null);

const mapContainer = useRef(null)
const map = useRef(null)

useEffect(()=>{
    const fetchWeather = async () =>{
        try {
            setLoading(true);
            const data = await getWeather();
            console.log('data', data)
            setWeather(data.local)
            setLocation(data.locationInfo)
        }catch(err){
            setError(err.message)
            console.error("error fetching weather", err)
        }finally{
            setLoading(false)
        }
    }
    fetchWeather();


},[])
// BELOW WORKS FOR MAP!
useEffect(() =>{
    if (map.current) return;
    if(!mapContainer.current) return;
    map.current = new maplibregl.Map({
        container: mapContainer.current,
        // style: 'https://demotiles.maplibre.org/style.json',
        style: 'https://tiles.openfreemap.org/styles/bright',
        center: [-74.059, 40.948],
        zoom: 10
    });

    //Add Navigation Control
    map.current.addControl(new maplibregl.NavigationControl(), 'top-right')

    //Add A Marker
    const marker = new maplibregl.Marker({draggable:true})
    .setLngLat([-74.06880195032551, 40.94538141690225])
    .addTo(map.current)
    
    function onDragEnd(){
        const lngLat = marker.getLngLat()
        if (confirm('Open in Google Maps?') == true) {
            window.open(`https://www.google.com/maps/search/?api=1&query=${lngLat.lat},${lngLat.lng}`, '_blank', 'noopener,noreferrer');
        }
    }
    marker.on('dragend', onDragEnd)

    // WORKS FOR MULTIPLE MAP MARKERS
    // new maplibregl.Marker()
    // .setLngLat([-74.2776212, 41.006709])
    // .addTo(map.current)


    //geoloacte
    map.current.addControl(
        new maplibregl.GeolocateControl({
            positionOptions: {
                enableHighAccuracy: true
            },
            trackUserLocation: true
        })
    );


    return () =>{
        map.current?. remove();
    }
}, [loading])

    if (loading) return <div> Data Loading</div>
    if(error) return <div>Error: {error}</div>

    return(
        <div className="dashMain">
            <NavBar/>
            <h1>Welcome to the dashboard</h1>
            <h2>Weather for {location.name}, {location.state}</h2>
            {weather.map((day, index) =>(
                <div key={index}>
                    <p>{day.name}</p>
                    <img src={day.icon} alt={day.shortForecast} />
                    <p>{day.temperature} {day.temperatureUnit}</p>
                    <p>{day.detailedForecast}</p>
                </div>
            ))}
            {/* <pre>{JSON.stringify(weather, null, 2)}</pre> */}
            <div className="mapMain">
                <div ref={mapContainer} style={{ width:'100%', height: '500px'}}></div>
            </div>
        </div>
    )
}