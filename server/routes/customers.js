const express = require('express')
const router = express.Router()
const pool = require('../db');
const { insertCustomer } = require('../services/customerService');

router.get('/customers', async (req, res) =>{
    try {
        const result = await pool.query('SELECT * FROM customers')
        res.json(result.rows)
    } catch (error) {
        console.error(error)
        res.status(500).json({error: 'Failed to fetch customers'})
    }})

router.post('/customers', async (req, res) =>{
    try{
    console.log('Received customer data:', req.body)
    const newCustomer = await insertCustomer(req.body)
    res.status(201).json(newCustomer)
}catch(error){
    console.error('Error creating customer:', error)
    res.status(500).json({error: 'Failed to create customer'})
}
})

module.exports = router;