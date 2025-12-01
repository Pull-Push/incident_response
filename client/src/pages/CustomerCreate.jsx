import { useNavigate } from "react-router-dom"

const navigate = useNavigate


export default function CreateCustomer(){
    function handleSubmit(){
        alert('Customer Created!')
        navigate('/customers')
    }
    return(
        <div className="customerCreateMain">
            <h1>Create A Customer</h1>
            <form action={()=> handleSubmit()}>
                <label>Customer Name</label>
                <input type="text" name="customerName" id="customerName" />
                <button type="submit">Create Customer</button>
            </form>
        </div>
    )
}