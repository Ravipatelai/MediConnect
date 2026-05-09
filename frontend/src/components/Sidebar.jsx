import React from "react";
import { useNavigate } from "react-router-dom";
import API from "../utils/api";
import { toast } from "react-hot-toast";

function Sidebar({ items, onItemClick }) {
  const navigate = useNavigate();

  const handleItemClick = async (item) => {
    if (item.name === "Logout") {
      try {
        await API.get("/auth/logout", { withCredentials: true });
        localStorage.removeItem("name");
        localStorage.removeItem("role");
        toast.success("Logout successful");
        navigate(item.route);
      } catch (error) {
        console.error("Logout failed:", error);
        toast.error("Logout failed. Please try again.");
      }
    } else {
      navigate(item.route);
    }

    // Close sidebar if onItemClick provided (i.e., mobile)
    if (onItemClick) {
      onItemClick(item.route);
    }
  };

  return (
    <ul className="space-y-12 h-dvh p-4 mt-12 text-lg">
      {items.map((item, index) => (
        <li
          key={index}
          onClick={() => handleItemClick(item)}
          className="flex items-center space-x-2 text-white hover:text-blue-700 cursor-pointer"
        >
          <item.icon className="text-xl" />
          <span>{item.name}</span>
        </li>
      ))}
    </ul>
  );
}


export default Sidebar;
