const { Resend } = require('resend')
const { getServiceManagers } = require('./userService')
require('dotenv').config()


const resend = new Resend(process.env.RESEND_API_KEY);
const from = process.env.EMAIL_FROM;



async function notifyIncidentAssigned(incident, tech){
    try {
        const managers = await getServiceManagers()
        const recipients = [tech.email, ...managers.map(m => m.email)]
        const {data, error } = await resend.emails.send({
        from,
        to: recipients,
        subject: `New Incident Assigned ${incident.id}`,
        html: `<h1>New Incident For Customer: ${incident.customer}</h1><p>${incident.incident_type} - ${incident.location}</p>`,
    });
    if(error){
        console.log('Failed to send notify email', error)
    }
    } catch (error) {
        console.error('Failed to notify assignment', error)
        throw error
    }
}

async function notifyStatusChange(incident) {
    try {
        const managers = await getServiceManagers()
        const recipients = [...managers.map(m => m.email)]
        const {data, error } = await resend.emails.send({
            from, 
            to: recipients,
            subject: `Incident ${incident.id} has been updated`,
            html: `<h1>Customer: ${incident.customer}</h1><p>, has a new status update. ${incident.incident_type} - ${incident.status}</p>`,
        });
        if(error){
            console.log('Failed to send update email', error)
        }
    } catch (error) {
        console.error('Failed to notify status change', error)
        throw error
    }
}

module.exports = { notifyIncidentAssigned, notifyStatusChange }
