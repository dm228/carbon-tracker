import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import axiosClient from '../utils/axiosClient';

export default function LoginPage() {
  const [isRegistering, setIsRegistering] = useState(false);
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    const endpoint = isRegistering ? '/auth/register' : '/auth/login';

    try {
      await axiosClient.post(endpoint, { username, password });
      navigate('/');
    } catch (err) {
      const msg = err.response?.data?.error || 'Something went wrong';
      setError(msg);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary to-secondary flex items-center justify-center px-4 animate-gradient">
      <div className="w-full max-w-4xl flex flex-col md:flex-row items-center justify-center gap-8">
        
        {/* Welcome Message for Desktop */}
        <div className="hidden md:block md:w-1/2 text-white">
          <h2 className="text-3xl font-bold">Track your impact 🌿</h2>
          <p className="mt-2 text-lg">
            Make greener choices, level up, and earn badges for helping the planet.
          </p>
        </div>

        {/* Login/Register Card */}
        <motion.div
          key={isRegistering ? 'register' : 'login'}
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.3 }}
          className="bg-card w-full max-w-sm p-6 rounded-xl shadow-lg"
        >
          <div className="flex flex-col items-center mb-6">
            <div className="w-12 h-12 bg-primary rounded-full flex items-center justify-center text-white font-bold text-lg animate-bounce">
              ♻️
            </div>
            <h2 className="text-xl font-bold text-primary mt-2">
              {isRegistering ? 'Create Account' : 'Welcome Back'}
            </h2>
            <p className="text-sm text-gray-500">
              {isRegistering ? 'Join our green movement' : 'Log in to continue'}
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <input
              type="text"
              placeholder="Username"
              className="w-full p-2 border border-gray-300 rounded"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
            />
            <input
              type="password"
              placeholder="Password"
              className="w-full p-2 border border-gray-300 rounded"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
            <button
              type="submit"
              className="w-full bg-primary text-white font-semibold py-2 rounded hover:bg-green-600 transition"
            >
              {isRegistering ? 'Register' : 'Login'}
            </button>
          </form>

          <div className="mt-4 text-center text-sm">
            {isRegistering ? 'Already have an account?' : "Don't have an account?"}{' '}
            <button
              className="text-primary underline font-medium"
              onClick={() => setIsRegistering(!isRegistering)}
            >
              {isRegistering ? 'Login' : 'Register'}
            </button>
          </div>

          {error && (
            <p className="mt-4 text-center text-red-600 text-sm">{error}</p>
          )}
        </motion.div>
      </div>
    </div>
  );
}
