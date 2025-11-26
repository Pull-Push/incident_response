const express = require('express')
const router = express.Router()
const pool = require('../db');

router.get('/customers', async (req, res) =>{
    try {
        const result = await pool.query('SELECT * FROM customers')
        res.json(result.rows)
    } catch (error) {
        console.error(error)
        res.status(500).json({error: 'Failed to fetch customers'})
    }})

module.exports = router;