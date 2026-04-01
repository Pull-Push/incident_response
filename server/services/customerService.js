const pool = require('../db')

//GET ALL CUSTOMERS
async function getCustomers(){
    try {
        const result = await pool.query('SELECT * FROM customers WHERE is_valid= true ORDER BY name ASC')
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
            `SELECT *, users.first_name || ' ' || users.last_name AS created_by_name 
            FROM customers 
            LEFT JOIN users ON customers.created_by = users.id
            WHERE customers.id = $1`,
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
        const {name, dept, address, city, state, zip, contact, phone, contract, notes, lat, long, created_by } = customerData
        console.log("Inserting customer", customerData)
        const result = await pool.query(
            `INSERT INTO customers (name, dept, address, city, state, zip, contact, phone, contract, notes, lat, long, created_by)
            VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10, $11, $12, $13)
            RETURNING *`,
            [name, dept, address, city, state, zip, contact, phone, contract, notes, lat, long, created_by]
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
        const {name, dept, address, city, state, zip, contact, phone, contract, notes, lat, long} = customer_data
        const result = await pool.query(
            `UPDATE customers
            SET name=$1, dept=$2, address=$3, city=$4, state=$5, zip=$6, contact=$7, phone=$8, contract=$9, notes=$10, lat=$11, long=$12
            WHERE id=$13
            RETURNING *`,
            [name, dept, address, city, state, zip, contact, phone, contract, notes, lat, long, customer_id]
        )
        return result.rows[0]
    } catch (error) {
        console.error('Error updating customer', error)
        throw error
    }  
}

//DEACTIVATE USER
async function deactivateCustomer(customer_id) {
    try {
        const result = await pool.query(
            `UPDATE customers
            SET is_valid = false
            WHERE id=$1
            RETURNING *`,
            [customer_id]
        )
        return result.rows[0]
    } catch (error) {
        console.error('Error deactivating customer', error)
        throw error
    }
    
}


module.exports = {getCustomers, getIndyCustomer, insertCustomer, updateCustomer, deactivateCustomer}