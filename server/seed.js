const pool = require('./db')
const {hashPassword} = require('./services/authService')

async function initializerUser() {
    const adminData = {
        first_name:'admin',
        last_name:'admin',
        position:'admin',
        is_manager:true,
        is_sales:true,
        is_service:true,
        employee_number:0,
        email:'ProfessorX@gmail.com',
        password:'password123'
        
    }
    try {
        const {first_name, last_name, position, is_manager, is_sales, is_service, employee_number, email, password } = adminData
        const hashedPass = await hashPassword(password)
        const result = await pool.query(`INSERT INTO users (first_name, last_name, position, is_manager, is_sales, is_service, employee_number, email, hashed_pw)
                        VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)
                        RETURNING *`, 
                        [first_name, last_name, position, is_manager, is_sales, is_service, employee_number, email, hashedPass])
        return result.rows[0]
    } catch (error) {
        console.error('Failed to create user', error)
        throw new Error(error)
    }
}

initializerUser()
    .then((user) => {
        console.log('Admin user created:', user)
        pool.end()
    })
    .catch((err) => {
        console.error(err)
        pool.end()
    })