const express = require('express')
const router = express.Router()
const {getSubsites,getIndySubsite,  insertSubsite, updateSubsite, deactivateSubsite} = require('../services/subsiteService')
const {authVerify } = require('../middleware/auth')
const { getLatLon } = require('../services/mapService') 
const {getLocalWeather} = require('../services/weatherService')
//GET ALL SUBSITES
router.get('/subsites/:customer_id', authVerify, async(req, res) =>{
    try {
        const sites = await getSubsites(req.params.customer_id)
        res.json(sites)
    } catch (error) {
        console.error(error)
        res.status(500).json({error: 'Failed to fetch subsites'})
    }
})


//GET SINGLE SUBSITE
router.get('/subsite/:id', authVerify, async(req, res) => {
    // console.log('params id is....', req.params.id)
    try{
        const site = await getIndySubsite(req.params.id)
        if(!site) return res.status(404).json({error: 'Subsite not found'})

        const weather  = await getLocalWeather(site)
        
        if(!weather) return res.status(404).json({error: 'Weather not found'})
        
            res.json({site, weather})
    }catch(error) {
        console.error(error)
        res.status(500).json({error: 'Failed to fetch subsite'})
    }
})

//CREATE SUBSITE
router.post('/subsites', authVerify, async(req, res) =>{
    try {
        const body = { ...req.body} //create a shallow copy of req.body - DO NOT MUTATE BODY DIRECTLY!!
            if(body.lat == null || body.long == null ){ // == catches both undefined and null
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
        const site = await insertSubsite(body)
        res.status(201).json(site)
    } catch (error) {
        console.error(error)
        res.status(500).json({error:'Failed to create subsite'})
    }
})

//EDIT SUBSITE
router.patch('/subsites/:id', authVerify, async(req, res) =>{
    try {
        const site = await updateSubsite(req.params.id, req.body)
        if(!site) return res.status(404).json({error: 'Subsite not found'})
        res.json(site)
    } catch (error) {
        console.error(error)
        res.status(500).json({error:'Failed to update subsite'})
    }
})

//DEACTIVATE SUBSITE
router.patch('/subsites/:id/deactivate', authVerify, async(req, res) =>{
    try {
        const site = await deactivateSubsite(req.params.id)
        if(!site) return res.status(404).json({error: 'Subsite not found'})
        res.json(site)
    } catch (error) {
        console.error(error)
        res.status(500).json({error:'Failed to deactivate subsite'})
    }
})

module.exports = router