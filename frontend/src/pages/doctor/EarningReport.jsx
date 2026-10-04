import React, { useEffect, useState } from 'react';
import API from '../../utils/api';
import Loader from '../../components/Loader/Loader';
import toast from 'react-hot-toast';
import { useNavigate } from 'react-router-dom';

const EarningReport = () => {
  const [earnings, setEarnings] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchEarnings = async () => {
      try {
        const res = await API.get('/doctor/earnings-report', {   // ✅ Updated route
          withCredentials: true,
        });
        setEarnings(res.data);
      } catch (err) {
        console.error('Failed to fetch earnings:', err);
        toast.error('Failed to load earnings');
      } finally {
        setLoading(false);
      }
    };

    fetchEarnings();
  }, []);

  if (loading) return <Loader />;

  if (!earnings || earnings.consultations.length === 0)
    return <p className="text-center text-white">No earnings found.</p>;

  return (
    <div className="max-w-4xl mx-auto mt-10 p-6 bg-neutral-800 border border-neutral-700 rounded shadow">
      
      <button
        onClick={() => navigate('/doctor/dashboard')}
        className="mb-4 text-blue-400 hover:text-blue-500 transition"
      >
        ← Back
      </button>

      <h2 className="text-3xl font-bold mb-4 text-white text-center">Earning Report</h2>

      {/* Total Earnings */}
      <div className="bg-blue-900/20 text-blue-400 p-4 rounded mb-6 text-center">
        <h3 className="text-xl font-semibold">
          Total Earnings – {earnings.month}
        </h3>
        <p className="text-3xl font-bold mt-2">
          ₹{earnings.total.toLocaleString()}
        </p>
      </div>

      {/* Consultations Table */}
      <div className="overflow-x-auto">
        <table className="min-w-full text-left border-collapse">
          <thead className="bg-neutral-700 text-gray-300">
            <tr>
              <th className="px-4 py-2 border border-neutral-600">#</th>
              <th className="px-4 py-2 border border-neutral-600">Patient</th>
              <th className="px-4 py-2 border border-neutral-600">Date</th>
              <th className="px-4 py-2 border border-neutral-600">Amount</th>
            </tr>
          </thead>

          <tbody>
            {earnings.consultations.map((item, index) => (
              <tr
                key={item._id || index}
                className="hover:bg-neutral-700 text-white transition"
              >
                <td className="px-4 py-2 border border-neutral-700">
                  {index + 1}
                </td>

                <td className="px-4 py-2 border border-neutral-700">
                  {item.patient}
                </td>

                <td className="px-4 py-2 border border-neutral-700">
                  {new Date(item.date).toLocaleDateString()}
                </td>

                <td className="px-4 py-2 border border-neutral-700">
                  ₹{item.amount}
                </td>
              </tr>
            ))}
          </tbody>

        </table>
      </div>
    </div>
  );
};

export default EarningReport;
