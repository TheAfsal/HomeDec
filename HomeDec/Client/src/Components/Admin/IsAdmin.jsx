import React from 'react'
import { useSelector } from 'react-redux';


const IsAdmin = ({ children }) => {

    const { role } = useSelector(state => state.auth)

    return (
        <>
            {role === "admin" && children}
        </>
    )
}

export default IsAdmin
