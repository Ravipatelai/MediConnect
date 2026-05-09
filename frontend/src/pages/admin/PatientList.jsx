import React, { useState, useEffect } from "react";
import API from "../../utils/api";
import Loader from "../../components/Loader/Loader";

function PatientList() {
  const [patients, setPatients] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
  const fetchPatients = async () => {
    try {
      const response = await API.get("/admin/patients");

      console.log("Patients:", response.data);

      setPatients(response.data.patients); // ✅ FIX HERE
    } catch (error) {
      console.error("Error fetching patients:", error);
    } finally {
      setLoading(false);
    }
  };

  fetchPatients();
}, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader size="lg" color="blue" />
      </div>
    );
  }

  return (
    <div className="p-6 max-w-5xl mx-auto  min-h-screen">
      <h2 className="text-3xl font-bold text-center text-blue-400 mb-6">
        Registered Patients
      </h2>

      {patients.length === 0 ? (
        <p className="text-center text-gray-400">No patients found.</p>
      ) : (
        <div className="overflow-x-auto">
          <table className="min-w-full bg-neutral-800 rounded-lg shadow-md">
            <thead className="bg-neutral-700 text-gray-300">
              <tr>
                <th className="py-3 px-4 text-left">ID</th>
                <th className="py-3 px-4 text-left">Name</th>
                <th className="py-3 px-4 text-left">Email</th>
                <th className="py-3 px-4 text-left">Age</th>
                <th className="py-3 px-4 text-left">Gender</th>
              </tr>
            </thead>
            <tbody>
              {patients.map((patient, index) => (
                <tr
                  key={patient._id}
                  className="border-b border-neutral-700 hover:bg-neutral-700 transition"
                >
                  <td className="py-2 px-4 text-gray-200">{index + 1}</td>
                  <td className="py-2 px-4 text-gray-200">{patient.name}</td>
                  <td className="py-2 px-4 text-gray-300">{patient.email}</td>
                  <td className="py-2 px-4 text-gray-200">
                    {patient.age || "No data"}{" "}
                  </td>
                  <td className="py-2 px-4 text-gray-200">
                    {patient.gender || "No data"}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

export default PatientList;
