import React from "react";
import Sidebar from "../../components/Sidebar";
import { IoSettingsOutline } from "react-icons/io5";
import { MdDashboard, MdCalendarToday, MdOutlineAttachMoney } from "react-icons/md";
import { FiLogOut } from "react-icons/fi";
import { useNavigate } from "react-router-dom";

function DashBoard() {
  const navigate = useNavigate();

  const items = [
    { name: "Dashboard", icon: MdDashboard },
    { name: "Appointments", icon: MdCalendarToday },
    { name: "Earnings", icon: MdOutlineAttachMoney },
    { name: "Settings", icon: IoSettingsOutline },
   { name: "Logout", icon: FiLogOut, route: "/" }
  ];

  return (
    <div className="flex h-screen overflow-hidden">
      {/* Sidebar */}
      <div className="w-64 bg-neutral-800 border-r border-neutral-700 h-full overflow-hidden">
        <Sidebar items={items} />
      </div>

      {/* Main Content */}
      <div className="flex-1 overflow-y-auto p-6 bg-neutral-900">
        <h1 className="text-3xl font-bold text-center text-blue-400 mb-2">Admin Dashboard</h1>
        <p className="text-center text-gray-300 mb-8">
          Welcome, Admin! Here you can manage users, verify doctors, and oversee appointments.
        </p>

        {/* Admin Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 justify-center">
          {/* Pending Verifications */}
          <div className="bg-neutral-800 p-5 rounded border border-neutral-700 shadow hover:shadow-md transition">
            <h2 className="text-xl font-semibold text-amber-400 mb-3">Doctors Pending Verification</h2>
            <p className="text-gray-300 mb-3">8 doctors are awaiting approval.</p>
            <button
              className="btn bg-amber-400 hover:bg-amber-500 text-black w-full"
              onClick={() => navigate('/admin/verify')}
            >
              Verify Now
            </button>
          </div>

          {/* Total Registered Patients */}
          <div className="bg-neutral-800 p-5 rounded border border-neutral-700 shadow hover:shadow-md transition">
            <h2 className="text-xl font-semibold text-blue-400 mb-3">Total Patients</h2>
            <p className="text-gray-300 mb-3">532 patients registered on the platform.</p>
            <button
              className="btn bg-blue-600 hover:bg-blue-700 text-white w-full"
              onClick={() => navigate('/admin/patient-list')}
            >
              View Patients
            </button>
          </div>

          {/* Appointment Logs */}
          <div className="bg-neutral-800 p-5 rounded border border-neutral-700 shadow hover:shadow-md transition">
            <h2 className="text-xl font-semibold text-blue-400 mb-3">All Appointments</h2>
            <p className="text-gray-300 mb-3">Monitor or export platform-wide bookings.</p>
            <button className="btn bg-violet-500 hover:bg-violet-600 text-white w-full">View Logs</button>
          </div>

          {/* Revenue */}
          <div className="bg-neutral-800 p-5 rounded border border-neutral-700 shadow hover:shadow-md transition">
            <h2 className="text-xl font-semibold text-blue-400 mb-3">Platform Revenue</h2>
            <p className="text-gray-300 mb-3">Total collected: ₹2,45,000</p>
            <button className="btn bg-green-500 hover:bg-green-600 text-white w-full">View Reports</button>
          </div>

          {/* System Settings */}
          <div className="bg-neutral-800 p-5 rounded border border-neutral-700 shadow hover:shadow-md transition">
            <h2 className="text-xl font-semibold text-blue-400 mb-3">System Settings</h2>
            <p className="text-gray-300 mb-3">Manage roles, access, and configurations.</p>
            <button className="btn bg-neutral-700 hover:bg-neutral-600 text-white w-full">Go to Settings</button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default DashBoard;
