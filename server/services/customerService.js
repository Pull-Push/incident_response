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


module.exports = {getCustomers}