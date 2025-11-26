const express = require('express')
const cors = require('cors')
const path = require('path')
const pool = require('./db.js');

// IMPORT ROUTES
const incidentRoutes = require('./routes/incidents')
const customerRoutes = require('./routes/customers')

const app = express()
const PORT = process.env.PORT || 5050

const allowedOrigins = [
    'http://localhost:5173',
    process.env.FRONTEND_URL
]

app.use(cors({
    origin: function(origin, callback){
        if(!origin) return callback(null, true)

        if(allowedOrigins.indexOf(origin) !== 1 || !origin){
            callback(null, true)
        }else(
            callback(new Error('Not Allowed By CORS'))
        )
    },
    credentials: true
    // origin: '*' - FOR MOBILE TESTING
}))

app.use(express.json())

app.use('/api', incidentRoutes)
app.use('/api', customerRoutes)


//test route
app.get('/api', (req, res) =>{
    res.json({message: 'ICR API RUNNING'})
})

// DATABASE TEST CONNECTION
// pool.query('SELECT NOW()', (err, res) => {
//     if (err) {
//         console.error('❌ Database connection failed:', err);
//     } else {
//         console.log('✅ Database connected successfully at:', res.rows[0].now);
//     }
// });

//START SERVER 
app.listen(PORT, () =>{
    console.log(`SERVER IS RUNNING ON ${PORT}`)
})