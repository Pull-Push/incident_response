const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5050'
// const API_BASE_URL = 'http://192.168.50.117:5050' set to machine ip for mobile testing!!


//GET DASHBOARD INFO WEATHER - MAP - INCIDENTS
export const getDash = async () =>{
    const response = await fetch(`${API_BASE_URL}/api/dashboard`)
    if(!response.ok) throw new Error('Failed to fetch dashboard data')
        return response.json()
}
 // Customers
export const getCustomers = async () =>{
    const response = await fetch(`${API_BASE_URL}/api/customers`)
    if(!response.ok) throw new Error("Failed to fetch customers")
        return response.json()
}

export const getCustomer = async (id) =>{
    const response = await fetch(`${API_BASE_URL}/api/customer/${id}`)
    if(!response.ok) throw new Error('Failed to fetch customer')
        return response.json()
}

export const createCustomer = async (customer) =>{
    // console.log('in the front end api', customer)
    const response = await fetch(`${API_BASE_URL}/api/customers`, {
        method: 'POST',
        headers: { 'Content-Type' : 'application/json' },
        body:JSON.stringify(customer)
    })
    if(!response.ok) throw new Error("Failed to create customer")
    return response.json()
}

export const updateCustomer = async (id, customer) =>{
    const response = await fetch(`${API_BASE_URL}/api/${id}`, {
        method:'PATCH',
        headers: {'Content-Type' : 'application/json' },
        body:JSON.stringify(customer)
    })
    if(!response.ok) throw new Error('Failed to update customer')
        return response.json()
}

//Incidents

export const getIncidents = async () =>{
    const response = await fetch(`${API_BASE_URL}/api/incidents`)
    if(!response.ok) throw new Error("Failed to fetch incidents")
        return response.json()
}

export const getIncident = async (id) => {
    const response = await fetch(`${API_BASE_URL}/api/incident/${id}`)
    if(!response.ok) throw new Error('Failed to fetch incident')
        return response.json()
}

export const createIncicdent = async (incident) => {
    const response = await fetch(`${API_BASE_URL}/api/incidents`, {
        method:'POST',
        headers: { 'Content-Type' :'application/json'},
        body: JSON.stringify(incident)
    })
    if(!response.ok) throw new Error('Failed to create incident')
        return response.json()
}

export const updateIncident = async (id, updates) => {
    const response = await fetch(`${API_BASE_URL}/api/incident/${id}`, {
        method:'POST',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify(updates)
    })
    if(!response.ok) throw new Error('Failed to update incident')
        return response.json()
}
