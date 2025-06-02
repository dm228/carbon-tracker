import React, { useState } from 'react';

function TrackerForm({ onAdd }) {
  const [activity, setActivity] = useState('');
  const [quantity, setQuantity] = useState(1);

  const sampleDatabase = {
    'Drive 10 miles': 4.1,
    'Eat 100g beef': 5.5,
    'Eat 100g chicken': 1.5,
    'Buy a T-shirt': 6.0,
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const co2 = sampleDatabase[activity] || 2.0; // fallback value
    onAdd({ activity, quantity, totalCO2e: co2 * quantity });
    setActivity('');
    setQuantity(1);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <input
        type="text"
        className="border p-2 w-full"
        placeholder="Activity (e.g., Drive 10 miles)"
        value={activity}
        onChange={(e) => setActivity(e.target.value)}
        required
      />
      <input
        type="number"
        className="border p-2 w-full"
        placeholder="Quantity"
        value={quantity}
        onChange={(e) => setQuantity(Number(e.target.value))}
        min="1"
        required
      />
      <button
        type="submit"
        className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
      >
        Add Activity
      </button>
    </form>
  );
}

export default TrackerForm;