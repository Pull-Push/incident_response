const express = require('express')
const router = express.Router()
const pool = require('../db');
const { insertCustomer } = require('../services/customerService');
const { getLatLon } = require('../services/mapService') 

router.get('/customers', async (req, res) =>{
    try {
        const result = await pool.query('SELECT * FROM customers')
        res.json(result.rows)
    } catch (error) {
        console.error(error)
        res.status(500).json({error: 'Failed to fetch customers'})
    }})

router.post('/customers', async (req, res) =>{
    const addInfo = {
        addNum:req.body.addNum,
        street:req.body.street,
        city:req.body.city,
        state:req.body.state,
        zip:req.body.zip
    }
    if(req.body.lat == null || req.body.long == null){
        try{
        console.log('Received partial customer data', req.body)
        console.log('address Info for Zip', addInfo)
        const latLongInfo = await(getLatLon(addInfo))
        console.log('latLongInfo', latLongInfo)
        req.body.lat = latLongInfo[0]
        req.body.long = latLongInfo[1]
        console.log('updated body', req.body)
        const newCustomer = await insertCustomer(req.body)
        res.status(201).json(newCustomer)
        }catch(error){

        }
    }else{
        try{
        console.log('Received full customer data:', req.body)
        const newCustomer = await insertCustomer(req.body)
        res.status(201).json(newCustomer)
}catch(error){
    console.error('Error creating customer:', error)
    res.status(500).json({error: 'Failed to create customer'})
}
    }
    
})

module.exports = router;