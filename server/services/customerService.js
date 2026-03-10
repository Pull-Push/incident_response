const pool = require('../db')

//GET ALL CUSTOMERS
async function getCustomers(){
    try {
        const customerInfo = await pool.query('SELECT * FROM customers')
        console.log(customerInfo)
        res.json(customerInfo.rows)
    } catch (error) {
        console.error(error)
        res.status(500).json({error: 'Failed to fetch customer'})
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
//GET SINGLE CUSTOMER
async function getIndyCustomer(customer_number){
    try {
        const customerNumber = customer_number
        console.log('Fetching customer number', customerNumber)
        const result = await pool.query(
            `SELECT * FROM CUSTOMERS WHERE id = $1`, [customerNumber]
        )
        return result.rows[0]
    } catch (error) {
        console.error('Error fetching customer', error)
        res.status(500).json({error: 'Failed to fetch customer'})
    }
}
// //UPDATE CUSTOMER
// async function update(customer_data){
//     try {
//         const {id, name, dept, addNum, street, city, state, zip, notes, contact, phone, contract, lat, long} = customer_data
//     } catch (error) {
        
//     }  
// }


module.exports = {getCustomers, insertCustomer}