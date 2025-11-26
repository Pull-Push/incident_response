const { Pool } = require('pg')
require('dotenv').config()

//Create a connection pool
const pool = new Pool({
    connectionString: process.env.DATABASE_URL
})

//TEST CONNECTION
pool.on('connect', () =>{
    console.log('Connected to PostgreSQL database')
})

module.exports = pool