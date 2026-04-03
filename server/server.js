const express = require('express')
const cors = require('cors')
const pool = require('./db.js');

// IMPORT ROUTES
const incidentRoutes = require('./routes/incidents')
const customerRoutes = require('./routes/customers')
const userRoutes = require('./routes/users')
const authRoutes = require('./routes/auth')

const app = express()
const PORT = process.env.PORT || 5050

const allowedOrigins = [
    'http://localhost:5173',
    // ipconfig getifaddr en0 - to get local network address - MAKE SURE IT MATCHES client/.env ADDRESS
    `http://192.168.0.40:5173`, 
    process.env.FRONTEND_URL
].filter(Boolean)

app.use(cors({
    origin: function(origin, callback){
        // Allow requests with no origin (mobile apps, curl, etc...)
        if(!origin) return callback(null, true)

        if(allowedOrigins.indexOf(origin) !== -1){
            callback(null, true)
        }else(
            callback(new Error('Not Allowed By CORS'))
        )
    },
    credentials: true
}))

app.use(express.json())

app.use('/api', incidentRoutes)
app.use('/api', customerRoutes)
app.use('/api', userRoutes)
app.use('/api', authRoutes)


//test route - Health Check
app.get('/api', (req, res) =>{
    res.json({message: 'ICR API RUNNING'})
})

// DATABASE TEST CONNECTION
pool.query('SELECT NOW()', (err, res) => {
    if (err) {
        console.error('❌ Database connection failed:', err);
    } else {
        console.log('✅ Database connected successfully at:', res.rows[0].now);
    }
});

//START SERVER 
app.listen(PORT, '0.0.0.0',() =>{
    console.log(`SERVER IS RUNNING ON ${PORT}`)
})