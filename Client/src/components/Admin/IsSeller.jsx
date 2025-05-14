import React from 'react'
import { useSelector } from 'react-redux';


const IsSeller = ({ children }) => {

    const { role } = useSelector(state => state.auth)

    return (
        <>
            {role === "seller" && children}
        </>
    )
}

export default IsSeller
