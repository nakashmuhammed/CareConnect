import React, { useState } from 'react'
import { assets } from '../assets/assets'
import { useContext } from 'react'
import { AdminContext } from '../context/AdminContext'
import axios from 'axios' 
import { toast } from 'react-toastify'

const Login = () => {
  const [state, setState] = useState('Admin')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  
  const { setAToken, backendUrl } = useContext(AdminContext)

 const onSubmitHandler = async (event) => {
    event.preventDefault()
    
    try {
        if (state === 'Admin') {
            const { data } = await axios.post(`${backendUrl}/api/admin/login`, { email, password })
            
            if (data.success) {
                localStorage.setItem('aToken', data.token) // Save token to localStorage
                setAToken(data.token) // Update context state
            } else {
                toast.error(data.message)
            }
        } else {
            // Add Doctor login logic here later
        }
    } catch (error) {
        console.log("Login Error:", error)
        alert(error.message)
    }
  }
 return (
    <form onSubmit={onSubmitHandler} className='min-h-[80vh] flex items-center justify-center'>
      <div className='flex flex-col gap-3 m-auto items-start p-8 min-w-[340px] sm:min-w-96 border rounded-xl text-[#5E5E5E] text-sm shadow-lg'>
        <p className='text-2xl font-semibold m-auto'>
          <span className='text-primary'>{state}</span> Login
        </p>
        
        <div className='w-full py-2'>
          <p>Email</p>
          <input 
            onChange={(e) => setEmail(e.target.value)} 
            value={email} 
            type="email" 
            required 
            className='border border-[#DADADA] rounded w-full p-2 mt-1 outline-primary'
          />
        </div>

        <div className='w-full py-2'>
          <p>Password</p>
          <input 
            onChange={(e) => setPassword(e.target.value)} 
            value={password} 
            type="password" 
            required 
            className='border border-[#DADADA] rounded w-full p-2 mt-1 outline-primary'
          />
        </div>

        {/* Explicitly styled button */}
        <button type="submit" className='w-full py-2 mt-2 bg-primary text-white rounded-md text-base bg-blue-600 hover:bg-blue-700 transition-all cursor-pointer'>
          Login
        </button>

        {
          state === 'Admin' 
            ? <p>Doctor Login? <span onClick={() => setState('Doctor')} className='text-primary underline cursor-pointer'>Click here</span></p>
            : <p>Admin Login? <span onClick={() => setState('Admin')} className='text-primary underline cursor-pointer'>Click here</span></p>
        }
      </div>
    </form>
  )
}

export default Login