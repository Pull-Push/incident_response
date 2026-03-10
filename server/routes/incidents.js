const express = require('express')
const router = express.Router()

const { getLocalWeather } = require('../services/weatherService')
const { getIncidents } = require('../services/incidentService')


//get weather
router.get('/dashboard', async (req, res ) =>{
    console.log('req', req.body)
    try{
        const weatherResult = await getLocalWeather(req.body)
        res.json(weatherResult)
    }catch(err){
        console.error(err)
        res.status(500).json({error: "failed to fetch weather"})
    }
})

router.get('/incidents', async (req, res) =>{
    console.log('in the routes file')
    try{
        const incidentResult = await getIncidents()
        res.json(incidentResult)
    }catch(error){
        console.error(error)
        res.status(500).json({error: 'Failed to fetch Incidnets'})
    }
})



module.exports = router;