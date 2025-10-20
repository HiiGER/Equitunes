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
      const response = await signUp(email, password, {
        business_name: businessName,
        address,
        phone: phone || undefined,
      });
      // Show success message
      setError(response.message);
    } catch (err: any) {
      console.error('Registration error:', err);
      setError(err.message || 'Failed to create account');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#0B1120] via-[#1E293B] to-[#0B1120] flex items-center justify-center px-6 py-12">
      <div className="w-full max-w-md">
        <Link to="/" className="block mb-8">
          <img src="/src/assets/equitunes-logo.svg" alt="Equitunes" className="h-32 sm:h-40 w-auto mx-auto" />
        </Link>

        <div className="bg-[#1E293B]/80 backdrop-blur-sm rounded-2xl p-8 border border-[#1E3A8A]/30">
          <h2 className="text-3xl font-bold text-[#E2E8F0] mb-2">Buat Akun</h2>
          <p className="text-[#94A3B8] mb-8">Mulai perjalanan musik Anda hari ini</p>

          {error && (
            <div className="mb-6 p-4 bg-red-500/10 border border-red-500/30 rounded-lg text-red-400 text-sm">
              {error === 'Failed to create account' ? 'Gagal membuat akun' : error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="block text-[#E2E8F0] mb-2 font-medium">Nama Bisnis</label>
              <input
                type="text"
                value={businessName}
                onChange={(e) => setBusinessName(e.target.value)}
                className="w-full px-4 py-3 bg-[#0B1120] border border-[#1E3A8A] rounded-lg text-[#E2E8F0] focus:outline-none focus:border-[#3B82F6] focus:ring-2 focus:ring-[#3B82F6]/20 transition-all"
                placeholder="Kopi Saya"
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
                minLength={6}
              />
            </div>

            <div>
              <label className="block text-[#E2E8F0] mb-2 font-medium">Alamat</label>
              <input
                type="text"
                value={address}
                onChange={(e) => setAddress(e.target.value)}
                className="w-full px-4 py-3 bg-[#0B1120] border border-[#1E3A8A] rounded-lg text-[#E2E8F0] focus:outline-none focus:border-[#3B82F6] focus:ring-2 focus:ring-[#3B82F6]/20 transition-all"
                placeholder="Jalan Utama 123, Kota"
                required
              />
            </div>

            <div>
              <label className="block text-[#E2E8F0] mb-2 font-medium">Telepon (Opsional)</label>
              <input
                type="tel"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                className="w-full px-4 py-3 bg-[#0B1120] border border-[#1E3A8A] rounded-lg text-[#E2E8F0] focus:outline-none focus:border-[#3B82F6] focus:ring-2 focus:ring-[#3B82F6]/20 transition-all"
                placeholder="08123456789"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 bg-gradient-to-r from-[#3B82F6] to-[#1E3A8A] text-[#E2E8F0] rounded-lg font-semibold hover:shadow-lg hover:shadow-[#3B82F6]/50 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? 'Membuat Akun...' : 'Buat Akun'}
            </button>
          </form>

          <p className="mt-6 text-center text-[#94A3B8]">
            Sudah punya akun?{' '}
            <Link to="/login" className="text-[#3B82F6] hover:underline font-medium">
              Masuk
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
