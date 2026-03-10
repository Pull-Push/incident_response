const express = require('express')
const router = express.Router()

const { getLocalWeather } = require('../services/weatherService')
const { getIncidents, getIndyIncident, insertIncident, updateIncident } = require('../services/incidentService')


//get dashboard (weather) - move this at a later date to separate filef
router.get('/dashboard', async (req, res ) =>{
    // console.log('req', req.body)
    try{
        const weatherResult = await getLocalWeather(req.body)
        res.json(weatherResult)
    }catch(err){
        console.error(err)
        res.status(500).json({error: "failed to fetch weather"})
    }
})
//get all incidents
router.get('/incidents', async (req, res) =>{
    // console.log('in the routes file')
    try{
        const incidentResult = await getIncidents()
        res.json(incidentResult)
    }catch(error){
        console.error(error)
        res.status(500).json({error: 'Failed to fetch Incidnets'})
    }
})

//get single incident
router.get('/incidents/:id', async (req, res) =>{
    try {
        const incident = await getIndyIncident(req.params.id)
        if(!incident) return res.status(404).json({error: 'Incident not found' })
        res.json(incident)
    } catch (error) {
        console.error(error)
        res.status(500).json({error: 'Failed to fetch incident'})
    }
})

//create incident
router.post('/incidents', async (req, res) =>{
    try {
        const newIncident = await insertIncident(req.body)
        res.status(201).json(newIncident)
    } catch (error) {
        console.error(error)
        res.status(500).json({ error: 'Failed to create incident'})
    }
})

//update incident
router.patch('/incidents/:id', async (req, res) =>{
    try {
        const updated = await updateIncident(req.params.id, req.body)
        if(!updated) return res.status(404).json({error: 'Incident Not Found'})
        res.json(updated)
    } catch (error) {
        console.error(error)
        res.status(500).json({error: 'Failed to update incident '})
    }
})


module.exports = router;