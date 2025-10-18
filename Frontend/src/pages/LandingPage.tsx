import { Music2, Headphones, Zap } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-[#0B1120] via-[#1E293B] to-[#0B1120]">
      <nav className="fixed top-0 w-full z-50 bg-[#0B1120]/80 backdrop-blur-md border-b border-[#1E3A8A]/30">
        <div className="max-w-7xl mx-auto px-6 py-4 flex justify-between items-center">
          <div className="flex items-center gap-2">
            <Music2 className="w-8 h-8 text-[#3B82F6]" />
            <span className="text-2xl font-bold text-[#E2E8F0]">MusicFlow</span>
          </div>
          <div className="flex gap-4">
            <Link
              to="/login"
              className="px-6 py-2 text-[#E2E8F0] hover:text-[#3B82F6] transition-colors"
            >
              Login
            </Link>
            <Link
              to="/register"
              className="px-6 py-2 bg-gradient-to-r from-[#1E3A8A] to-[#3B82F6] text-[#E2E8F0] rounded-lg hover:shadow-lg hover:shadow-[#3B82F6]/50 transition-all"
            >
              Get Started
            </Link>
          </div>
        </div>
      </nav>

      <div className="pt-32 pb-20 px-6">
        <div className="max-w-7xl mx-auto text-center">
          <h1 className="text-6xl md:text-7xl font-bold text-[#E2E8F0] mb-6 leading-tight">
            Music That Matches Your<br />
            <span className="bg-gradient-to-r from-[#3B82F6] to-[#1E3A8A] bg-clip-text text-transparent">
              Business Mood
            </span>
          </h1>
          <p className="text-xl text-[#94A3B8] mb-12 max-w-2xl mx-auto">
            Professional music streaming for cafes, hotels, and restaurants. Subscribe to genres that fit your ambiance.
          </p>
          <div className="flex gap-4 justify-center">
            <Link
              to="/register"
              className="px-8 py-4 bg-gradient-to-r from-[#3B82F6] to-[#1E3A8A] text-[#E2E8F0] rounded-lg font-semibold hover:shadow-xl hover:shadow-[#3B82F6]/50 transition-all transform hover:scale-105"
            >
              Browse Genres
            </Link>
            <Link
              to="/login"
              className="px-8 py-4 bg-[#1E293B] text-[#E2E8F0] rounded-lg font-semibold border border-[#1E3A8A] hover:border-[#3B82F6] transition-all"
            >
              Sign In
            </Link>
          </div>
        </div>

        <div className="mt-32 grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
          <div className="bg-[#1E293B]/50 backdrop-blur-sm rounded-2xl p-8 border border-[#1E3A8A]/30 hover:border-[#3B82F6]/50 transition-all">
            <div className="w-14 h-14 bg-gradient-to-br from-[#3B82F6] to-[#1E3A8A] rounded-xl flex items-center justify-center mb-6">
              <Music2 className="w-7 h-7 text-[#E2E8F0]" />
            </div>
            <h3 className="text-2xl font-bold text-[#E2E8F0] mb-4">Genre-Based Subscriptions</h3>
            <p className="text-[#94A3B8]">
              Subscribe only to the genres you need. From Jazz to Lofi, curate the perfect atmosphere for your business.
            </p>
          </div>

          <div className="bg-[#1E293B]/50 backdrop-blur-sm rounded-2xl p-8 border border-[#1E3A8A]/30 hover:border-[#3B82F6]/50 transition-all">
            <div className="w-14 h-14 bg-gradient-to-br from-[#3B82F6] to-[#1E3A8A] rounded-xl flex items-center justify-center mb-6">
              <Headphones className="w-7 h-7 text-[#E2E8F0]" />
            </div>
            <h3 className="text-2xl font-bold text-[#E2E8F0] mb-4">High-Quality Streaming</h3>
            <p className="text-[#94A3B8]">
              Crystal-clear HLS streaming optimized for business environments. Reliable playback all day long.
            </p>
          </div>

          <div className="bg-[#1E293B]/50 backdrop-blur-sm rounded-2xl p-8 border border-[#1E3A8A]/30 hover:border-[#3B82F6]/50 transition-all">
            <div className="w-14 h-14 bg-gradient-to-br from-[#3B82F6] to-[#1E3A8A] rounded-xl flex items-center justify-center mb-6">
              <Zap className="w-7 h-7 text-[#E2E8F0]" />
            </div>
            <h3 className="text-2xl font-bold text-[#E2E8F0] mb-4">Licensed & Compliant</h3>
            <p className="text-[#94A3B8]">
              All music is properly licensed for commercial use. Play with confidence knowing you're fully compliant.
            </p>
          </div>
        </div>
      </div>

      <div className="py-20 px-6 bg-[#1E293B]/30">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-4xl font-bold text-[#E2E8F0] mb-6">
            Ready to Transform Your Space?
          </h2>
          <p className="text-xl text-[#94A3B8] mb-8">
            Join hundreds of businesses creating the perfect ambiance
          </p>
          <Link
            to="/register"
            className="inline-block px-10 py-4 bg-gradient-to-r from-[#3B82F6] to-[#1E3A8A] text-[#E2E8F0] rounded-lg font-semibold hover:shadow-xl hover:shadow-[#3B82F6]/50 transition-all transform hover:scale-105"
          >
            Start Your Free Trial
          </Link>
        </div>
      </div>
    </div>
  );
}
