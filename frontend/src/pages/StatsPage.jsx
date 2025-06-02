import { useEffect, useRef, useState } from 'react';
import {
  LineChart,
  Line,
  CartesianGrid,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
} from 'recharts';
import Layout from '../components/Layout';



function StatsPage() {

  const [data, setData] = useState([]);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const response = await fetch('http://localhost:3000/track/stats', {
          credentials: 'include'
        });
        const json = await response.json();
        if (response.ok) setData(json);
      } catch (err) {
        console.error('Failed to fetch stats:', err);
      }
    };
    fetchStats();
  }, []);
  return (

    <Layout>
    <div className="p-6 max-w-md mx-auto">
      <h2 className="font-bubbles text-4xl text-green-700 mb-6">Your Usage Stats</h2>
      <div className="h-[25vh]" />
      <p className="text-sm mb-2 text-green-100">View your carbon footprint over time.</p>
      
      <div className="card bg-white relative mt-6 h-100">
        {data.length > 0 ? (
    <ResponsiveContainer width="100%" >
      <LineChart data={data} margin={{ top: 10, right: 10, left: 0, bottom: 20 }}>
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="hour" label={{ value: 'Hour (UTC)', position: 'insideBottomRight', offset: -5 }} />

        <YAxis label={{ value: 'kg CO₂e', angle: -90, position: 'insideLeft' }} />
        <Tooltip />
        <Line type="monotone" dataKey="value" stroke="#3b82f6" strokeWidth={2} dot={{ r: 4 }} />
      </LineChart>
    </ResponsiveContainer>
  ) : (
    <p>No data yet.</p>
  )}
        <div className="mt-4 hidden">
          <button className="mx-1 px-3 py-1 bg-blue-500 text-white rounded">Daily</button>
          <button className="mx-1 px-3 py-1 bg-blue-500 text-white rounded">Weekly</button>
          <button className="mx-1 px-3 py-1 bg-blue-500 text-white rounded">Monthly</button>
          <button className="mx-1 px-3 py-1 bg-blue-500 text-white rounded">YTD</button>
        </div>
      </div>
    </div>
    </Layout>
  );
}

export default StatsPage;