import { Link, useLocation } from 'react-router-dom';
import { LayoutDashboard, Radio, CreditCard, User, LogOut, Library, Menu, X } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { useState } from 'react';
import logo from '../assets/equitunes-logo.svg';

export default function Navbar() {
  const location = useLocation();
  const { signOut } = useAuth();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const handleSignOut = async () => {
    try {
      await signOut();
    } catch (error) {
      console.error('Sign out error:', error);
    }
  };

  const navItems = [
    { to: '/dashboard', icon: LayoutDashboard, label: 'Beranda' },
    { to: '/marketplace', icon: Radio, label: 'Pasar' },
    { to: '/subscriptions', icon: Library, label: 'Langganan' },
    { to: '/payments', icon: CreditCard, label: 'Pembayaran' },
    { to: '/profile', icon: User, label: 'Profil' },
  ];

  return (
    <nav className="fixed top-0 w-full z-50 bg-[#0B1120]/90 backdrop-blur-md border-b border-[#1E3A8A]/30">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-2">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-extrabold tracking-tight text-white">
              <span className="text-white">EQU</span>
              <span className="text-[#6A5ACD]">!</span>
              <span className="text-white">TUNES</span>
            </h1>
            <div className="flex justify-end">
              <p className="text-sm font-semibold text-[#6A5ACD]">Music</p>
            </div>
          </div>

          {/* Mobile menu button */}
          <button
            className="md:hidden p-1 rounded-lg text-[#E2E8F0] hover:bg-[#1E293B]"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          >
            {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>

          {/* Desktop menu */}
          <div className="hidden md:flex items-center gap-4">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = location.pathname === item.to;
              return (
                <Link
                  key={item.to}
                  to={item.to}
                  className={`flex items-center gap-2 px-3 py-1 rounded-lg transition-all text-sm ${
                    isActive
                      ? 'bg-[#3B82F6]/20 text-[#3B82F6] border border-[#3B82F6]/30'
                      : 'text-[#94A3B8] hover:text-[#E2E8F0] hover:bg-[#1E293B]'
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  <span className="font-medium">{item.label}</span>
                </Link>
              );
            })}

            <button
              onClick={handleSignOut}
              className="flex items-center gap-2 px-3 py-1 text-[#94A3B8] hover:text-red-400 hover:bg-[#1E293B] rounded-lg transition-all text-sm"
            >
              <LogOut className="w-4 h-4" />
              <span className="font-medium">Keluar</span>
            </button>
          </div>

          {/* Mobile menu */}
          <div
            className={`${
              mobileMenuOpen ? 'block' : 'hidden'
            } md:hidden fixed inset-x-0 top-14 bg-[#0B1120] border-b border-[#1E3A8A]/30`}
          >
            <div className="px-4 py-2 space-y-1">
              {navItems.map((item) => {
                const Icon = item.icon;
                const isActive = location.pathname === item.to;
                return (
                  <Link
                    key={item.to}
                    to={item.to}
                    onClick={() => setMobileMenuOpen(false)}
                    className={`flex items-center gap-2 px-3 py-2 rounded-lg transition-all w-full text-sm ${
                      isActive
                        ? 'bg-[#3B82F6]/20 text-[#3B82F6] border border-[#3B82F6]/30'
                        : 'text-[#94A3B8] hover:text-[#E2E8F0] hover:bg-[#1E293B]'
                    }`}
                  >
                    <Icon className="w-4 h-4" />
                    <span className="font-medium">{item.label}</span>
                  </Link>
                );
              })}

              <button
                onClick={() => {
                  setMobileMenuOpen(false);
                  handleSignOut();
                }}
                className="flex items-center gap-2 px-3 py-2 text-[#94A3B8] hover:text-red-400 hover:bg-[#1E293B] rounded-lg transition-all w-full text-sm"
              >
                <LogOut className="w-4 h-4" />
                <span className="font-medium">Logout</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
}
