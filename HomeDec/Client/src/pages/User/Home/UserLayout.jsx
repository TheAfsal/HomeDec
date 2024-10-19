import React, { useEffect, useState } from 'react'
import UserNavBar from '../../../components/NavigationComponents/UserNavBar'
import UserFooter from '../../../components/NavigationComponents/UserFooter'
import { Outlet } from 'react-router-dom'
import { verifyUserRole } from '../../../redux/slices/authSlice'
import { useDispatch, useSelector } from 'react-redux'
import CircularLoader from '../../../components/Loading/CircularLoader'

const UserLayout = () => {

  const [loading, setLoading] = useState(true)
  const dispatch = useDispatch();

  useEffect(() => {
    const key = localStorage.getItem("key");
    if (key) {
      dispatch(verifyUserRole())

    }
    setLoading(false)
  }, [dispatch]);

  if (loading) return (<CircularLoader />)

  return (
    <div>
      <UserNavBar />
      <Outlet />
      <UserFooter />
    </div>
  )
}

export default UserLayout
