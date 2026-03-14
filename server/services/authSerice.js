const bcrypt = require('bcrypt')

const saltRounds = 10

const hashPassword = async (password) => {
    return await bcrypt.hash(password, saltRounds)
}

const comparePasswords = async (userPass, hashedPass) => {
    return await bcrypt.compare(userPass, hashedPass)
}

module.exports = { hashPassword, comparePasswords }