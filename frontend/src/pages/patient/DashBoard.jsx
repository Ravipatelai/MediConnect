import React, { useState } from "react";
import Sidebar from "../../components/Sidebar";
import { IoSettingsOutline } from "react-icons/io5";
import { MdDashboard, MdCalendarToday } from "react-icons/md";
import { FaUserDoctor } from "react-icons/fa6";
import { FiLogOut } from "react-icons/fi";
import { useNavigate } from "react-router-dom";
import { RxHamburgerMenu } from "react-icons/rx"; // Hamburger Icon
import { IoMdClose } from "react-icons/io"; // Close Icon

function DashBoard() {
  const navigate = useNavigate();
  const name = localStorage.getItem("name");
  const [isOpen, setIsOpen] = useState(false);

  const items = [
    { name: "Dashboard", icon: MdDashboard, route: "/patient/dashboard" },
    { name: "Appointments", icon: MdCalendarToday, route: "/patient/appointments" },
    { name: "Doctors", icon: FaUserDoctor, route: "/patient/doctors" },
    { name: "Settings", icon: IoSettingsOutline, route: "/patient/settings" },
    { name: "Logout", icon: FiLogOut, route: "/" },
  ];

  const handleRoute = (route) => {
    navigate(route);
    setIsOpen(false); // close sidebar on navigation
  };

  return (
    <div className="flex h-screen bg-neutral-900 text-white">
      {/* Sidebar for medium and up */}
      <div className="hidden md:block w-64 bg-neutral-950">
        <Sidebar items={items} />
      </div>

      {/* Mobile Top Navbar */}
      <div className="md:hidden fixed top-0 left-0 right-0 z-50 flex items-center justify-between bg-neutral-950 p-4 border-b border-neutral-700">
        <button onClick={() => setIsOpen(!isOpen)}>
          {isOpen ? (
            <IoMdClose className="text-white text-2xl" />
          ) : (
            <RxHamburgerMenu className="text-white text-2xl" />
          )}
        </button>
        <h1 className="text-xl font-semibold">Welcome {name?.toUpperCase()}</h1>
        <div />
      </div>

      {/* Mobile Sidebar Drawer */}
      {isOpen && (
        <div className="fixed inset-0 z-40 flex md:hidden">
          {/* Clickable overlay to close */}
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
      <div className="flex-1 p-6 pt-20 md:pt-6 overflow-y-auto w-full">
        <h1 className="text-2xl font-bold mb-2">
          Welcome <span className="text-blue-400">{name?.toUpperCase() || "Guest"}</span>
        </h1>
        <p className="text-gray-400 mb-8">
          Manage your appointments, view history, and consult doctors with ease.
        </p>

        <div className="grid gap-6 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
          <DashboardCard
            title="Upcoming Appointments"
            buttonText="View Now"
            onClick={() => navigate("/patient/appointments")}
          />
          <DashboardCard
            title="Book New Appointments"
            buttonText="Book Now"
            onClick={() => navigate("/patient/doctors")}
          />
          <DashboardCard
            title="Last Consulted Doctors"
            buttonText="View History"
            onClick={() => navigate("/patient/history")}
          />
        </div>
      </div>
    </div>
  );
}

const DashboardCard = ({ title, buttonText, onClick }) => (
  <div className="rounded-xl p-6 bg-neutral-800 shadow hover:bg-neutral-700 transition duration-200">
    <h2 className="text-lg font-semibold mb-4">{title}</h2>
    <button
      onClick={onClick}
      className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded transition"
    >
      {buttonText}
    </button>
  </div>
);

export default DashBoard;
