import { useState, useEffect } from "react"; 
import { AuthContext } from "./AuthContext";
import { getMe } from '../services/api' 

export default function AuthProvider ({children}){
        const [loading, setLoading ] = useState(true)
        const [error, setError] = useState(null)
        const [currentUser, setCurrentUser ] = useState(null)
    
        useEffect(()=>{
                const token = localStorage.getItem('token')
                if(token){
                    getMeData()
                }else{
                    setLoading(false)
                }
            },[])
        
            const getMeData = async() =>{
                setLoading(true);
                setError(null);
                try {
                    const data = await getMe();
                    setCurrentUser(data)
                } catch (error) {
                    localStorage.removeItem('token')
                    console.error('Error loading user', error)
                    setError('Failed to load user, Please try again')
                }finally{
                    setLoading(false)
                }
            }
        return (
            <AuthContext.Provider value={{currentUser, setCurrentUser, loading}}>
                {children}
            </AuthContext.Provider>
        )
}