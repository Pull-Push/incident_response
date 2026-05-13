const express = require('express')
const router = express.Router()
const {authVerify, managerVerify} = require('../middleware/auth')

const { getLocalWeather } = require('../services/weatherService')
const { getIncidents, getIndyIncident, insertIncident, updateIncident, getActiveIncidents } = require('../services/incidentService')
const { notifyIncidentAssigned, notifyStatusChange } = require('../services/emailService')
const { getIndyUser } = require('../services/userService')

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
            if('tech_assigned' in req.body){
                const tech = await getIndyUser(req.body.tech_assigned)
                await notifyIncidentAssigned(newIncident, tech)
            }
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
            if(req.body.notification_type === 'assignment'){
                const tech = await getIndyUser(req.body.tech_assigned)
                await notifyIncidentAssigned(updated, tech)
                res.json(updated)
            }else if(req.body.notification_type === 'status'){
                await notifyStatusChange(updated)
                res.json(updated)
            }else{
                res.json(updated)
            }
        } catch (error) {
            console.error(error)
            res.status(500).json({ error: 'Failed to update incident' })
        }
})

module.exports = router