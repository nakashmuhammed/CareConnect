import React, { useContext, useState } from 'react'
import { AppContext } from '../context/AppContext.jsx'
import { assets } from '../assets/assets'
import axios from 'axios'
import { toast } from 'react-toastify'

const MyProfile = () => {
  const { userData, setUserData, token, backendUrl, loadUserProfileData } = useContext(AppContext)

  const [isEdit, setIsEdit] = useState(false)
  const [image, setImage] = useState(false)

  // API Call to update user profile in backend
  const updateUserProfileData = async () => {
    try {
      const formData = new FormData()

      formData.append('name', userData.name)
      formData.append('phone', userData.phone)
      formData.append('address', JSON.stringify(userData.address || { line1: '', line2: '' }))
      formData.append('gender', userData.gender)
      formData.append('dob', userData.dob)

      if (image) {
        formData.append('image', image)
      }

      const { data } = await axios.post(backendUrl + '/api/user/update-profile', formData, {
        headers: { token }
      })

      if (data.success) {
        toast.success(data.message)
        await loadUserProfileData()
        setIsEdit(false)
        setImage(false)
      } else {
        toast.error(data.message)
      }
    } catch (error) {
      console.log(error)
      toast.error(error.message)
    }
  }

  // Prompt if not logged in
  if (!token) {
    return (
      <div className='min-h-[50vh] flex flex-col items-center justify-center gap-3 text-neutral-600'>
        <p className='text-lg font-medium'>Please log in to view your profile</p>
      </div>
    );
  }

  // Prevent crashing while user data is still loading from the backend
  if (!userData) {
    return (
      <div className='min-h-[50vh] flex items-center justify-center text-neutral-500'>
        <p>Loading profile...</p>
      </div>
    );
  }

  return (
    <div className='max-w-lg flex flex-col gap-2 text-sm pt-5'>
      {/* Profile Picture & File Upload */}
      {isEdit ? (
        <label htmlFor='image' className='relative cursor-pointer w-36'>
          <div className='inline-block relative cursor-pointer'>
            <img
              className='w-36 rounded-lg opacity-75'
              src={image ? URL.createObjectURL(image) : (userData.image || assets.profile_pic)}
              alt='Profile'
            />
            {!image && (
              <img
                className='w-10 absolute bottom-12 right-12'
                src={assets.upload_icon}
                alt='Upload'
              />
            )}
          </div>
          <input
            onChange={(e) => setImage(e.target.files[0])}
            type='file'
            id='image'
            hidden
          />
        </label>
      ) : (
        <img className='w-36 rounded-lg' src={userData.image || assets.profile_pic} alt='Profile' />
      )}

      {/* Name */}
      {isEdit ? (
        <input
          className='bg-gray-50 text-3xl font-medium max-w-60 mt-4 border border-gray-300 rounded px-2 outline-primary'
          type='text'
          value={userData.name}
          onChange={(e) =>
            setUserData((prev) => ({ ...prev, name: e.target.value }))
          }
        />
      ) : (
        <p className='font-medium text-3xl text-neutral-800 mt-4'>
          {userData.name}
        </p>
      )}

      <hr className='bg-zinc-400 h-[1px] border-none my-2' />

      {/* Contact Information Section */}
      <div>
        <p className='text-neutral-500 underline mt-3 uppercase tracking-wider text-xs font-semibold'>
          Contact Information
        </p>
        <div className='grid grid-cols-[1fr_3fr] gap-y-2.5 mt-3 text-neutral-700'>
          <p className='font-medium'>Email id:</p>
          <p className='text-blue-500'>{userData.email}</p>

          <p className='font-medium'>Phone:</p>
          {isEdit ? (
            <input
              className='bg-gray-100 max-w-52 border border-gray-300 rounded px-2 py-1 outline-primary'
              type='text'
              value={userData.phone}
              onChange={(e) =>
                setUserData((prev) => ({ ...prev, phone: e.target.value }))
              }
            />
          ) : (
            <p className='text-blue-400'>{userData.phone}</p>
          )}

          <p className='font-medium'>Address:</p>
          {isEdit ? (
            <p>
              <input
                className='bg-gray-100 w-full border border-gray-300 rounded px-2 py-1 mb-1 outline-primary'
                type='text'
                value={userData.address?.line1 || ''} 
                onChange={(e) =>
                  setUserData((prev) => ({
                    ...prev,
                    address: { ...(prev.address || {}), line1: e.target.value },
                  }))
                }
              />
              <br />
              <input
                className='bg-gray-100 w-full border border-gray-300 rounded px-2 py-1 outline-primary'
                type='text'
                value={userData.address?.line2 || ''}
                onChange={(e) =>
                  setUserData((prev) => ({
                    ...prev,
                    address: { ...(prev.address || {}), line2: e.target.value },
                  }))
                }
              />
            </p>
          ) : (
            <p className='text-gray-500'>
              {userData.address?.line1}
              <br />
              {userData.address?.line2}
            </p>
          )}
        </div>
      </div>

      {/* Basic Information Section */}
      <div>
        <p className='text-neutral-500 underline mt-6 uppercase tracking-wider text-xs font-semibold'>
          Basic Information
        </p>
        <div className='grid grid-cols-[1fr_3fr] gap-y-2.5 mt-3 text-neutral-700'>
          <p className='font-medium'>Gender:</p>
          {isEdit ? (
            <select
              className='max-w-28 bg-gray-100 border border-gray-300 rounded px-2 py-1 outline-primary'
              value={userData.gender || 'Not Selected'}
              onChange={(e) =>
                setUserData((prev) => ({ ...prev, gender: e.target.value }))
              }
            >
              <option value='Not Selected'>Not Selected</option>
              <option value='Male'>Male</option>
              <option value='Female'>Female</option>
            </select>
          ) : (
            <p className='text-gray-400'>{userData.gender}</p>
          )}

          <p className='font-medium'>Birthday:</p>
          {isEdit ? (
            <input
              className='max-w-36 bg-gray-100 border border-gray-300 rounded px-2 py-1 outline-primary'
              type='date'
              value={userData.dob === 'Not Selected' ? '' : (userData.dob || '')}
              onChange={(e) =>
                setUserData((prev) => ({ ...prev, dob: e.target.value }))
              }
            />
          ) : (
            <p className='text-gray-400'>{userData.dob}</p>
          )}
        </div>
      </div>

      {/* Action Button */}
      <div className='mt-10'>
        {isEdit ? (
          <button
            onClick={updateUserProfileData}
            className='border border-primary text-primary px-8 py-2 rounded-full hover:bg-primary hover:text-white transition-all duration-300'
          >
            Save information
          </button>
        ) : (
          <button
            onClick={() => setIsEdit(true)}
            className='border border-primary text-primary px-8 py-2 rounded-full hover:bg-primary hover:text-white transition-all duration-300'
          >
            Edit
          </button>
        )}
      </div>
    </div>
  )
}

export default MyProfile