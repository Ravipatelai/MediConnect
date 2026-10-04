import React from "react";
import {
  FaFacebookF,
  FaTwitter,
  FaInstagram,
  FaHospitalAlt,
} from "react-icons/fa";

function Footer() {
  return (
    <>
      {/* Top Footer Section */}
      <footer className="dark:bg-neutral-900  text-white px-6 sm:px-10 py-16">
        <div className="max-w-7xl mx-auto grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-10">
          {/* Services */}
          <div>
            <h6 className="text-lg font-semibold mb-4 dark:text-white text-black">
              Services
            </h6>
            <ul className="space-y-2 text-sm dark:text-gray-300 text-gray-600">
              <li>
                <a className="hover:text-white transition">Emergency Care</a>
              </li>
              <li>
                <a className="hover:text-white transition">Surgery</a>
              </li>
              <li>
                <a className="hover:text-white transition">Laboratory</a>
              </li>
              <li>
                <a className="hover:text-white transition">Pharmacy</a>
              </li>
              <li>
                <a className="hover:text-white transition">Radiology</a>
              </li>
            </ul>
          </div>

          {/* Company */}
          <div>
            <h6 className="text-lg font-semibold mb-4 dark:text-white text-black">
              Company
            </h6>
            <ul className="space-y-2 text-sm cursor-pointer text-gray-600 dark:text-gray-300">
              <li>
                <a className="dark:hover:text-white hover:underline transition">
                  About Us
                </a>
              </li>
              <li>
                <a className="dark:hover:text-white hover:underline transition">
                  Contact
                </a>
              </li>
              <li>
                <a className="dark:hover:text-white hover:underline transition">
                  Careers
                </a>
              </li>
              <li>
                <a className="dark:hover:text-white hover:underline transition">
                  Press
                </a>
              </li>
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <h6 className="text-lg font-semibold dark:text-white text-black mb-4">
              Contact Info
            </h6>
            <ul className="space-y-2 text-sm text-gray-600 dark:text-gray-300">
              <li>123 Health Street, Medical City</li>
              <li>(555) 123-4567</li>
              <li>info@medicare-plus.com</li>
              <li>Mon-Fri: 8am – 8pm | Emergency: 24/7</li>
            </ul>
          </div>

          {/* Social & Branding */}
          <div>
            <h6 className="text-lg font-semibold dark:text-white text-black mb-4">
              Follow Us
            </h6>
            <div className="flex space-x-4 text-xl">
              <a
                className="text-[#1877F2] hover:text-[#0e5bd1] transition"
                href="#"
                aria-label="Facebook"
              >
                <FaFacebookF />
              </a>
              <a
                className="text-[#1DA1F2] hover:text-[#0c8ddb] transition"
                href="#"
                aria-label="Twitter"
              >
                <FaTwitter />
              </a>
              <a
                className="text-[#E1306C] hover:text-[#c42d5f] transition"
                href="#"
                aria-label="Instagram"
              >
                <FaInstagram />
              </a>
            </div>
            <div className="mt-6 flex items-center space-x-3">
              <FaHospitalAlt className="text-blue-400 text-3xl" />
              <span className="dark:text-white font-semibold text-lg">MediConnect</span>
            </div>
            <p className="dark:text-gray-400 text-gray-600 text-sm mt-2">
              Excellence in care since 2023
            </p>
          </div>
        </div>
      </footer>

      {/* Bottom Footer */}
      <div className="dark:bg-neutral-900 border-t border-gray-700 dark:text-gray-400 text-sm py-4 px-6 sm:px-10 flex flex-col sm:flex-row justify-between items-center">
        <p>© {new Date().getFullYear()} MediCare Plus. All rights reserved.</p>
        <div className="flex space-x-4 mt-2 sm:mt-0">
          <a href="#" className="dark:hover:text-white transition">
            Privacy Policy
          </a>
          <a href="#" className="dark:hover:text-white transition">
            Terms of Service
          </a>
        </div>
      </div>
    </>
  );
}

export default Footer;
