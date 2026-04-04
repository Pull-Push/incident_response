const express = require('express')
const router = express.Router()
const {authVerify, managerVerify} = require('../middleware/auth')

const { getLocalWeather } = require('../services/weatherService')
const { getIncidents, getIndyIncident, insertIncident, updateIncident, getActiveIncidents } = require('../services/incidentService')

// GET DASHBOARD (weather)
router.get('/dashboard', authVerify, async (req, res) => {
    try {
        const [weatherResult, activeIncidents ]= await Promise.all([getLocalWeather(req.body), getActiveIncidents()])
        res.json({weatherResult, activeIncidents})
    } catch (err) {
        console.error(err)
        res.status(500).json({ error: 'Failed to fetch weather' })
    }
})

// GET ALL INCIDENTS
router.get('/incidents',authVerify, async (req, res) => {
    try {
        const incidentResult = await getIncidents()
        res.json(incidentResult)
    } catch (error) {
        console.error(error)
        res.status(500).json({ error: 'Failed to fetch incidents' })
    }
})

// GET SINGLE INCIDENT
router.get('/incidents/:id', authVerify, async (req, res) => {
    try {
        const incident = await getIndyIncident(req.params.id)
        if (!incident) return res.status(404).json({ error: 'Incident not found' })
        res.json(incident)
    } catch (error) {
        console.error(error)
        res.status(500).json({ error: 'Failed to fetch incident' })
    }
})

// CREATE INCIDENT
router.post('/incidents', authVerify, managerVerify,  async (req, res) => {
    try {
        const newIncident = await insertIncident(req.body)
        res.status(201).json(newIncident)
    } catch (error) {
        console.error(error)
        res.status(500).json({ error: 'Failed to create incident' })
    }
})

// UPDATE INCIDENT
router.patch('/incidents/:id', authVerify , async (req, res) => {
    if(!req.user.is_manager && !req.user.is_service) return res.status(403).json({error:'Invalid Permissions'})
    try {
        const updated = await updateIncident(req.params.id, req.body)
        if (!updated) return res.status(404).json({ error: 'Incident not found' })
        res.json(updated)
    } catch (error) {
        console.error(error)
        res.status(500).json({ error: 'Failed to update incident' })
    }
})

module.exports = router