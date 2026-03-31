const pool = require('../db')

//get all incidents
async function getIncidents() {
    try {
        const result = await pool.query(
            `SELECT i.*, c.name AS customer, u.first_name || ' ' || u.last_name AS technician, cb.first_name || ' ' || cb.last_name AS created_by
            FROM incidents i
            LEFT JOIN customers c ON i.customer_id = c.id
            LEFT JOIN users u ON i.tech_assigned = u.id
            LEFT JOIN users cb ON i.created_by = cb.id
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
            `SELECT i.*, c.name AS customer, u.first_name || ' ' || u.last_name AS technician, cb.first_name || ' ' || cb.last_name AS created_by
            FROM incidents i
            LEFT JOIN customers c ON i.customer_id = c.id
            LEFT JOIN users u ON i.tech_assigned = u.id 
            LEFT JOIN users cb ON i.created_by = cb.id
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
        const {customer_id, make, model, serial, location, physical_damage, water_damage, incident_type, notes, tech_assigned, status, created_by } = incident_data
        const result = await pool.query(
            `INSERT into incidents (customer_id, make, model, serial, location, physical_damage, water_damage, incident_type, notes, tech_assigned, status, created_by)
            VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12)
            RETURNING *`,
            [customer_id, make, model, serial, location, physical_damage || false, water_damage || false, incident_type, notes, tech_assigned || null, status || 'open', created_by]
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
        const {status, technician_notes, tech_assigned } = updateData
        const result = await pool.query(
            `UPDATE incidents
            SET status = COALESCE($1, status),
                technician_notes = COALESCE($2, technician_notes),
                tech_assigned = COALESCE($3, tech_assigned)
            WHERE id = $4
            RETURNING *`,
            [status, technician_notes, tech_assigned, incident_id]
        )
        return result.rows[0]
    } catch (error) {
        console.error('Error updating incident', error)
        throw error
    }
}

module.exports = { getIncidents, getIndyIncident, insertIncident, updateIncident }