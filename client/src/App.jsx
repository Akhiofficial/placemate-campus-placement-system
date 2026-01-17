import React from 'react'
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { MockDataProvider } from './context/MockDataContext'
import Login from './pages/auth/Login'
import Signup from './pages/auth/Signup'
import DashboardLayout from './components/layout/DashboardLayout'
import StudentDashboard from './pages/student/StudentDashboard'
import JobListings from './pages/student/JobListings'
import MyApplications from './pages/student/MyApplications'
import Interviews from './pages/student/Interviews'
import Profile from './pages/student/Profile'
import Settings from './pages/student/Settings'

const App = () => {
  return (
    <MockDataProvider>
      <BrowserRouter>
        <Routes>
          {/* Auth Routes */}
          <Route path="/" element={<Login />} />
          <Route path="/signup" element={<Signup />} />

          {/* Student Routes Wrapped in DashboardLayout */}
          <Route path="/student" element={<DashboardLayout />}>
            <Route path="dashboard" element={<StudentDashboard />} />
            <Route path="jobs" element={<JobListings />} />
            <Route path="applications" element={<MyApplications />} />
            <Route path="interviews" element={<Interviews />} />
            <Route path="profile" element={<Profile />} />
            <Route path="settings" element={<Settings />} />
            {/* Redirect /student to dashboard */}
            <Route index element={<Navigate to="/student/dashboard" replace />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </MockDataProvider>
  )
}

export default App