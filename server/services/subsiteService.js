const pool = require('../db')


//GET SUBSITES (need customer ID)
async function getSubsites(customer_id) {
    try {
        const result = await pool.query(
            `SELECT *
            FROM subsites
            WHERE customer_id = $1 AND is_valid = true`,
            [customer_id]
        )
        return result.rows
    } catch (error) {
        console.error('Failed to get customer subsites')
        throw error
    }
}
//GET SINGLE SUBSITE
async function getIndySubsite(subsite_id) {
    try {
        const result = await pool.query(
            `SELECT s.*, c.name AS customer
            FROM subsites s
            LEFT JOIN customers c ON s.customer_id = c.id
            WHERE s.id = $1`,
            [subsite_id]
        )
        // console.log('service result', result)
        return result.rows[0]
    } catch (error) {
        console.error('Failed to get subsite')
        throw error
    }
}



//CREATE SUBSITE
async function insertSubsite(subsite_info) {
    try {
        const { customer_id, address, city, state, zip, notes, contact, phone, lat, long, name  } = subsite_info
        const result = await pool.query(
            `INSERT INTO subsites (customer_id, address, city, state, zip, notes, contact, phone, lat, long, name)
            VALUES ($1, $2,$3,$4,$5,$6,$7,$8,$9,$10,$11)
            RETURNING *`,
            [customer_id, address, city, state, zip, notes, contact, phone, lat || null, long || null, name]
        )
        return result.rows[0]
    } catch (error) {
        console.error("failed to create subsite")
        throw error
    }
}

//UPDATE SUBSITE
async function updateSubsite(subsite_id, update_info) {
    try {
        const { customer_id, address, city, state, zip, notes, contact, phone, lat, long, name  } = update_info
        const result = await pool.query(
            `UPDATE subsites
            SET customer_id = COALESCE($1, customer_id),
                address = COALESCE($2, address),
                city = COALESCE($3, city),
                state = COALESCE($4, state),
                zip = COALESCE($5, zip),
                notes = COALESCE($6, notes),
                contact = COALESCE($7, contact),
                phone = COALESCE($8, phone),
                lat = COALESCE($9, lat),
                long = COALESCE($10, long),
                name = COALESCE($11, name)
            WHERE id = $12
            RETURNING *`,
            [customer_id, address, city, state, zip, notes, contact, phone, lat, long, name, subsite_id]
        ) 
        return result.rows[0]
    } catch (error) {
        console.error('Failed to update subsite')
        throw error
    }
}
//SOFT DELETE SUBSITE - need subsite id - is_valid = false
async function deactivateSubsite(subsite_id) {
    try {
        const result = await pool.query(
        `UPDATE subsites
        SET is_valid = false
        WHERE id = $1
        RETURNING *`,
        [subsite_id]
    )
    return result.rows[0]
    } catch (error) {
        console.error('Failed to delete subsite')
        throw error
    }
}

module.exports = { getSubsites, getIndySubsite,insertSubsite, updateSubsite, deactivateSubsite}