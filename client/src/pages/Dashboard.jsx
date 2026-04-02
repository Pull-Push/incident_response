import NavBar from "../components/NavBar"
import WeatherMap from "../components/Weather"

export default function Dashboard() {
    return (
        <div className="page-main">
            <NavBar />
            <div className="page-content">
                <div className="page-header">
                    <h1>Dashboard</h1>
                </div>
                <WeatherMap />
            </div>
        </div>
    )
}
