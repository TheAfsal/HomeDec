import React, { useEffect, useState } from 'react'
import UserNavBar from '../../../Components/NavigationComponents/UserNavBar'
import UserFooter from '../../../Components/NavigationComponents/UserFooter'
import { Outlet } from 'react-router-dom'
import { verifyUserRole } from '../../../redux/slices/authSlice'
import { useDispatch, useSelector } from 'react-redux'

const UserLayout = () => {

  const [loading,setLoading] = useState(true)
  const dispatch = useDispatch();

  useEffect(() => {
    const key = localStorage.getItem("key");
    if (key) {
      dispatch(verifyUserRole()).catch((err) => {
        localStorage.removeItem("key")
      })
    }
    setLoading(false)
  }, [dispatch]);

  if (loading) return <>Loading...</>

  return (
    <div>
      <UserNavBar />
      <Outlet />
      <UserFooter />
    </div>
  )
}

export default UserLayout
