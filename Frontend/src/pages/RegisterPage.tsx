import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Music2 } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';

export default function RegisterPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [businessName, setBusinessName] = useState('');
  const [address, setAddress] = useState('');
  const [phone, setPhone] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { signUp } = useAuth();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      await signUp(email, password, {
        business_name: businessName,
        address,
        phone: phone || undefined,
      });
      navigate('/dashboard');
    } catch (err: any) {
      setError(err.message || 'Failed to create account');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#0B1120] via-[#1E293B] to-[#0B1120] flex items-center justify-center px-6 py-12">
      <div className="w-full max-w-md">
        <Link to="/" className="flex items-center justify-center gap-2 mb-8">
          <Music2 className="w-10 h-10 text-[#3B82F6]" />
          <span className="text-3xl font-bold text-[#E2E8F0]">Equitunes</span>
        </Link>

        <div className="bg-[#1E293B]/80 backdrop-blur-sm rounded-2xl p-8 border border-[#1E3A8A]/30">
          <h2 className="text-3xl font-bold text-[#E2E8F0] mb-2">Create Account</h2>
          <p className="text-[#94A3B8] mb-8">Start your music journey today</p>

          {error && (
            <div className="mb-6 p-4 bg-red-500/10 border border-red-500/30 rounded-lg text-red-400 text-sm">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="block text-[#E2E8F0] mb-2 font-medium">Business Name</label>
              <input
                type="text"
                value={businessName}
                onChange={(e) => setBusinessName(e.target.value)}
                className="w-full px-4 py-3 bg-[#0B1120] border border-[#1E3A8A] rounded-lg text-[#E2E8F0] focus:outline-none focus:border-[#3B82F6] focus:ring-2 focus:ring-[#3B82F6]/20 transition-all"
                placeholder="My Coffee Shop"
                required
              />
            </div>

            <div>
              <label className="block text-[#E2E8F0] mb-2 font-medium">Email</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-4 py-3 bg-[#0B1120] border border-[#1E3A8A] rounded-lg text-[#E2E8F0] focus:outline-none focus:border-[#3B82F6] focus:ring-2 focus:ring-[#3B82F6]/20 transition-all"
                placeholder="your@business.com"
                required
              />
            </div>

            <div>
              <label className="block text-[#E2E8F0] mb-2 font-medium">Password</label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-4 py-3 bg-[#0B1120] border border-[#1E3A8A] rounded-lg text-[#E2E8F0] focus:outline-none focus:border-[#3B82F6] focus:ring-2 focus:ring-[#3B82F6]/20 transition-all"
                placeholder="••••••••"
                required
                minLength={6}
              />
            </div>

            <div>
              <label className="block text-[#E2E8F0] mb-2 font-medium">Address</label>
              <input
                type="text"
                value={address}
                onChange={(e) => setAddress(e.target.value)}
                className="w-full px-4 py-3 bg-[#0B1120] border border-[#1E3A8A] rounded-lg text-[#E2E8F0] focus:outline-none focus:border-[#3B82F6] focus:ring-2 focus:ring-[#3B82F6]/20 transition-all"
                placeholder="123 Main St, City"
                required
              />
            </div>

            <div>
              <label className="block text-[#E2E8F0] mb-2 font-medium">Phone (Optional)</label>
              <input
                type="tel"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                className="w-full px-4 py-3 bg-[#0B1120] border border-[#1E3A8A] rounded-lg text-[#E2E8F0] focus:outline-none focus:border-[#3B82F6] focus:ring-2 focus:ring-[#3B82F6]/20 transition-all"
                placeholder="+1234567890"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 bg-gradient-to-r from-[#3B82F6] to-[#1E3A8A] text-[#E2E8F0] rounded-lg font-semibold hover:shadow-lg hover:shadow-[#3B82F6]/50 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? 'Creating Account...' : 'Create Account'}
            </button>
          </form>

          <p className="mt-6 text-center text-[#94A3B8]">
            Already have an account?{' '}
            <Link to="/login" className="text-[#3B82F6] hover:underline font-medium">
              Sign in
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
