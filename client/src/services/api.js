const API_BASE_URL = 'http://localhost:5050'
// const API_BASE_URL = 'http://192.168.50.117:5050' set to machine ip for mobile testing!!


//GET DASHBOARD INFO WEATHER - MAP - INCIDENTS
export const getWeather = async () =>{
    const response = await fetch(`${API_BASE_URL}/api/dashboard`)
    if(!response.ok) throw new Error('Failed to fetch weather')
        return response.json()
}

export const getCustomers = async () =>{
    const response = await fetch(`${API_BASE_URL}/api/customers`)
    if(!response.ok) throw new Error("Failed to fetch customers")
        return response.json()
}

export const createCustomer = async (customer) =>{
    // console.log('in the front end api', customer)
    const response = await fetch(`${API_BASE_URL}/api/customers`, {
        method: 'POST',
        headers: {
            'Content-Type' : 'application/json'
        },
        body:JSON.stringify(customer)
    })
    if(!response.ok) throw new Error("Failed to create customer")
    return response.json()
}