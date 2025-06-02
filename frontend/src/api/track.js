// src/api/track.js
export const sendActivity = async (activity) => {
  const res = await fetch('http://localhost:3000/track/askwatson', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    credentials: 'include', 
    body: JSON.stringify({ activity }),
  });

  if (!res.ok) throw new Error('Failed to track activity');
  return await res.json();
};
