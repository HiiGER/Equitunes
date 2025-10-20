import { Music2, Headphones, Zap } from 'lucide-react';
import { Link } from 'react-router-dom';
import logo from '../assets/equitunes-logo.svg';

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-[#0B1120] via-[#1E293B] to-[#0B1120]">
      <nav className="fixed top-0 w-full z-50 bg-[#0B1120]/80 backdrop-blur-md border-b border-[#1E3A8A]/30">
        <div className="max-w-7xl mx-auto px-6 py-4 flex justify-between items-center">
          <div>
            <img src={logo} alt="Equitunes" className="h-16 sm:h-24" />
          </div>
          <div className="flex gap-4">
            <Link
              to="/login"
              className="px-6 py-2 text-[#E2E8F0] hover:text-[#3B82F6] transition-colors"
            >
              Masuk
            </Link>
            <Link
              to="/register"
              className="px-6 py-2 bg-gradient-to-r from-[#1E3A8A] to-[#3B82F6] text-[#E2E8F0] rounded-lg hover:shadow-lg hover:shadow-[#3B82F6]/50 transition-all"
            >
              Mulai
            </Link>
          </div>
        </div>
      </nav>

      <div className="pt-32 pb-20 px-6">
        <div className="max-w-7xl mx-auto text-center">
          <h1 className="text-6xl md:text-7xl font-bold text-[#E2E8F0] mb-6 leading-tight">
            Musik yang Sesuai dengan<br />
            <span className="bg-gradient-to-r from-[#3B82F6] to-[#1E3A8A] bg-clip-text text-transparent">
              Suasana Bisnis Anda
            </span>
          </h1>
          <p className="text-xl text-[#94A3B8] mb-12 max-w-2xl mx-auto">
            Streaming musik profesional untuk kafe, hotel, dan restoran. Berlangganan genre yang sesuai dengan suasana Anda.
          </p>
          <div className="flex gap-4 justify-center">
            <Link
              to="/register"
              className="px-8 py-4 bg-gradient-to-r from-[#3B82F6] to-[#1E3A8A] text-[#E2E8F0] rounded-lg font-semibold hover:shadow-xl hover:shadow-[#3B82F6]/50 transition-all transform hover:scale-105"
            >
              Jelajahi Genre
            </Link>
            <Link
              to="/login"
              className="px-8 py-4 bg-[#1E293B] text-[#E2E8F0] rounded-lg font-semibold border border-[#1E3A8A] hover:border-[#3B82F6] transition-all"
            >
              Masuk
            </Link>
          </div>
        </div>

        <div className="mt-32 grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
          <div className="bg-[#1E293B]/50 backdrop-blur-sm rounded-2xl p-8 border border-[#1E3A8A]/30 hover:border-[#3B82F6]/50 transition-all">
            <div className="w-14 h-14 bg-gradient-to-br from-[#3B82F6] to-[#1E3A8A] rounded-xl flex items-center justify-center mb-6">
              <Music2 className="w-7 h-7 text-[#E2E8F0]" />
            </div>
            <h3 className="text-2xl font-bold text-[#E2E8F0] mb-4">Langganan Berbasis Genre</h3>
            <p className="text-[#94A3B8]">
              Berlangganan hanya genre yang Anda butuhkan. Dari Jazz hingga Lofi, ciptakan suasana yang sempurna untuk bisnis Anda.
            </p>
          </div>

          <div className="bg-[#1E293B]/50 backdrop-blur-sm rounded-2xl p-8 border border-[#1E3A8A]/30 hover:border-[#3B82F6]/50 transition-all">
            <div className="w-14 h-14 bg-gradient-to-br from-[#3B82F6] to-[#1E3A8A] rounded-xl flex items-center justify-center mb-6">
              <Headphones className="w-7 h-7 text-[#E2E8F0]" />
            </div>
            <h3 className="text-2xl font-bold text-[#E2E8F0] mb-4">Streaming Berkualitas Tinggi</h3>
            <p className="text-[#94A3B8]">
              Streaming HLS jernih yang dioptimalkan untuk lingkungan bisnis. Pemutaran yang andal sepanjang hari.
            </p>
          </div>

          <div className="bg-[#1E293B]/50 backdrop-blur-sm rounded-2xl p-8 border border-[#1E3A8A]/30 hover:border-[#3B82F6]/50 transition-all">
            <div className="w-14 h-14 bg-gradient-to-br from-[#3B82F6] to-[#1E3A8A] rounded-xl flex items-center justify-center mb-6">
              <Zap className="w-7 h-7 text-[#E2E8F0]" />
            </div>
            <h3 className="text-2xl font-bold text-[#E2E8F0] mb-4">Berlisensi & Sesuai Aturan</h3>
            <p className="text-[#94A3B8]">
              Semua musik berlisensi untuk penggunaan komersial. Putar dengan percaya diri karena sesuai dengan peraturan.
            </p>
          </div>
        </div>
      </div>

      <div className="py-20 px-6 bg-[#1E293B]/30">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-4xl font-bold text-[#E2E8F0] mb-6">
            Siap Mengubah Suasana Tempat Anda?
          </h2>
          <p className="text-xl text-[#94A3B8] mb-8">
            Bergabung dengan ratusan bisnis yang menciptakan suasana sempurna
          </p>
          <Link
            to="/register"
            className="inline-block px-10 py-4 bg-gradient-to-r from-[#3B82F6] to-[#1E3A8A] text-[#E2E8F0] rounded-lg font-semibold hover:shadow-xl hover:shadow-[#3B82F6]/50 transition-all transform hover:scale-105"
          >
            Mulai Uji Coba Gratis
          </Link>
        </div>
      </div>
    </div>
  );
}
