import React from 'react'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import Login from './pages/auth/Login'
import Signup from './pages/auth/Signup'
import ResetPassword from './pages/auth/ResetPassword'
import AuthSuccess from './pages/auth/AuthSuccess' // Import
import StudentDashboard from './pages/student/StudentDashboard'
import StudentProfile from './pages/student/StudentProfile'
import JobListings from './pages/student/JobListings'
import JobDetails from './pages/student/JobDetails'
import MyApplications from './pages/student/MyApplications'
import MyInterviews from './pages/student/MyInterviews'
import StudentSettings from './pages/student/StudentSettings'
import CompanyProfileView from './pages/student/CompanyProfileView'
import StudentLayout from './components/layout/StudentLayout'
import CompanyLayout from './components/layout/CompanyLayout'
import CompanyDashboard from './pages/company/CompanyDashboard'
import CompanyNotifications from './pages/company/CompanyNotifications'
import CompanyJobs from './pages/company/CompanyJobs'
import CreateJob from './pages/company/CreateJob'
import CompanyApplicants from './pages/company/CompanyApplicants'
import ApplicantProfile from './pages/company/ApplicantProfile'
import CompanyInterviews from './pages/company/CompanyInterviews'
import ScheduleInterview from './pages/company/ScheduleInterview'
import CompanyProfile from './pages/company/CompanyProfile'
import CompanySettings from './pages/company/CompanySettings'
import { ThemeProvider } from './context/ThemeContext'

import AdminLayout from './components/layout/AdminLayout'
import AdminDashboard from './pages/admin/AdminDashboard'
import AdminStudents from './pages/admin/AdminStudents'
import AdminCompanies from './pages/admin/AdminCompanies'
import AdminJobs from './pages/admin/AdminJobs'
import AdminApplications from './pages/admin/AdminApplications'
import AdminApplicationDetails from './pages/admin/AdminApplicationDetails' // Import
import SuperAdminRequests from './pages/admin/SuperAdminRequests' // Import

import AdminSettings from './pages/admin/AdminSettings'

const App = () => {
  return (
    <ThemeProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/reset-password/:token" element={<ResetPassword />} />
          <Route path="/auth/success" element={<AuthSuccess />} />

          <Route element={<StudentLayout />}>
            <Route path="/student/dashboard" element={<StudentDashboard />} />
            <Route path="/student/profile" element={<StudentProfile />} />
            <Route path="/student/jobs" element={<JobListings />} />
            <Route path="/student/jobs/:id" element={<JobDetails />} />
            <Route path="/student/applications" element={<MyApplications />} />
            <Route path="/student/interviews" element={<MyInterviews />} />
            <Route path="/student/company/:id" element={<CompanyProfileView />} />
            <Route path="/student/settings" element={<StudentSettings />} />
          </Route>

          {/* Company Routes */}
          <Route element={<CompanyLayout />}>
            <Route path="/company/dashboard" element={<CompanyDashboard />} />
            <Route path="/company/jobs" element={<CompanyJobs />} />
            <Route path="/company/jobs/create" element={<CreateJob />} />
            <Route path="/company/applicants" element={<CompanyApplicants />} />
            <Route path="/company/applications/:id" element={<ApplicantProfile />} />
            <Route path="/company/interviews" element={<CompanyInterviews />} />
            <Route path="/company/interviews/schedule" element={<ScheduleInterview />} />
            <Route path="/company/interviews/edit/:id" element={<ScheduleInterview />} />
            <Route path="/company/profile" element={<CompanyProfile />} />
            <Route path="/company/notifications" element={<CompanyNotifications />} />
            <Route path="/company/settings" element={<CompanySettings />} />
          </Route>

          {/* Admin Routes */}
          <Route element={<AdminLayout />}>
            <Route path="/admin/dashboard" element={<AdminDashboard />} />
            <Route path="/admin/students" element={<AdminStudents />} />
            <Route path="/admin/companies" element={<AdminCompanies />} />
            <Route path="/admin/jobs" element={<AdminJobs />} />
            <Route path="/admin/applications" element={<AdminApplications />} />
            <Route path="/admin/applications/:id" element={<AdminApplicationDetails />} />
            <Route path="/admin/requests" element={<SuperAdminRequests />} />
            <Route path="/admin/settings" element={<AdminSettings />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </ThemeProvider>
  )
}

export default App