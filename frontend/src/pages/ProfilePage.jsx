import { useEffect, useState } from 'react';
import Layout from '../components/Layout';
import BadgeGrid from '../components/BadgeGrid';
import axiosClient from '../utils/axiosClient';
import { useNavigate } from 'react-router-dom';
export default function ProfilePage() {
  const [profile, setProfile] = useState(null);
const navigate = useNavigate();
  useEffect(() => {
    const fetchProfile = async () => {
      const res = await fetch('http://localhost:3000/auth/profile', { credentials: 'include' });
      const data = await res.json();
      if (res.ok) setProfile(data);
    };
    fetchProfile();
  }, []);

  if (!profile) return <p className="p-4">Loading...</p>;

  const { username, level, xp, xpNeeded, badges } = profile;
  const progress = Math.min((xp / xpNeeded) * 100, 100);


  const handleLogout = async () => {
    axiosClient.post('/auth/logout').then(() => navigate('/login'));
  };


  return (
    <Layout>
    <div className="p-6 max-w-md mx-auto">
      <h2 className="font-bubbles text-4xl text-green-700 mb-6">Welcome, {username}!</h2>
<div className="h-[10vh]" />
      <div className="card bg-white relative mt-6">
      <p className="text-gray-600 mb-2">Level: {level}</p>

      <div className="w-full bg-gray-200 rounded-full h-4 mb-4">
        <div
          className="bg-green-500 h-4 rounded-full transition-all"
          style={{ width: `${progress}%` }}
        />
      </div>
      <p className="text-sm text-gray-500 mb-6">{xp} XP / {xpNeeded} XP</p>
</div>
      
      <div className="flex flex-wrap gap-2 card bg-white relative mt-6">
        <h2 className="text-lg font-semibold mt-2">Your Badges</h2>
        <BadgeGrid earned={profile.badges} />
      </div>

 <button
            onClick={handleLogout}
           
            className={`mt-6 w-full px-4 py-1 rounded transition-all duration-200 ease-in-out  bg-emerald-500 hover:bg-emerald-700 hover:scale-105 hover:shadow-lg'
                text-white`}
            >
            LOGOUT
        </button>

    </div>
    </Layout>
  );
}
