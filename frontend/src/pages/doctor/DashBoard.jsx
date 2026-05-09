import React, { useState } from "react";
import Sidebar from "../../components/Sidebar";
import { IoSettingsOutline } from "react-icons/io5";
import {
  MdDashboard,
  MdCalendarToday,
  MdOutlineAttachMoney,
} from "react-icons/md";
import { CgProfile } from "react-icons/cg";
import { FiLogOut } from "react-icons/fi";
import { useNavigate } from "react-router-dom";
import { RxHamburgerMenu } from "react-icons/rx";
import { IoMdClose } from "react-icons/io";

function DoctorDashboard() {
  const navigate = useNavigate();
  const [isOpen, setIsOpen] = useState(false);
  const name = localStorage.getItem("name");

  const items = [
    { name: "Dashboard", icon: MdDashboard, route: "/doctor/dashboard" },
    { name: "Appointments", icon: MdCalendarToday, route: "/doctor/schedule" },
    { name: "Earnings", icon: MdOutlineAttachMoney, route: "/doctor/earning" },
    // { name: "Reviews", icon: MdOutlineAttachMoney, route: "/doctor/reviews" },
    { name: "Profile", icon: CgProfile, route: "/doctor/profile" },
    { name: "Settings", icon: IoSettingsOutline, route: "/doctor/settings" },
    { name: "Logout", icon: FiLogOut, route: "/" },
  ];

  const handleRoute = (route) => {
    navigate(route);
    setIsOpen(false); // Close sidebar on mobile after navigation
  };

  return (
    <div className="flex h-screen bg-neutral-900 text-white">
      {/* Desktop Sidebar */}
      <div className="hidden md:block w-64 bg-neutral-950 border-r border-neutral-700">
        <Sidebar items={items} />
      </div>

      {/* Mobile Header */}
      <div className="md:hidden fixed top-0 left-0 right-0 z-50 bg-neutral-950 border-b border-neutral-700 flex justify-between items-center p-4">
        <button onClick={() => setIsOpen(!isOpen)}>
          {isOpen ? (
            <IoMdClose className="text-white text-2xl" />
          ) : (
            <RxHamburgerMenu className="text-white text-2xl" />
          )}
        </button>
        <h1 className="text-lg font-bold truncate">Dr. {name?.toUpperCase()}</h1>
        <div /> {/* Spacer */}
      </div>

      {/* Mobile Sidebar Drawer */}
      {isOpen && (
        <div className="fixed inset-0 z-40 flex md:hidden">
          {/* Background overlay to close */}
          <div
            className="flex-1 bg-black bg-opacity-40"
            onClick={() => setIsOpen(false)}
          ></div>

          {/* Sidebar panel */}
          <div className="w-64 h-full bg-neutral-950 p-5 shadow-lg">
            <Sidebar items={items} onItemClick={handleRoute} />
          </div>
        </div>
      )}

      {/* Main Content */}
      <div className="flex-1 overflow-y-auto pt-20 md:pt-6 p-6">
        <h1 className="text-3xl font-bold text-blue-500 text-center mb-2">
          Doctor Dashboard
        </h1>
        <p className="text-center text-gray-400 mb-8">
          Welcome, Doctor! Manage appointments, consult patients, and track your performance.
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <DashboardCard
            title="Upcoming Appointments"
            text="Latest patients scheduled"
            btnText="View Schedule"
            onClick={() => navigate("/doctor/schedule")}
          />
         
          {/* <DashboardCard
            title="Consultation History"
            text="Access past patient records and notes."
            btnText="View History"
            onClick={() => navigate("/doctor/history")}
          /> */}
          {/* <DashboardCard
            title="Set Availability"
            text="Update your weekly consultation slots."
            btnText="Update Slots"
            onClick={() => navigate("/doctor/availability")}
            bg="bg-yellow-400 hover:bg-yellow-500 text-black font-semibold"
          /> */}
          <DashboardCard
            title="My Earnings"
            text="Find your earnings"
            btnText="View Reports"
            onClick={() => navigate("/doctor/earning")}
            bg="bg-gray-700 hover:bg-gray-600"
          />
        </div>
      </div>
    </div>
  );
}

// Reusable Card Component
const DashboardCard = ({
  title,
  text,
  btnText,
  onClick,
  bg = "bg-blue-600 hover:bg-blue-700",
  textColor = "text-white",
}) => (
  <div className="bg-neutral-800 p-5 rounded shadow hover:shadow-md transition border border-neutral-700">
    <h2 className="text-xl font-semibold mb-3 text-white">{title}</h2>
    <p className="text-gray-400 mb-3">{text}</p>
    <button
      className={`${bg} ${textColor} py-2 px-4 rounded transition`}
      onClick={onClick}
    >
      {btnText}
    </button>
  </div>
);

export default DoctorDashboard;
