import { useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axiosClient from '../utils/axiosClient';
import Layout from '../components/Layout';
import ActivityCard from '../components/ActivityCard';
import { sendActivity } from '../api/track';

export default function HomePage() {
  const inputRef = useRef(null);
  const [input, setInput] = useState('');
  const [activityData, setActivityData] = useState(null);

  const [activity, setActivity] = useState('');
  const [estimation, setEstimation] = useState(null);
  const [error, setError] = useState('');
  
  const navigate = useNavigate();

  const handleSubmit = async () => {
  if (!activity.trim()) return;
  try {
    const data = await sendActivity(activity);
    console.log(data);
    setEstimation(data);
    setError('');
  } catch (err) {
    setError('Could not track activity.');
  }
};

const handleKeyDown = (e) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      handleSubmit();
    }
  };

  const handleLookup = async () => {
    if (!input.trim()) return;
    try {
      const res = await axiosClient.post('/track', {
        activity: input.trim(),
        quantity: 1
      });
      setActivityData(res.data);
    } catch (err) {
      console.error(err);
      setActivityData(null);
    }
  };

  

  useEffect(() => {
    inputRef.current?.focus();
  }, []);

  return (
    <Layout>
      
 <div className="p-6 max-w-md mx-auto"> 
      <h1 className="font-bubbles text-4xl text-green-700 mb-6">Carbon Tracker</h1>

      <div className="h-[25vh]" />
      <div className="max-w-md mx-auto  p-6 rounded-xl ">
        <label htmlFor="activity" className="block mb-2 font-bold text-2xl text-green-100">
          Track your activity
        </label>
        <div className='relative'>
        <input
          id="activity"
          ref={inputRef}
          type="text"
          placeholder="e.g., drove car for 10 mins"
          className="w-full p-3 bg-white border border-gray-300 rounded-md shadow-md relative z-10 text-sm focus:outline-none focus:ring-2 focus:ring-[--color-primary]"
          value={activity}
          onChange={(e) => setActivity(e.target.value)}
          onKeyDown={handleKeyDown}
        />
        <button
          onClick={handleSubmit}
          className="absolute top-0 end-0 z-20 p-2.5 h-full 2 text-green-700 hover:text-green-900"
          aria-label="Submit activity"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-6 w-6"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 12h14M12 5l7 7-7 7" />
          </svg>
        </button>
        </div>
      </div>
      {error && <p className="text-red-500 mt-3">{error}</p>}

      {estimation && (
        <div
          key={estimation.activity + estimation.co2e_kg} // re-animates when activity changes
          className="mt-6 animate-fade-in-slide-up transition-all duration-500 ease-out"
        >
        <ActivityCard
          activity={{
            Activity: estimation.activity,
            Category: estimation.category || '',
            CO2e_kg: estimation.co2e_kg,
            Impact: estimation.impact,
            Source: estimation.source,
            xpAwarded: estimation.xpGained,
            quantity: 1
          }}
         
        />
        </div>
      )}
      </div>
    </Layout>
  );
}
