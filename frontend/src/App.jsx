import { Routes, Route } from 'react-router-dom'
import Home from './pages/Home'
import Login from './pages/Login'
import Register from './pages/Register'
import Dashboard from './pages/Dashboard'
import ProfileSetup from './pages/ProfileSetup'
import MentorListing from './pages/MentorListing'
import MentorDetail from './pages/MentorDetail'
import MyRequests from './pages/MyRequests'
import NotFound from './pages/NotFound'
import ProtectedRoute from './components/ProtectedRoute'
import SidebarLayout from './components/SidebarLayout'

function App() {
  return (
    <Routes>
      {/* Public pages (no sidebar) */}
      <Route path="/" element={<Home />} />
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />

      {/* Pages with Sidebar Layout */}
      <Route path="/mentors" element={
        <SidebarLayout><MentorListing /></SidebarLayout>
      } />
      <Route path="/mentors/:id" element={
        <SidebarLayout><MentorDetail /></SidebarLayout>
      } />
      
      <Route path="/dashboard" element={
        <ProtectedRoute><SidebarLayout><Dashboard /></SidebarLayout></ProtectedRoute>
      } />
      <Route path="/profile" element={
        <ProtectedRoute><SidebarLayout><ProfileSetup /></SidebarLayout></ProtectedRoute>
      } />
      <Route path="/requests" element={
        <ProtectedRoute><SidebarLayout><MyRequests /></SidebarLayout></ProtectedRoute>
      } />

      {/* Catch-all */}
      <Route path="*" element={<NotFound />} />
    </Routes>
  )
}

export default App
