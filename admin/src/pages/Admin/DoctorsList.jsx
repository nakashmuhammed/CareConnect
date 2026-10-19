import React, { useContext, useEffect } from 'react'
import { AdminContext } from '../../context/AdminContext'
import axios from 'axios'
import { toast } from 'react-toastify'

const DoctorsList = () => {
  const { doctors, aToken, getAllDoctors, backendUrl, } = useContext(AdminContext)

  useEffect(() => {
    if (aToken) {
      getAllDoctors()
    }
  }, [aToken])

  // Function to toggle doctor availability
  const changeAvailability = async (docId) => {
    try {
      const { data } = await axios.post(                //changeAvailability
        `${backendUrl}/api/admin/change-availablity`, 
        { docId }, 
        { headers: { aToken } }
      )

      if (data.success) {
        toast.success(data.message)
        getAllDoctors() // Refresh the list
      } else {
        toast.error(data.message)
      }
    } catch (error) {
      toast.error(error.message)
      console.log(error)
    }
  }

  return (
    <div className='m-5 max-h-[90vh] overflow-y-scroll'>
      <h1 className='text-lg font-medium'>All Doctors</h1>
      <div className='w-full flex flex-wrap gap-4 pt-4 gap-y-6'>
        {
          doctors.map((item, index) => (
            <div className='border border-indigo-200 rounded-xl max-w-56 overflow-hidden cursor-pointer group' key={index}>
              <img className='bg-indigo-50 group-hover:bg-primary transition-all duration-500' src={item.image} alt="" />
              <div className='p-4'>
                <p className='text-neutral-800 text-lg font-medium'>{item.name}</p>
                <p className='text-zinc-600 text-sm'>{item.speciality}</p>
                <div className='mt-2 flex items-center gap-1 text-sm'>
                  <input 
                    onChange={() => changeAvailability (item._id)} 
                    type="checkbox" 
                    checked={item.available} 
                  />
                  <p>Available</p>
                </div>
              </div>
            </div>
          ))
        }
      </div>
    </div>
  )
}

export default DoctorsList