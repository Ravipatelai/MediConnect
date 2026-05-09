// src/App.jsx
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { Toaster } from "react-hot-toast";
import ProtectedRoute from "./components/ProtectedRoute";

import Home from "./pages/Home";
import Login from "./pages/Login";
import Register from "./pages/Register";
import NotFound from "./pages/NotFound";

// Patient Pages
import PatientDashBaord from "./pages/patient/DashBoard";
import BookAppointment from "./pages/patient/BookAppointment";
import PatientHistory from "./pages/patient/History";
import AvailableDoctors from "./pages/patient/Doctors";
import PatientSetting from "./pages/patient/PatientSetting";
import Payment from "./pages/patient/Payment";
import AppointmentSuccess from "./pages/patient/AppointmentSuccess";
import UpcomingAppointment from "./pages/patient/UpcomingAppointment";
import Review from "./pages/patient/Review";

// Doctor Pages
import DoctorDashBaord from "./pages/doctor/DashBoard";
import DoctorSchedule from "./pages/doctor/Schedule";
import DoctorEarning from "./pages/doctor/EarningReport";
import DoctorSettings from "./pages/doctor/DoctorSettings";
import DoctorProfile from "./pages/doctor/Profile";
import DoctorReviews from "./pages/doctor/DoctorReviews";

// Admin Pages
import AdminDashBaord from "./pages/admin/DashBoard";
import DoctorVerify from "./pages/admin/DoctorVerification";
import PatientList from "./pages/admin/PatientList";

import VideoCallPage from "./pages/VideoCall";

// Layouts
import HomeLayout from "./components/HomeLayout"; // contains Navbar + ThemeToggle

function App() {
  return (
    <Router>
      <Toaster position="top-right" toastOptions={{ duration: 3000 }} />
      <Routes>
        {/* Public Routes */}
        <Route
          path="/"
          element={
            <HomeLayout>
              <Home />
            </HomeLayout>
          }
        />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />

        {/* Patient Routes */}
        <Route
          path="/patient/dashboard"
          element={
            <ProtectedRoute allowedRoles={["patient"]}>
              <PatientDashBaord />
            </ProtectedRoute>
          }
        />
        <Route
          path="/patient/book"
          element={
            <ProtectedRoute allowedRoles={["patient"]}>
              <BookAppointment />
            </ProtectedRoute>
          }
        />
        <Route
          path="/patient/history"
          element={
            <ProtectedRoute allowedRoles={["patient"]}>
              <PatientHistory />
            </ProtectedRoute>
          }
        />
        <Route
          path="/patient/doctors"
          element={
            <ProtectedRoute allowedRoles={["patient"]}>
              <AvailableDoctors />
            </ProtectedRoute>
          }
        />
        <Route
          path="/patient/settings"
          element={
            <ProtectedRoute allowedRoles={["patient"]}>
              <PatientSetting />
            </ProtectedRoute>
          }
        />
        <Route
          path="/patient/payment"
          element={
            <ProtectedRoute allowedRoles={["patient"]}>
              <Payment />
            </ProtectedRoute>
          }
        />
        <Route
          path="/patient/success"
          element={
            <ProtectedRoute allowedRoles={["patient"]}>
              <AppointmentSuccess />
            </ProtectedRoute>
          }
        />
        <Route
          path="/patient/appointments"
          element={
            <ProtectedRoute allowedRoles={["patient"]}>
              <UpcomingAppointment />
            </ProtectedRoute>
          }
        />
        <Route
          path="/patient/review/:appointmentId"
          element={
            <ProtectedRoute allowedRoles={["patient"]}>
              <Review />
            </ProtectedRoute>
          }
        />

        {/* Doctor Routes */}
        <Route
          path="/doctor/dashboard"
          element={
            <ProtectedRoute allowedRoles={["doctor"]}>
              <DoctorDashBaord />
            </ProtectedRoute>
          }
        />
        <Route
          path="/doctor/schedule"
          element={
            <ProtectedRoute allowedRoles={["doctor"]}>
              <DoctorSchedule />
            </ProtectedRoute>
          }
        />
        <Route
          path="/doctor/earning"
          element={
            <ProtectedRoute allowedRoles={["doctor"]}>
              <DoctorEarning />
            </ProtectedRoute>
          }
        />
         <Route
          path="/doctor/reviews"
          element={
            <ProtectedRoute allowedRoles={["doctor"]}>
              <DoctorReviews />
            </ProtectedRoute>
          }
        />
        <Route
          path="/doctor/settings"
          element={
            <ProtectedRoute allowedRoles={["doctor"]}>
              <DoctorSettings />
            </ProtectedRoute>
          }
        />
        <Route
          path="/doctor/profile"
          element={
            <ProtectedRoute allowedRoles={["doctor"]}>
              <DoctorProfile />
            </ProtectedRoute>
          }
        />

        {/* Admin Routes */}
        <Route
          path="/admin/dashboard"
          element={
            <ProtectedRoute allowedRoles={["admin"]}>
              <AdminDashBaord />
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin/verify"
          element={
            <ProtectedRoute allowedRoles={["admin"]}>
              <DoctorVerify />
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin/patient-list"
          element={
            <ProtectedRoute allowedRoles={["admin"]}>
              <PatientList />
            </ProtectedRoute>
          }
        />

         <Route path="/call/:roomId" element={<VideoCallPage />} />
        {/* Catch-all route */}
        <Route path="*" element={<NotFound />} />
      </Routes>
    </Router>
  );
}

export default App;
