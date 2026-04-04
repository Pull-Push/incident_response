export default function ActiveIncidents ({activeIncidents}){
    if(!activeIncidents) return null
    return(
        <div className="active-incidents-section">
            <div className="table-wrapper">
                <table className="data-table">
                    <thead>
                        <tr>
                            <th>Incident Number</th>
                            <th>Customer Name</th>
                            <th>Incident Type</th>
                            <th>Status</th>
                            <th>Assigned Tech</th>
                        </tr>
                    </thead>
                    <tbody>
                        {activeIncidents.map(incident => (
                            <tr key={incident.id}>
                                <td>{incident.id}</td>
                                <td>{incident.customer}</td>
                                <td>{incident.incident_type}</td>
                                <td>{incident.status}</td>
                                <td>{incident.technician ? incident.technician : "None Assigned"}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    )
}