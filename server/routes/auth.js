const express = require('express')
const router = express.Router()
const {getUserByEmail} = require('../services/userService')
const {comparePasswords, generateToken} = require('../services/authService')
//login route
router.post('/login', async(req, res) =>{
    try {
        const user = await getUserByEmail(req.body.email)
        if(!user) return res.status(401).json({ error: 'Invalid email or password' })
        const verified = await comparePasswords(req.body.password, user.hashed_pw)
        if (!verified) return res.status(401).json({ error: 'Invalid email or password' })
        const token = generateToken(user)
        return res.json({token})
    } catch (error) {
        console.error(error)
        res.status(500).json({error: 'Failed to Login'})
    }
})

module.exports = router