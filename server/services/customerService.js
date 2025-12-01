const pool = require('../db')


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


module.exports = {getCustomers, insertCustomer}