import React from 'react';

function ScoreDisplay({ total }) {
  const getStatus = () => {
    if (total < 6) return 'text-green-600';
    if (total < 10) return 'text-yellow-600';
    return 'text-red-600';
  };

  return (
    <div className="mt-4">
      <p className={`text-xl font-semibold ${getStatus()}`}>
        Total Today: {total.toFixed(2)} kg CO₂e
      </p>
    </div>
  );
}

export default ScoreDisplay;
