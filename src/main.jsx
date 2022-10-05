import React from 'react'
import ReactDOM from 'react-dom/client'
import { createBrowserRouter, RouterProvider } from 'react-router-dom'
import { getContact } from './contacts'
import ErrorPage from './error-page'
import './index.css'
import Contact from './routes/contact'
import Root, { action as rootAction, loader as rootLoader } from './routes/root'

const router = createBrowserRouter([
  {
    path:'/',
    element: <Root/>,
    errorElement: <ErrorPage/>,
    loader: rootLoader,
    action : rootAction,
    children:[
      {
        path: 'contacts/:contactId',
        loader : async ({params:{contactId}}) => getContact(contactId),
        element: <Contact/>
      },
    ],
  },

  
])

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <RouterProvider router={router}/>
  </React.StrictMode>
)
