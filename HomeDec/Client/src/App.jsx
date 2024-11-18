import React from 'react'
import { RouterProvider } from "react-router-dom";
import routers from "./Routers";
import { ScrollRestoration } from "react-router-dom";

const App = () => {
  return (
    <RouterProvider router={routers} >
      <ScrollRestoration />
    </RouterProvider>
  )
}

export default App
