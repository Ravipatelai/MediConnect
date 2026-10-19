import React from "react";
import { FaStar, FaUserCircle } from "react-icons/fa";
import FadeIn from "./FadeIn";

const testimonials = [
  {
    name: "Dr. Aditi Sharma",
    role: "Cardiologist",
    rating: 5,
    content: "This platform has made consultations so easy. It’s incredibly reliable!",
    avatar: "",
  },

  
  {
    name: "Rohan Mehta",
    role: "Patient",
    rating: 4,
    content: "Booking appointments was seamless. Highly recommend!",
    avatar: "",
  },
  {
    name: "Dr. Prakash Iyer",
    role: "Orthopedic Surgeon",
    rating: 5,
    content: "I love the dashboard and how easy it is to manage appointments.",
    avatar: "", // No image
  },

  {
    name: "Dr. Rakesh Gupta",
    role: "Eye Surgeon",
    rating: 5,
    content: "I love the dashboard and how easy it is to manage appointments.",
    avatar: "", // No image
  },
];

export default function Testimonials() {
  return (
    <section id="testimonials" className="py-20 scroll-mt-12  dark:bg-neutral-900 bg-gray-50">
      <div className="container mx-auto px-4">
        <FadeIn direction="right" className="text-center space-y-4 mb-14">

          <h2 className="text-2xl dark:text-white md:text-4xl font-bold">What Our Users Say</h2>
          <p className="text-xl text-gray-600 dark:text-gray-400 max-w-[600px] mx-auto">
            Hear from doctors and patients who trust our platform
          </p>
        </FadeIn>

        <div className="grid md:grid-cols-3 gap-8">
          {testimonials.map((testimonial, index) => (
            <FadeIn direction="up" key={index} className="bg-white dark:bg-neutral-800 p-6 mt-10 rounded-xl shadow-md">
              <div className="flex items-center space-x-4 mb-3">
                {testimonial.avatar ? (
                  <img
                    src={testimonial.avatar}
                    alt={testimonial.name}
                    className="w-12 h-12 rounded-full object-cover"
                  />
                ) : (
                  <FaUserCircle className="w-12 h-12 text-gray-400" />
                )}
                <div>
                  <div className="font-semibold dark:text-white">{testimonial.name}</div>
                  <div className="text-sm text-gray-500 dark:text-gray-300">{testimonial.role}</div>
                </div>
              </div>
              <div className="flex space-x-1 mb-2">
                {[...Array(testimonial.rating)].map((_, i) => (
                  <FaStar key={i} className="text-yellow-400" />
                ))}
              </div>
              <p className="text-gray-600 dark:text-gray-400">"{testimonial.content}"</p>
            </FadeIn>
          ))}
        </div>
      </div>
    </section>
  );
}
