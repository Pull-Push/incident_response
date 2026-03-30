const pool = require('../db')
const { hashPassword } = require('./authService')

//GET ALL USERS
async function getUsers(){
    try{
        const result = await pool.query('SELECT * FROM users WHERE is_valid = true ORDER BY last_name ASC')
        return result.rows 
    }catch(error){
        console.error('Failed to fetch users', error)
        throw new Error(error)
    }
}
//Get single user
async function getIndyUser(id) {
    try {
        const result = await pool.query(`SELECT * FROM users WHERE id = $1`, [id])
        return result.rows[0]
    } catch (error) {
        console.error('Failed to fetch user', error)
        throw new Error(error)
    }
}

//insert user
async function insertUser(userData) {
    try {
        const {first_name, last_name, position, is_manager, is_sales, is_service, employee_number, email, password } = userData
        const hashedPass = await hashPassword(password)
        const result = await pool.query(`INSERT INTO users (first_name, last_name, position, is_manager, is_sales, is_service, employee_number, email, hashed_pw)
                        VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)
                        RETURNING *`,
                        [first_name, last_name, position, is_manager, is_sales, is_service, employee_number, email, hashedPass]
                    )
        return result.rows[0]
    } catch (error) {
        console.error('Failed to create user', error)
        throw new Error(error)
    }
}

async function updateUser(user_id, updateData) {
    try {
        const {first_name, last_name, position, is_manager, is_sales, is_service, employee_number, email, password } = updateData
        const hashedPass = password ? await hashPassword(password) : null;
        const result = await pool.query(
            `UPDATE users
            SET first_name = COALESCE($1, first_name),
                last_name = COALESCE($2, last_name),
                position = COALESCE($3, position),
                is_manager = COALESCE($4, is_manager),
                is_sales = COALESCE($5, is_sales),
                is_service = COALESCE($6, is_service),
                employee_number = COALESCE($7, employee_number),
                email = COALESCE($8, email),
                hashed_pw = COALESCE($9, hashed_pw)
            WHERE id = $10
            RETURNING *`,
            [first_name, last_name, position, is_manager, is_sales, is_service, employee_number, email, hashedPass, user_id]
        )
        return result.rows[0]
    } catch (error) {
        console.error('Error updating user', error)
        throw error
    }
}

async function deactivateUser(user_id) {
    try {
        const result = await pool.query(
            `UPDATE users 
            SET is_valid = false
            WHERE id = $1
            RETURNING *`,
            [user_id]
        )
        return result.rows[0]
    } catch (error) {
        console.error('Error deactivating user', error)
        throw error
    }
}

async function getUserByEmail(email) {
    try{
        const result = await pool.query(
            `SELECT * FROM users 
            WHERE email = $1`,
            [email]
        )
        return result.rows[0]
    }catch(error){
        console.error('Error fetching user', error)
        throw error
    }
}

module.exports = {getUsers, getIndyUser, insertUser, updateUser, deactivateUser, getUserByEmail}