import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Music2 } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { signIn } = useAuth();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      console.log('Starting login process...');
      const response = await signIn(email, password);
      console.log('Login successful:', response);
      
      // Add small delay to ensure profile is loaded
      await new Promise(resolve => setTimeout(resolve, 500));
      
      navigate('/dashboard');
    } catch (err: any) {
      console.error('Login error:', err);
      setError(err.message || 'Gagal masuk. Silakan coba beberapa saat lagi.');
      
      // Reset loading after a minimum time to prevent flickering
      await new Promise(resolve => setTimeout(resolve, 1000));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#0B1120] via-[#1E293B] to-[#0B1120] flex items-center justify-center px-6">
      <div className="w-full max-w-md">
        <Link to="/" className="block mb-8">
          <img src="/src/assets/equitunes-logo.svg" alt="Equitunes" className="h-32 sm:h-40 w-auto mx-auto" />
        </Link>

        <div className="bg-[#1E293B]/80 backdrop-blur-sm rounded-2xl p-8 border border-[#1E3A8A]/30">
          <h2 className="text-3xl font-bold text-[#E2E8F0] mb-2">Selamat Datang Kembali</h2>
          <p className="text-[#94A3B8] mb-8">Masuk ke akun bisnis Anda</p>

          {error && (
            <div className="mb-6 p-4 bg-red-500/10 border border-red-500/30 rounded-lg text-red-400 text-sm">
              {error === 'Failed to sign in' ? 'Gagal masuk' : error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="block text-[#E2E8F0] mb-2 font-medium">Email</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-4 py-3 bg-[#0B1120] border border-[#1E3A8A] rounded-lg text-[#E2E8F0] focus:outline-none focus:border-[#3B82F6] focus:ring-2 focus:ring-[#3B82F6]/20 transition-all"
                placeholder="anda@bisnis.com"
                required
              />
            </div>

            <div>
              <label className="block text-[#E2E8F0] mb-2 font-medium">Kata Sandi</label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-4 py-3 bg-[#0B1120] border border-[#1E3A8A] rounded-lg text-[#E2E8F0] focus:outline-none focus:border-[#3B82F6] focus:ring-2 focus:ring-[#3B82F6]/20 transition-all"
                placeholder="••••••••"
                required
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 bg-gradient-to-r from-[#3B82F6] to-[#1E3A8A] text-[#E2E8F0] rounded-lg font-semibold hover:shadow-lg hover:shadow-[#3B82F6]/50 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? 'Sedang Masuk...' : 'Masuk'}
            </button>
          </form>

          <p className="mt-6 text-center text-[#94A3B8]">
            Belum punya akun?{' '}
            <Link to="/register" className="text-[#3B82F6] hover:underline font-medium">
              Daftar di sini
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
