import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Briefcase, AlertCircle, Building2 } from 'lucide-react';
import { loginCompany } from '../services/api';

const HRLogin = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const response = await loginCompany(formData);
      localStorage.setItem('hrToken', response.access_token);
      localStorage.removeItem('token'); // Remove user token if exists
      navigate('/hr/dashboard');
    } catch (err) {
      setError(err.response?.data?.detail || 'Invalid email or password');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-4 bg-gradient-to-br from-gray-900 via-black to-gray-900">
      {/* Animated Background */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        {[...Array(20)].map((_, i) => (
          <div
            key={i}
            className="absolute w-1 h-1 bg-red-500 rounded-full animate-pulse"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              animationDelay: `${Math.random() * 5}s`,
              opacity: Math.random() * 0.3 + 0.1
            }}
          />
        ))}
      </div>

      <div className="max-w-md w-full relative z-10">
        <div className="text-center mb-8">
          <div className="flex justify-center mb-6">
            <div className="relative">
              <div className="absolute inset-0 bg-gradient-to-r from-red-500 to-pink-500 blur-2xl opacity-50"></div>
              <Building2 className="h-20 w-20 text-red-400 relative z-10" />
            </div>
          </div>
          <h1 className="text-5xl font-bold mb-2">
            <span className="bg-gradient-to-r from-red-400 via-pink-400 to-red-400 bg-clip-text text-transparent">
              HR Portal
            </span>
          </h1>
          <p className="text-gray-400 mt-3 text-lg">
            Manage applications and find top talent
          </p>
        </div>

        <div className="card glow-effect">
          <form onSubmit={handleSubmit} className="space-y-6">
            {error && (
              <div className="bg-red-900/20 border border-red-500/50 text-red-300 p-4 rounded-xl flex items-center space-x-2">
                <AlertCircle className="h-5 w-5" />
                <span>{error}</span>
              </div>
            )}

            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Company Email
              </label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                required
                className="input-field"
                placeholder="hr@company.com"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Password
              </label>
              <input
                type="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                required
                className="input-field"
                placeholder="Enter your password"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="btn-primary w-full"
            >
              {loading ? 'Signing in...' : 'Sign In to HR Portal'}
            </button>
          </form>

          <div className="mt-6 text-center">
            <p className="text-gray-400">
              Looking for a job?{' '}
              <Link to="/login" className="text-red-400 font-semibold hover:text-red-300 transition-colors">
                Candidate Login
              </Link>
            </p>
          </div>
        </div>

        {/* Default Credentials Info */}
        {/* <div className="mt-6 p-4 bg-gray-900/50 border border-gray-800 rounded-xl">
          <p className="text-gray-400 text-sm text-center">
            <span className="font-semibold text-gray-300">Test Credentials:</span><br />
            Email: hr@techcorp.com<br />
            Password: password123
          </p>
        </div> */}
      </div>
    </div>
  );
};

export default HRLogin;