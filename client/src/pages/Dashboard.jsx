import NavBar from "../components/NavBar";
import WeatherMap from "../components/Weather";

export default function Dashboard(){

    return(
        <div className="dashMain">
            <NavBar/>
            <h1>Welcome to the dashboard</h1>
            <WeatherMap/>
        </div>
    )
}