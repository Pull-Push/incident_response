const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')

const saltRounds = 10

const hashPassword = async (password) => {
    return await bcrypt.hash(password, saltRounds)
}

const comparePasswords = async (userPass, hashedPass) => {
    return await bcrypt.compare(userPass, hashedPass)
}

const generateToken = (user) => {
    const payload = {
    id: user.id,
    is_manager: user.is_manager,
    is_sales: user.is_sales,
    is_service: user.is_service
}
    const token = jwt.sign(payload, process.env.JWT_SECRET,{ expiresIn: '8h' })
    return token
}

const verifyToken = (token) =>{
    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET)
        return decoded
    } catch (error) {
        console.error('Invalid token', error)
    }
}

module.exports = { hashPassword, comparePasswords, generateToken, verifyToken }