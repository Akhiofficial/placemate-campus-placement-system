import React from 'react'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import Login from './pages/auth/Login'
import Signup from './pages/auth/Signup'
import StudentDashboard from './pages/student/StudentDashboard'
import StudentProfile from './pages/student/StudentProfile'
import JobListings from './pages/student/JobListings'
import MyApplications from './pages/student/MyApplications'
import MyInterviews from './pages/student/MyInterviews'
import StudentSettings from './pages/student/StudentSettings'
import StudentLayout from './components/layout/StudentLayout'
import { ThemeProvider } from './context/ThemeContext'

const App = () => {
  return (
    <ThemeProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Login />} />
          <Route path="/signup" element={<Signup />} />

          <Route element={<StudentLayout />}>
            <Route path="/student/dashboard" element={<StudentDashboard />} />
            <Route path="/student/profile" element={<StudentProfile />} />
            <Route path="/student/jobs" element={<JobListings />} />
            <Route path="/student/applications" element={<MyApplications />} />
            <Route path="/student/interviews" element={<MyInterviews />} />
            <Route path="/student/settings" element={<StudentSettings />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </ThemeProvider>
  )
}

export default App