import React, { useEffect, useState } from 'react'
import { useDispatch } from 'react-redux'
import { NavLink, Outlet, useNavigate } from 'react-router-dom'
import { logout, verifyUserRole } from '../../../redux/slices/authSlice'

const AccountLayout = () => {

  const dispatch = useDispatch()
  const navigate = useNavigate()
  const [loading, setLoading] = useState(true)


  const account = [
    { content: "Orders", link: "orders" },
    { content: "Wishlist", link: "wishlist" },
    { content: "Payment methods", link: "--" },
    { content: "My reviews", link: "my-reviews" }
  ]
  const manageAccount = [
    { content: "Personal info", link: "personal-info" },
    { content: "Addresses", link: "my-addresses" },
    { content: "Notifications", link: "--" }
  ]
  const service = [
    { content: "Help center", link: "--" },
    { content: "Terms and conditions", link: "--" },
  ]


  useEffect(() => {
    const key = localStorage.getItem("key");
    if (key) {
      dispatch(verifyUserRole()).catch((err) => {
        localStorage.removeItem("key")
      })
    } else {
      navigate("/login")
    }
    setLoading(false)
  }, [dispatch]);


  const handleLogOut = () => {
    dispatch(logout())
  }

  if (loading) return <>Loading...</>

  return (
    <div className="flex space-x-10 p-8 mt-14">
      {/* Sidebar */}
      <div className="w-64 p-4 bg-white ">
        <div className="flex items-center space-x-4 mb-6">
          <div className="w-12 h-12 bg-pink-200 text-pink-600 flex items-center justify-center rounded-full">
            S
          </div>
          <div>
            <h4 className="font-semibold">Susan Gardner</h4>
            <p className="text-xs text-gray-500 flex items-center">
              <span role="img" aria-label="gift" className="mr-1">🎁</span>100 bonuses available
            </p>
          </div>
        </div>
        <div className="space-y-2">
          {
            account.map((item, index) => (
              <NavLink to={`/account/${item.link}`}
                className={({ isActive }) =>
                  `flex items-center space-x-2 rounded-lg p-2 ${isActive ? 'bg-gray-100' : 'hover:bg-gray-100'
                  }`
                }
                key={index}
              >
                <i className="icon-reviews" />
                <p>{item.content}</p>
              </NavLink>
            ))
          }

          <h5 className="text-gray-500 text-sm mt-6 mb-2">Manage account</h5>
          {
            manageAccount.map((item, index) => (
              <NavLink to={`/account/${item.link}`}
                className={({ isActive }) =>
                  `flex items-center space-x-2 rounded-lg p-2 ${isActive ? 'bg-gray-100' : 'hover:bg-gray-100'
                  }`
                }
                key={index}
              >
                <i className="icon-reviews" />
                <p>{item.content}</p>
              </NavLink>
            ))
          }


          <h5 className="text-gray-500 text-sm mt-6 mb-2">Customer service</h5>
          {
            service.map((item, index) => (
              <NavLink to={`/account/${item.link}`}
                className={({ isActive }) =>
                  `flex items-center space-x-2 rounded-lg p-2 ${isActive ? 'bg-gray-100' : 'hover:bg-gray-100'
                  }`
                }
                key={index}
              >
                <i className="icon-reviews" />
                <p>{item.content}</p>
              </NavLink>
            ))
          }
          <NavLink to={"/"}
            className={({ isActive }) =>
              `flex items-center space-x-2 rounded-lg p-2 ${isActive ? 'bg-gray-100' : 'hover:bg-gray-100'
              }`
            }
            onClick={handleLogOut}
          >
            <i className="icon-reviews" />
            <p>Log out</p>
          </NavLink>


        </div>
      </div>

      {/* Detail Pages... */}
      <div className="flex-1">
        <Outlet />
      </div>
    </div>
  )
}

export default AccountLayout



{/* <div className="text-xs bg-orange-400 text-white px-2 py-1 rounded-full">1</div> */ }