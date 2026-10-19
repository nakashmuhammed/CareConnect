import React, { useContext } from 'react'
import { AppContext } from '../context/AppContext'

const MyAppointments = () => {
  const { doctors } = useContext(AppContext)

  return (
    <div>
      <p className='pb-3 mt-12 font-medium text-zinc-700 border-b border-gray-200'>
        My appointments
      </p>

      <div className='flex flex-col gap-4 mt-4'>
        {doctors.slice(0, 3).map((item, index) => (
          <div
            key={index}
            className='grid grid-cols-[1fr_2fr] sm:flex sm:gap-6 py-4 border-b border-gray-200 text-zinc-600 text-sm'
          >
            {/* Doctor Image */}
            <div>
              <img
                className='w-32 bg-indigo-50 rounded-lg object-cover'
                src={item.image}
                alt={item.name}
              />
            </div>

            {/* Doctor Details */}
            <div className='flex-1 text-sm text-zinc-500'>
              <p className='text-neutral-800 font-semibold text-base'>
                {item.name}
              </p>
              <p className='text-zinc-600 font-medium'>{item.speciality}</p>

              <p className='text-zinc-700 font-medium mt-1'>Address:</p>
              <p className='text-xs'>{item.address?.line1 || '57th Cross, Richmond'}</p>
              <p className='text-xs'>{item.address?.line2 || 'Circle, Church Road, London'}</p>

              <p className='text-xs mt-1'>
                <span className='text-sm text-neutral-700 font-medium'>
                  Date & Time:
                </span>{' '}
                25, July, 2024 | 8:30 PM
              </p>
            </div>

            <div></div>

            {/* Action Buttons */}
            <div className='flex flex-col gap-2 justify-end text-xs text-center'>
              <button className='text-stone-500 sm:min-w-48 py-2 border rounded hover:bg-primary hover:text-white transition-all duration-300'>
                Pay Online
              </button>
              <button className='text-stone-500 sm:min-w-48 py-2 border rounded hover:bg-red-600 hover:text-white transition-all duration-300'>
                Cancel appointment
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

export default MyAppointments