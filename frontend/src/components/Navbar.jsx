import React, { useEffect, useState } from "react";
import { FaSun, FaMoon, FaBars, FaStethoscope } from "react-icons/fa";
import { Link, useLocation } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import { useTheme } from "../context/ThemeContext";

export default function Navbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const { theme, toggleTheme } = useTheme();

  // Handle scroll background change
  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Show navbar only on home route
  if (location.pathname !== "/") return null;

  return (
    <header
      className={`sticky top-0 z-50 w-full transition-colors duration-300 ${
        scrolled
          ? " bg-slate-50 dark:bg-neutral-900 shadow-md"
          : "bg-white dark:bg-neutral-950"
      }`}
    >
      <div className="container mx-auto px-4 py-3 flex items-center justify-between">
        {/* Logo */}
        <a href="#hero" className="flex items-center space-x-2 text-primary">
          <div className="bg-primary p-2 rounded-full dark:text-white">
            <FaStethoscope className="text-xl" />
          </div>
          <span className="text-lg font-bold text-gray-800 dark:text-white">
            MediConnect
          </span>
        </a>

        {/* Desktop Nav */}
        <nav className="hidden md:flex items-center space-x-6">
          {[
            { href: "#features", label: "Features" },
            { href: "#how-it-works", label: "How It Works" },
            { href: "#testimonials", label: "Reviews" },
            { href: "#pricing", label: "Pricing" },
          ].map(({ href, label }) => (
            <a
              key={href}
              href={href}
              className="relative text-sm font-medium dark:text-gray-300 text-gray-700
                 after:absolute after:left-0 after:bottom-0 after:h-[2px] after:w-0
                 after:bg-black dark:after:bg-white after:transition-all after:duration-300 hover:after:w-full"
            >
              {label}
            </a>
          ))}
        </nav>

        {/* Right Actions */}
        <div className="flex items-center space-x-3">
          {/* Theme toggle */}
          <button
            onClick={toggleTheme}
            className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800 transition"
            aria-label="Toggle Theme"
          >
            {theme === "light" ? (
              <FaMoon className="text-blue-400 text-lg" />
            ) : (
              <FaSun className="text-yellow-500 text-lg" />
            )}
          </button>

          {/* Auth buttons */}
          <div className="hidden md:flex space-x-2">
            <button
              className="px-2 py-0.5 rounded-md cursor-pointer  relative text-sm font-medium dark:text-gray-300 text-gray-700
                 after:absolute after:left-0 after:bottom-0 after:h-[2px] after:w-0 after:bg-black
                 dark:after:bg-white after:transition-all after:duration-300 hover:after:w-full"
              onClick={() => navigate("/login")}
            >
              Sign In
            </button>
            <button
              className="px-4 py-2 cursor-pointer rounded-md  bg-neutral-700 text-white text-sm font-medium hover:bg-neutral-900 transition"
              onClick={() => navigate("/register")}
            >
              Get Started
            </button>
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="md:hidden p-2 text-gray-700 dark:text-gray-300"
          >
            <FaBars className="text-xl" />
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      {isMenuOpen && (
        <div className="md:hidden px-4 pb-4 space-y-2 border-t bg-white dark:bg-neutral-900">
          {[
            { href: "#features", label: "Features" },
            { href: "#how-it-works", label: "How It Works" },
            { href: "#testimonials", label: "Reviews" },
            { href: "#pricing", label: "Pricing" },
          ].map(({ href, label }) => (
            <a
              key={href}
              href={href}
              className="block text-sm font-medium text-gray-800 dark:text-gray-200 hover:text-primary dark:hover:text-primary transition"
            >
              {label}
            </a>
          ))}
        </div>
      )}
    </header>
  );
}
