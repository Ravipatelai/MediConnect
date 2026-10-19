import React, { useState } from "react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";

export default function Pricing() {
  const [billingCycle, setBillingCycle] = useState("monthly");
  const navigate = useNavigate();

  const plans = [
    {
      name: "Basic",
      price: {
        monthly: "Free",
        yearly: "Free",
      },
      description: "Perfect for individuals getting started.",
      features: ["Book appointments", "Video consultation", "Health records"],
      comingSoon: false,
    },
    {
      name: "Pro",
      price: {
        monthly: "$19/mo",
        yearly: "$190/yr",
      },
      description: "Ideal for professionals needing more control.",
      features: ["Advanced analytics", "Priority support", "Revenue tracking"],
      comingSoon: true,
    },
    {
      name: "Enterprise",
      price: {
        monthly: "Custom",
        yearly: "Custom",
      },
      description: "Best for hospitals and large clinics.",
      features: ["Dedicated account manager", "Custom integrations"],
      comingSoon: true,
    },
  ];

  return (
    <section
      id="pricing"
      className="py-20 mt-20 scroll-mt-12 bg-gray-50 dark:bg-neutral-900"
    >
      <div className="container -mt-9 mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="md:text-4xl text-2xl font-bold dark:text-white">Pricing Plans</h2>
          <p className="text-gray-600 dark:text-gray-400 mt-4 text-lg max-w-xl mx-auto">
            Choose a plan that fits your needs.
          </p>
          {/* Toggle */}
          <div className="inline-flex items-center gap-2 mt-4">
            <span className="text-sm font-medium dark:text-white">Monthly</span>
            <button
              onClick={() =>
                setBillingCycle((prev) =>
                  prev === "monthly" ? "yearly" : "monthly"
                )
              }
              className="relative inline-flex h-6 w-12 items-center rounded-full bg-gray-300 dark:bg-gray-700 transition"
            >
              <span
                className={`inline-block h-5 w-5 transform rounded-full bg-white transition ${
                  billingCycle === "yearly" ? "translate-x-6" : "translate-x-1"
                }`}
              />
            </button>
            <span className="text-sm font-medium dark:text-white">Yearly</span>
          </div>
        </div>

        <div className="flex flex-wrap -mt-5 justify-center gap-8">
          {plans.map((plan, index) => (
            <motion.div
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.2 }}
              viewport={{ once: true }}
              key={index}
              className="w-80 bg-white dark:bg-neutral-800 border border-gray-300 dark:border-neutral-700 rounded-xl shadow-md relative overflow-hidden"
            >
              {plan.comingSoon && (
                <span className="absolute top-0 right-0 bg-yellow-400 text-black text-xs font-bold px-3 py-1 rounded-bl-md">
                  Coming Soon
                </span>
              )}
              <div className="p-6">
                <h3 className="text-2xl font-bold mb-2 dark:text-white">
                  {plan.name}
                </h3>
                <p className="text-xl font-semibold dark:text-white mb-2">
                  {plan.price[billingCycle]}
                </p>
                <p className="text-gray-600 dark:text-gray-300 mb-4">
                  {plan.description}
                </p>
                <ul className="space-y-2 text-gray-700 dark:text-gray-400 text-sm mb-6">
                  {plan.features.map((feature, i) => (
                    <li key={i}>• {feature}</li>
                  ))}
                </ul>
                <button
                  disabled={plan.comingSoon}
                  onClick={() => navigate("/login")}
                  className={`w-full py-2 rounded-md font-semibold ${
                    plan.comingSoon
                      ? "bg-gray-300 dark:bg-gray-700 text-white cursor-not-allowed"
                      : "bg-neutral-700 hover:bg-neutral-800 dark:bg-gray-50 dark:hover:bg-gray-100 dark:text-black text-white"
                  }`}
                >
                  {plan.comingSoon ? "Not Available Yet" : "Get Started"}
                </button>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
