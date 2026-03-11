const pool = require('../db')

//GET ALL CUSTOMERS
async function getCustomers(){
    try {
        const result = await pool.query('SELECT * FROM customers ORDER BY name ASC')
        // console.log(result)
        return result.rows
    } catch (error) {
        console.error('Error fetching customers', error)
        throw error
    }
}

//Get single customer
async function getIndyCustomer(customer_id) {
    try {
        const result = await pool.query(
            `SELECT * FROM customers WHERE id = $1`,
            [customer_id]
        )
        return result.rows[0]
    } catch (error) {
        console.error('Error fetching customer', error)
        throw error
    }
}
//CREATE CUSTOMER
async function insertCustomer(customerData){
    try {
        const {name, dept, addNum, street, city, state, zip, contact, phone, contract, notes, lat, long } = customerData
        console.log("Inserting customer", customerData)
        const result = await pool.query(
            `INSERT INTO customers (name, dept, add_num, street, city, state, zip, contact, phone, contract, notes, lat, long)
            VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10, $11,$12,$13)
            RETURNING *`,
            [name, dept, addNum, street, city, state, zip, contact, phone, contract, notes, lat, long]
        )
        return result.rows[0]
    } catch (error) {
    console.error('Error Inserting Customer', error)
    throw error
    }
}

//UPDATE CUSTOMER
async function updateCustomer(customer_id, customer_data){
    try {
        const {name, dept, addNum, street, city, state, zip, contact, phone, contract, notes, lat, long} = customer_data
        const result = await pool.query(
            `UPDATE customers
            SET name=$1, dept=$2, add_num=$3, street=$4, city=$5, state=$6, zip=$7, contact=$8, phone=$9, contract=$10, notes=$11, lat=$12, long=$13, updated_at = CURRENT_TIMESTAMP
            WHERE id=$14
            RETURNING *`,
            [name, dept, addNum, street, city, state, zip, contact, phone, contract, notes, lat, long, customer_id]
        )
        return result.rows[0]
    } catch (error) {
        console.error('Error updating customer', error)
        throw error
    }  
}


module.exports = {getCustomers, getIndyCustomer, insertCustomer, updateCustomer}