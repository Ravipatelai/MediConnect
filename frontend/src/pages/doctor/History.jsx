import React, { useEffect, useState } from 'react';

function History() {
  const [history, setHistory] = useState([]);

  useEffect(() => {
    const sampleHistory = [
      {
        id: 1,
        doctorName: 'Dr. Anjali Sharma',
        date: '2025-06-01',
        time: '10:00 AM',
        field: 'Dermatology',
        notes: 'Prescribed allergy medicine and follow-up in 2 weeks',
      },
      {
        id: 2,
        doctorName: 'Dr. Rajeev Menon',
        date: '2025-05-18',
        time: '2:30 PM',
        field: 'Cardiology',
        notes: 'Blood pressure under control. No new meds prescribed.',
      },
    ];

    setHistory(sampleHistory);
  }, []);

  return (
    <div className="p-6  mx-auto min-h-screen bg-neutral-900 text-white">
      <h2 className="text-3xl font-bold mb-6 text-center text-blue-500">
        Past Appointment History
      </h2>

      {history.length === 0 ? (
        <p className="text-center text-gray-400">No past appointments found.</p>
      ) : (
        <div className="space-y-4">
          {history.map((item) => (
            <div
              key={item.id}
              className="bg-neutral-800 shadow rounded p-4 border-l-4 border-blue-500"
            >
              <h3 className="text-lg font-semibold text-white">
                {item.doctorName} ({item.field})
              </h3>
              <p className="text-gray-300">
                Date: {item.date} | Time: {item.time}
              </p>
              <p className="text-gray-400 mt-1 italic">
                Notes: {item.notes}
              </p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default History;
