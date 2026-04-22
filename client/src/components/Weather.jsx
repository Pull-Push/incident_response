export default function Weather({weather, location}){
    if(!location || !weather ) return null
    
    const dayPeriods = weather.filter((_, i) => i % 2 === 0).slice(0, 4)
    const nightPeriods = weather.filter((_, i) => i % 2 !== 0).slice(0, 4)
    
    return(
    <div className="weather-section">
                <div className="section-header">
                    <h2>📍 {location.name}, {location.state}</h2>
                </div>

                <div className="weather-grid">
                    {dayPeriods.map((day, index) => {
                        const night = nightPeriods[index]
                        return (
                            <div key={index} className="weather-card">
                                <div className="weather-card-header">
                                    <span className="weather-day-name">{day.name}</span>
                                </div>
                                <div className="weather-card-body">
                                    <img
                                        src={day.icon}
                                        alt={day.shortForecast}
                                        className="weather-icon"
                                    />
                                    <div className="weather-temps">
                                        <span className="weather-temp-high">
                                            {day.temperature}°{day.temperatureUnit}
                                        </span>
                                        {night && (
                                            <span className="weather-temp-low">
                                                {night.temperature}°{night.temperatureUnit}
                                            </span>
                                        )}
                                    </div>
                                    <p className="weather-forecast">{day.shortForecast}</p>
                                </div>
                                <div className="weather-card-detail">
                                    <p>{day.detailedForecast}</p>
                                </div>
                            </div>
                        )
                    })}
                </div>
            </div>
    )
}