const {verifyToken} = require('../services/authService')

const authVerify = (req, res, next) =>{
    if (!req.headers.authorization) {
    return res.status(401).json({ error: 'No token provided' })
}
    try {
        const token  = req.headers.authorization.slice(7)
        const userData = verifyToken(token)
        req.user = userData
        next()
    } catch (error) {
    res.status(401).json({error: error.message})
    }
}

const managerVerify = (req, res, next) =>{
    try {
        if(req.user.is_manager === true){
            next()
        }else{
            res.status(403).json({ error: 'Access denied' })
        }
    } catch (error) {
        res.status(401).json({error: error.message})
    }
}

module.exports = {authVerify, managerVerify}