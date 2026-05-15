import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import Login from './pages/Login'
import Signup from './pages/Signup'

function PrivateRoute({ children }) {
  return localStorage.getItem('token') ? children : <Navigate to="/login" />
}

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/"        element={<Navigate to="/login" />} />
        <Route path="/login"   element={<Login />} />
        <Route path="/signup"  element={<Signup />} />
      </Routes>
    </BrowserRouter>
  )
}