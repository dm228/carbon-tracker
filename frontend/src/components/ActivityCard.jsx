import { useState } from 'react';
export default function ActivityCard({ activity }) {
  const {
    Activity,
    Category,
    CO2e_kg,
    Impact,
    Source,
    xpAwarded,
    quantity
  } = activity;

  const colorMap = {
    green: 'bg-green-500',
    amber: 'bg-yellow-400',
    red: 'bg-red-500'
  };
const [added, setAdded] = useState(false);

const handleAdd = async () => {
    // You can call your backend again to log the activity officially, or use a dedicated endpoint
    //alert('Activity added!');
    
    try {
    const response = await fetch('http://localhost:3000/track/commit', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      credentials: 'include',
      body: JSON.stringify({
            activity: Activity,
            category: Category || '',
            co2e_kg: CO2e_kg,
            impact: Impact,
            source: Source,
            xpAwarded: xpAwarded,
            quantity: quantity
      })
    });

    const text = await response.text();
    const result = text ? JSON.parse(text) : {};

    if (response.ok) {
        setAdded(true);
      } else {
        console.error(`Failed to add: ${result.error || 'Unknown error'}`);
      }
    } catch (err) {
      console.error('Error adding activity:', err);
    }
  };
  return (
    <div className="card bg-white relative mt-6">
      {/* Impact dot */}
      <div className={`absolute top-2 right-2 w-4 h-4 rounded-full ${colorMap[Impact] || 'bg-gray-300'}`} />

      <h3 className="text-lg font-bold mb-2">{Activity}</h3>

      <div className="flex justify-between items-center text-sm mb-1">
        <span className="text-gray-500">Quantity</span>
        <span>{quantity}</span>
      </div>

      <div className="border-t my-2" />

        <div className="flex justify-between items-center text-sm mb-1">
        <span className="text-gray-500">Category</span>
        <span>{Category}</span>
        </div>


      <div className="flex justify-between items-center text-sm mb-1">
        <span className="text-gray-500">CO₂e</span>
        <span>{CO2e_kg} kg</span>
      </div>

      <div className="flex justify-between items-center text-sm mb-1">
        <span className="text-gray-500">XP</span>
        <span>{xpAwarded} points</span>
      </div>

      <div className="text-xs text-gray-400 mt-2">Source: {Source || '—'}</div>

      <div className="flex justify-end mt-4">
        <button
            onClick={handleAdd}
            disabled={added}
            className={`mt-2 px-4 py-1 rounded transition-all duration-200 ease-in-out 
                ${added ? 'bg-gray-400 cursor-not-allowed' : 'bg-emerald-600 hover:bg-emerald-500 hover:scale-105 hover:shadow-lg'} 
                text-white`}
            >
            {added ? 'Added' : 'Add'}
        </button>
                    
        
      </div>
    </div>
  );
}
