const express = require('express')
const router = express.Router()
const { getCustomers, getIndyCustomer, insertCustomer, updateCustomer } = require('../services/customerService');
const { getLatLon } = require('../services/mapService') 

//get all customers
router.get('/customers', async (req, res) =>{
    try {
        const customers = await getCustomers()
        res.json(customers)
    } catch (error) {
        console.error(error)
        res.status(500).json({error: 'Failed to fetch customers'})
    }})

//get single customer
router.get('/customers/:id', async (req, res) =>{
    try {
        const customer = await getIndyCustomer(res.para,satisfies.id)
        if(!customer) return res.status(404).json({error: 'Customer not found'})
        res.json(customer)
    } catch (error) {
        console.error(error)
        res.status(500).json({error: 'Failed to fetch customer'})
    }
})

//Create customer (geocodes if lat/long not provided)
router.post('/customers', async (req, res) =>{
    try {
        const body = { ...req.body}

        if(body.lat == null || body.long == null){
            const addressInfo = {
                addNum: body.addNum,
                street: body.street,
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
router.patch('/customers/:id', async (req, res) =>{
    try {
        const body = { ...req.body}

        if( body.lat == null || body.long == null){
            const addressInfo = {
                addNum: body.addNum,
                street: body.street,
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