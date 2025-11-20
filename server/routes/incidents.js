const express = require('express')
const router = express.Router()
const { getLocalWeather } = require('../services/weatherService')


//get weather
router.get('/dashboard', async (req, res ) =>{
    try{
        const result = await getLocalWeather()
        res.json(result)
    }catch(err){
        console.error(err)
        res.status(500).json({error: "failed to fetch weather"})
    }
})

module.exports = router;