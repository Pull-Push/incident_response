const express = require('express')
const router = express.Router()
const { getCustomers, getIndyCustomer, insertCustomer, updateCustomer } = require('../services/customerService');
const { getLatLon } = require('../services/mapService') 
const {authVerify} = require('../middleware/auth')
const { getLocalWeather } = require('../services/weatherService')

//get all customers
router.get('/customers', authVerify, async (req, res) =>{
    try {
        const customers = await getCustomers()
        res.json(customers)
    } catch (error) {
        console.error(error)
        res.status(500).json({error: 'Failed to fetch customers'})
    }})

//get single customer
router.get('/customers/:id', authVerify, async (req, res) =>{
    try {
        const customer = await getIndyCustomer(req.params.id)
        if(!customer) return res.status(404).json({error: 'Customer not found'})
        
        const weather  = await getLocalWeather(customer)
        if(!weather) return res.status(404).json({error: 'Weather not found'})
    
        res.json({customer, weather})
    } catch (error) {
        console.error(error)
        res.status(500).json({error: 'Failed to fetch customer'})
    }
})

//Create customer (geocodes if lat/long not provided)
router.post('/customers', authVerify, async (req, res) =>{
    if(!req.user.is_manager && !req.user.is_sales ) return res.status(403).json({error:'Invalid Permissions'})
    try {
        const body = { ...req.body} //create a shallow copy of req.body - DO NOT MUTATE BODY DIRECTLY!!

        if(body.lat == null || body.long == null){ // == catches both undefined and null
            const addressInfo = {
                address: body.address,
                city: body.city,
                state: body.state,
                zip: body.zip
            }
            const [lat, long] = await getLatLon(addressInfo)
            body.lat = lat
            body.long = long
        }
        const newCustomer = await insertCustomer(body)
        res.status(201).json(newCustomer)
    } catch (error) {
        console.error('Error creating customer:' , error)
        res.status(500).json({error:'Failed to create customer'})
    }
})

//Update customer
router.patch('/customers/:id', authVerify, async (req, res) =>{
    if(!req.user.is_manager && !req.user.is_sales ) return res.status(403).json({error:'Invalid Permissions'})
    try {
        const body = { ...req.body}

        if( body.lat == null || body.long == null){
            const addressInfo = {
                address: body.address,
                city: body.city,
                state: body.state,
                zip: body. zip
            }
            const [lat, long] = await getLatLon(addressInfo)
            body.lat = lat
            body.long = long
        }

        const updated = await updateCustomer(req.params.id, body)
        if(!updated) return res.status(404).json({error: 'Customer Not Found'})
            res.json(updated)
    } catch (error) {
        console.error('Error updating customer', error)
        res.status(500).json({error: 'Failed to update customer'})
    }
})

module.exports = router;