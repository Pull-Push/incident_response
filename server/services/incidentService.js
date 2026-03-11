const pool = require('../db')

//get all incidents
async function getIncidents() {
    try {
        const result = await pool.query(
            `SELECT i.*, c.name AS customer, u.first_name || ' ' || u.last_name AS technician
             FROM incident i
             LEFT JOIN customers c ON i.customer_id = c.id
             LEFT JOIN users u ON i.tech_assigned = u.id
             ORDER BY i.created_at DESC`
        )
        return result.rows
    } catch (error) {
        console.error('Failed to get incidents', error)
        throw error
    }
}


//get singe incident
async function getIndyIncident(incident_id) {
    try {
        const result = await pool.query(
            `SELECT i.*, c.name AS customer, u.first_name || ' ' || u.last_name AS technician
            FROM incident i
            LEFT JOIN customers c ON i.customer_id = c.id
            LEFT JOIN users u ON i.tech_assigned = u.id 
            WHERE i.id = $1`,
            [incident_id]
        )
        return result.rows[0]
    } catch (error) {
        console.error('Failed to get incident', error)
        throw error
    }
}

//create incident
async function insertIncident(incident_data) {
    try {
        const {customer_id, make, model, serial, location, physical_damage, water_damage, incident_type, notes, tech_assigned, status } = incident_data
        const result = await pool.query(
            `INSERT into incident (customer_id, make, model, serial, location, physical_damage, water_damage, incident_type, notes, tech_assigned, status)
            VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11)
            RETURNING *`,
            [customer_id, make, model, serial, location, physical_damage || false, water_damage || false, incident_type, notes, tech_assigned || null, status || 'OPEN']
        )
        return result.rows[0]
    } catch (error) {
        console.error('Error inserting incident', error)
        throw error
    }
}

//update incident (mark complete, add tech notes)
async function updateIncident(incident_id, updateData) {
    try {
        const {is_complete, technician_notes, tech_assigned } = updateData
        const result = await pool.query(
            `UPDATE incident
            SET is_complete = COALESCE($1, is_complete),
                technician_notes = COALESCE($2, technician_notes),
                tech_assigned = COALESCE($3, tech_assigned),
                updated_at = CURRENT_TIMESTAMP
            WHERE id = $4
            RETURNING *`,
            [is_complete, technician_notes, tech_assigned, incident_id]
        )
        return result.rows[0]
    } catch (error) {
        console.error('Error updating incident', error)
        throw error
    }
}

module.exports = { getIncidents, getIndyIncident, insertIncident, updateIncident }