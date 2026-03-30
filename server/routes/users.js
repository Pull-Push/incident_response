const express = require('express')
const router = express.Router()
const { getUsers, getIndyUser, insertUser, updateUser, deactivateUser } = require('../services/userService')
const {authVerify, managerVerify } = require('../middleware/auth')

router.get('/users', authVerify, async(req, res) =>{
    try {
        const users = await getUsers()
        res.json(users)
    } catch (error) {
        console.error(error)
        res.status(500).json({error: 'Failed to fetch all users'})
    }
})

router.get('/users/:id', authVerify, async(req, res) =>{
    try {
        const user = await getIndyUser(req.params.id)
        if(!user) return res.status(404).json({error: 'User not found'})
        res.json(user)
    } catch (error) {
        console.error(error)
        res.status(500).json({error: 'Failed to fetch user'})
    }
})

router.post('/users', authVerify, managerVerify, async(req, res) =>{
    try {
        const user = await insertUser(req.body)
        res.status(201).json(user)
    } catch (error) {
        console.error(error)
        res.status(500).json({error:'Failed to create user'})
    }
})

router.patch('/users/:id', authVerify, managerVerify, async(req, res) =>{
    try {
        const user = await updateUser(req.params.id, req.body)
        if(!user) return res.status(404).json({error: 'User not found'})
        res.json(user)
    } catch (error) {
        console.error(error)
        res.status(500).json({error:'Failed to update user'})
    }
})

router.patch('/users/:id/deactivate', authVerify, managerVerify, async(req, res) =>{
    try {
        const user = await deactivateUser(req.params.id)
        if(!user) return res.status(404).json({error: 'User not found'})
        res.json(user)
    } catch (error) {
        console.error(error)
        res.status(500).json({error: 'Failed to deactivate user'})
    }
})

module.exports = router