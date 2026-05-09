import React, { useState } from 'react';

const Availability = () => {
  const [selectedDate, setSelectedDate] = useState('');
  const [selectedSlots, setSelectedSlots] = useState([]);

  const timeSlots = [
    '09:00 AM', '10:00 AM', '11:00 AM', '12:00 PM',
    '02:00 PM', '03:00 PM', '04:00 PM', '05:00 PM',
  ];

  const toggleSlot = (slot) => {
    setSelectedSlots((prev) =>
      prev.includes(slot) ? prev.filter((s) => s !== slot) : [...prev, slot]
    );
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!selectedDate || selectedSlots.length === 0) {
      alert('Please select a date and at least one time slot.');
      return;
    }
    // TODO: Submit availability to backend
    alert(`Availability saved for ${selectedDate}:\n${selectedSlots.join(', ')}`);
  };

  return (
    <div className=" mx-auto p-6 mt-10 bg-neutral-900 text-white shadow rounded">
      <h2 className="text-3xl font-bold mb-6 text-center text-blue-400">
        Set Your Availability
      </h2>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Date Picker */}
        <div>
          <label className="block mb-2 font-medium text-gray-300">Select Date</label>
          <input
            type="date"
            className="w-full border border-gray-600 bg-neutral-800 text-white px-4 py-2 rounded"
            value={selectedDate}
            onChange={(e) => setSelectedDate(e.target.value)}
            required
          />
        </div>

        {/* Time Slots */}
        <div>
          <label className="block mb-2 font-medium text-gray-300">Select Time Slots</label>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            {timeSlots.map((slot) => (
              <button
                type="button"
                key={slot}
                onClick={() => toggleSlot(slot)}
                className={`border px-4 py-2 rounded text-center transition font-medium ${
                  selectedSlots.includes(slot)
                    ? 'bg-blue-600 text-white border-blue-600'
                    : 'bg-neutral-800 text-gray-300 border-gray-600 hover:bg-neutral-700'
                }`}
              >
                {slot}
              </button>
            ))}
          </div>
        </div>

        {/* Submit Button */}
        <button
          type="submit"
          className="w-full bg-blue-600 text-white py-2 px-4 rounded hover:bg-blue-700 transition"
        >
          Save Availability
        </button>
      </form>
    </div>
  );
};

export default Availability;
