import { useNavigate } from 'react-router-dom';
import axiosClient from '../utils/axiosClient';
import HillsBackground from './HillsBackground';
import {HomeIcon,CalendarDaysIcon, UserIcon}  from '@heroicons/react/24/solid';

export default function Layout({ children }) {
  const navigate = useNavigate();

  

  return (
    <div className="relative min-h-screen bg-white font-[--font-sans] text-[--color-text] overflow-x-hidden overflow-y-auto">
      {/* Hills background at bottom */}
      <HillsBackground />

      {/* Foreground content */}
      <div className="relative z-10">
       

        <main className="p-4 max-w-xl mx-auto">
          {children}
        </main>

      </div>

      <nav className="absolute bottom-0 w-full mx-auto">
         <div className="p-4 flex justify-between items-center">
        
           
        <button onClick={() => navigate('/stats')}>
          <span className="text-2xl"><CalendarDaysIcon className="size-6 text-green-200" /></span>
        </button>
        <button onClick={() => navigate('/')}>
          <span className="text-2xl"><HomeIcon className="size-6 text-green-200" /></span>
        </button>
        <button onClick={() => navigate('/profile')}>
          <span className="text-2xl"><UserIcon className="size-6 text-green-200" /></span>
        </button>
      
         
        </div>
</nav>
    </div>
  );
}
