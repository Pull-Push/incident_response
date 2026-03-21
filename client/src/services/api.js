const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5050'

// ─── DASHBOARD ───────────────────────────────────────────────
export const getDash = async () => {
    const response = await fetch(`${API_BASE_URL}/api/dashboard`)
    if (!response.ok) throw new Error('Failed to fetch dashboard data')
    return response.json()
}

// ─── CUSTOMERS ───────────────────────────────────────────────
export const getCustomers = async () => {
    const response = await fetch(`${API_BASE_URL}/api/customers`)
    if (!response.ok) throw new Error('Failed to fetch customers')
    return response.json()
}

export const getCustomer = async (id) => {
    const response = await fetch(`${API_BASE_URL}/api/customers/${id}`)
    if (!response.ok) throw new Error('Failed to fetch customer')
    return response.json()
}

export const createCustomer = async (customer) => {
    const response = await fetch(`${API_BASE_URL}/api/customers`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(customer)
    })
    if (!response.ok) throw new Error('Failed to create customer')
    return response.json()
}

export const updateCustomer = async (id, customer) => {
    const response = await fetch(`${API_BASE_URL}/api/customers/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(customer)
    })
    if (!response.ok) throw new Error('Failed to update customer')
    return response.json()
}

// ─── INCIDENTS ───────────────────────────────────────────────
export const getIncidents = async () => {
    const response = await fetch(`${API_BASE_URL}/api/incidents`)
    if (!response.ok) throw new Error('Failed to fetch incidents')
    return response.json()
}

export const getIncident = async (id) => {
    const response = await fetch(`${API_BASE_URL}/api/incidents/${id}`)
    if (!response.ok) throw new Error('Failed to fetch incident')
    return response.json()
}

export const createIncident = async (incident) => {
    const response = await fetch(`${API_BASE_URL}/api/incidents`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(incident)
    })
    if (!response.ok) throw new Error('Failed to create incident')
    return response.json()
}

export const updateIncident = async (id, updates) => {
    const response = await fetch(`${API_BASE_URL}/api/incidents/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updates)
    })
    if (!response.ok) throw new Error('Failed to update incident')
    return response.json()
}


// USERS
export const getUsers = async () => {
    const response = await fetch(`${API_BASE_URL}/api/users`)
    if (!response.ok) throw new Error('Failed to fetch Users')
    return response.json()
}

export const getUser = async (id) => {
    const response = await fetch(`${API_BASE_URL}/api/users/${id}`)
    if(!response.ok) throw new Error('Failed to fetch User')
        return response.json()
}

export const createUser = async (userData) => {
    const response = await fetch(`${API_BASE_URL}/api/users`,{
        method: 'POST',
        headers:{'Content-Type': 'application/json'},
        body: JSON.stringify(userData)
    })
    if(!response.ok) throw new Error('Failed to create user')
    return response.json()
}

export const updateUser = async (id, updateData) => {
    const response = await fetch(`${API_BASE_URL}/api/users/${id}`, {
        method:'PATCH',
        headers: {'Content-Type':'application/json'},
        body: JSON.stringify(updateData)
    })
    if(!response.ok) throw new Error('Failed to update user')
    return response.json()
}

export const deactivateUser = async (id) => {
    const response = await fetch(`${API_BASE_URL}/api/users/${id}/deactivate`,{
        method:'PATCH'
    })
    if(!response.ok) throw new Error('Failed to deactivate user')
        return response.json()
}