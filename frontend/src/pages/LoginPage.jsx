import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { Lock, User, LogIn, AlertCircle } from 'lucide-react';
import { Card } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { toast } from '../hooks/use-toast';

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;
const API = `${BACKEND_URL}/api`;

const LoginPage = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const response = await fetch(`${API}/auth/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ username, password })
      });

      const data = await response.json();

      if (data.success && data.token) {
        // Store token
        localStorage.setItem('admin_token', data.token);
        localStorage.setItem('admin_username', username);
        
        toast({
          title: "Login Successful",
          description: `Welcome back, ${username}!`,
        });

        // Navigate to admin panel
        navigate('/admin-analytics-dashboard');
      } else {
        setError(data.message || 'Invalid credentials');
        toast({
          title: "Login Failed",
          description: data.message || 'Invalid credentials',
          variant: "destructive"
        });
      }
    } catch (error) {
      console.error('Login error:', error);
      setError('Login failed. Please try again.');
      toast({
        title: "Error",
        description: "Login failed. Please check your connection.",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#0a0e27] flex items-center justify-center px-4 py-8">
      {/* Animated background */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute inset-0" style={{
          backgroundImage: `
            radial-gradient(circle at 20% 50%, rgba(0, 212, 255, 0.05) 0%, transparent 50%),
            radial-gradient(circle at 80% 80%, rgba(16, 185, 129, 0.05) 0%, transparent 50%)
          `
        }} />
      </div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="relative z-10 w-full max-w-md"
      >
        <Card className="bg-[#1a1f3a]/80 backdrop-blur-lg border-[#2a3150] p-8">
          {/* Logo/Title */}
          <div className="text-center mb-8">
            <motion.div
              initial={{ scale: 0.8 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.2, type: 'spring' }}
              className="inline-block mb-4"
            >
              <div className="w-20 h-20 bg-[#00d4ff]/10 rounded-full flex items-center justify-center border-2 border-[#00d4ff]/30 mx-auto">
                <Lock className="text-[#00d4ff]" size={36} />
              </div>
            </motion.div>
            <h1 className="text-3xl font-bold text-[#e5e7eb] mb-2">Admin Login</h1>
            <p className="text-[#9ca3af] text-sm">Enter your credentials to access the admin panel</p>
          </div>

          {/* Default credentials notice */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4 }}
            className="mb-6 p-4 bg-[#00d4ff]/10 border border-[#00d4ff]/30 rounded-lg"
          >
            <p className="text-[#00d4ff] text-sm flex items-start gap-2">
              <AlertCircle size={16} className="mt-0.5 flex-shrink-0" />
              <span>
                <strong>Default Credentials:</strong><br />
                Username: <code className="bg-[#0a0e27] px-2 py-0.5 rounded">admin</code><br />
                Password: <code className="bg-[#0a0e27] px-2 py-0.5 rounded">password</code>
              </span>
            </p>
          </motion.div>

          {/* Login Form */}
          <form onSubmit={handleLogin} className="space-y-6">
            {/* Error Message */}
            {error && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className="p-3 bg-[#ef4444]/10 border border-[#ef4444]/30 rounded-lg text-[#ef4444] text-sm"
              >
                {error}
              </motion.div>
            )}

            {/* Username */}
            <div>
              <label className="block text-sm font-medium text-[#9ca3af] mb-2">
                <User size={16} className="inline mr-2" />
                Username
              </label>
              <Input
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                required
                placeholder="Enter username"
                className="bg-[#0a0e27]/50 border-[#2a3150] text-[#e5e7eb] focus:border-[#00d4ff] transition-colors"
                disabled={loading}
              />
            </div>

            {/* Password */}
            <div>
              <label className="block text-sm font-medium text-[#9ca3af] mb-2">
                <Lock size={16} className="inline mr-2" />
                Password
              </label>
              <Input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                placeholder="Enter password"
                className="bg-[#0a0e27]/50 border-[#2a3150] text-[#e5e7eb] focus:border-[#00d4ff] transition-colors"
                disabled={loading}
              />
            </div>

            {/* Submit Button */}
            <Button
              type="submit"
              disabled={loading}
              className="w-full bg-[#00d4ff] hover:bg-[#0ea5e9] text-[#0a0e27] font-semibold transition-all"
            >
              {loading ? (
                <>
                  <span className="animate-spin mr-2">⟳</span>
                  Logging in...
                </>
              ) : (
                <>
                  <LogIn size={18} className="mr-2" />
                  Login
                </>
              )}
            </Button>
          </form>

          {/* Footer */}
          <div className="mt-6 text-center">
            <button
              onClick={() => navigate('/')}
              className="text-sm text-[#9ca3af] hover:text-[#00d4ff] transition-colors"
            >
              ← Back to Portfolio
            </button>
          </div>
        </Card>

        {/* Security Note */}
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.6 }}
          className="text-center text-xs text-[#6b7280] mt-4"
        >
          Please change the default password after first login
        </motion.p>
      </motion.div>
    </div>
  );
};

export default LoginPage;
