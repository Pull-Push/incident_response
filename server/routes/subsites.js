const express = require('express')
const router = express.Router()
const {getSubsites,getIndySubsite,  insertSubsite, updateSubsite, deactivateSubsite} = require('../services/subsiteService')
const {authVerify } = require('../middleware/auth')


router.get('/subsites/:customer_id', authVerify, async(req, res) =>{
    try {
        const sites = await getSubsites(req.params.customer_id)
        res.json(sites)
    } catch (error) {
        console.error(error)
        res.status(500).json({error: 'Failed to fetch subsites'})
    }
})

router.get('/subsite/:id', authVerify, async(req, res) => {
    console.log('params id is....', req.params.id)
    try{
        const site = await getIndySubsite(req.params.id)
        res.json(site)
    }catch(error) {
        console.error(error)
        res.status(500).json({error: 'Failed to fetch subsite'})
    }
})

router.post('/subsites', authVerify, async(req, res) =>{
    try {
        const site = await insertSubsite(req.body)
        res.status(201).json(site)
    } catch (error) {
        console.error(error)
        res.status(500).json({error:'Failed to create subsite'})
    }
})

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