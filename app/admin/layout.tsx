
import React from 'react'
import AdminNavbar from './components/AdminNavbar'

interface AdminProps{
    children:React.ReactNode
}

const AdminLayout = ({children}:AdminProps) => {
  return (
    <div>
        <AdminNavbar/>
        {children}
    </div>
    
  )
}

export default AdminLayout