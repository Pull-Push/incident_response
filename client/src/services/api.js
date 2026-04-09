const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5050'
// console.log('the base url is...', API_BASE_URL)

const getAuthHeader = () => ({
    'Authorization': `Bearer ${localStorage.getItem('token')}`,
    'Content-Type': 'application/json'
})

// ─── DASHBOARD ───────────────────────────────────────────────
export const getDash = async () => {
    const response = await fetch(`${API_BASE_URL}/api/dashboard`,{
        headers:getAuthHeader()
    })
    if (!response.ok) throw new Error('Failed to fetch dashboard data')
    return response.json()
}

//----LOG IN-------------------
export const logIn = async (userInfo) =>{
    const response = await fetch(`${API_BASE_URL}/api/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(userInfo)
    })
    if(!response.ok) throw new Error('Failed to log in')
    return response.json()
}

// ─── CUSTOMERS ───────────────────────────────────────────────
export const getCustomers = async () => {
    const response = await fetch(`${API_BASE_URL}/api/customers`, {
    headers: getAuthHeader()
})
    if (!response.ok) throw new Error('Failed to fetch customers')
    return response.json()
}

export const getCustomer = async (id) => {
    const response = await fetch(`${API_BASE_URL}/api/customers/${id}`, {
        headers: getAuthHeader()
    })
    if (!response.ok) throw new Error('Failed to fetch customer')
    return response.json()
}

export const createCustomer = async (customer) => {
    const response = await fetch(`${API_BASE_URL}/api/customers`, {
        method: 'POST',
        headers: getAuthHeader(),
        body: JSON.stringify(customer)
    })
    if (!response.ok) throw new Error('Failed to create customer')
    return response.json()
}

export const updateCustomer = async (id, customer) => {
    const response = await fetch(`${API_BASE_URL}/api/customers/${id}`, {
        method: 'PATCH',
        headers: getAuthHeader(),
        body: JSON.stringify(customer)
    })
    if (!response.ok) throw new Error('Failed to update customer')
    return response.json()
}

//----SUBSITES-------------------
export const getSubsites = async (customer_id) =>{
    // console.log('customer_id is...', customer_id) WORKS!!!!
    const response = await fetch(`${API_BASE_URL}/api/subsites/${customer_id}`,{
        headers:getAuthHeader()
    })
    if(!response.ok) throw new Error('Failed to fetch subsites')
        return response.json()
}

export const getIndySubsite = async (subsite_id) => {
    console.log('after indy subsite, api.js subsite id is...', subsite_id) 
    const response = await fetch(`${API_BASE_URL}/api/subsite/${subsite_id}`, {
        headers:getAuthHeader()
    })
    if(!response.ok) throw new Error('Failed to fetch subsite')
        return response.json()
}

export const createSubsite = async (subsite_info )=>{
    const response = await fetch(`${API_BASE_URL}/api/subsites`, {
        method:'POST',
        headers:getAuthHeader(),
        body:JSON.stringify(subsite_info)
    })
    if (!response.ok) throw new Error('Failed to create subsite')
        return response.json()
}

export const updateSubsite = async (subsite_id, updateInfo) =>{
    const response = await fetch(`${API_BASE_URL}/api/subsites/${subsite_id}`,{
        method:'PATCH',
        headers:getAuthHeader(),
        body:JSON.stringify(updateInfo)
    })
    if(!response.ok) throw new Error('Failed to update subsite')
        return response.json()
}

export const deactivateSubsite = async (subsite_id) => {
    const response = await fetch(`${API_BASE_URL}/api/subsites/${subsite_id}/deactivate`,{
        method:'PATCH',
        headers:getAuthHeader()
    })
    if(!response.ok) throw new Error('Failed to deactivate subsite')
        return response.json()
}

// ─── INCIDENTS ───────────────────────────────────────────────
export const getIncidents = async () => {
    const response = await fetch(`${API_BASE_URL}/api/incidents`,{
        headers:getAuthHeader()
    })
    if (!response.ok) throw new Error('Failed to fetch incidents')
    return response.json()
}

export const getIncident = async (id) => {
    const response = await fetch(`${API_BASE_URL}/api/incidents/${id}`,{
        headers:getAuthHeader()
    })
    if (!response.ok) throw new Error('Failed to fetch incident')
    return response.json()
}

export const createIncident = async (incident) => {
    const response = await fetch(`${API_BASE_URL}/api/incidents`, {
        method: 'POST',
        headers: getAuthHeader(),
        body: JSON.stringify(incident)
    })
    if (!response.ok) throw new Error('Failed to create incident')
    return response.json()
}

export const updateIncident = async (id, updates) => {
    const response = await fetch(`${API_BASE_URL}/api/incidents/${id}`, {
        method: 'PATCH',
        headers: getAuthHeader(),
        body: JSON.stringify(updates)
    })
    if (!response.ok) throw new Error('Failed to update incident')
    return response.json()
}


// USERS
export const getUsers = async () => {
    const response = await fetch(`${API_BASE_URL}/api/users`,{
        headers:getAuthHeader()
    })
    if (!response.ok) throw new Error('Failed to fetch Users')
    return response.json()
}

export const getUser = async (id) => {
    const response = await fetch(`${API_BASE_URL}/api/users/${id}`,{
        headers:getAuthHeader()
    })
    if(!response.ok) throw new Error('Failed to fetch User')
        return response.json()
}

export const createUser = async (userData) => {
    const response = await fetch(`${API_BASE_URL}/api/users`,{
        method: 'POST',
        headers:getAuthHeader(),
        body: JSON.stringify(userData)
    })
    if(!response.ok) throw new Error('Failed to create user')
    return response.json()
}

export const updateUser = async (id, updateData) => {
    const response = await fetch(`${API_BASE_URL}/api/users/${id}`, {
        method:'PATCH',
        headers: getAuthHeader(),
        body: JSON.stringify(updateData)
    })
    if(!response.ok) throw new Error('Failed to update user')
    return response.json()
}

export const deactivateUser = async (id) => {
    const response = await fetch(`${API_BASE_URL}/api/users/${id}/deactivate`,{
        headers:getAuthHeader(),
        method:'PATCH'
    })
    if(!response.ok) throw new Error('Failed to deactivate user')
        return response.json()
}

export const getMe = async () =>{
    const response = await fetch(`${API_BASE_URL}/api/me`,{
        headers:getAuthHeader()
    })
    if(!response.ok) throw new Error('Failed to fetch user')
    return response.json()
}