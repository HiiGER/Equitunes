import { Link, useLocation } from 'react-router-dom';
import { Music2, LayoutDashboard, Radio, CreditCard, User, LogOut, Library } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';

export default function Navbar() {
  const location = useLocation();
  const { signOut, profile } = useAuth();

  const handleSignOut = async () => {
    try {
      await signOut();
    } catch (error) {
      console.error('Sign out error:', error);
    }
  };

  const navItems = [
    { to: '/dashboard', icon: LayoutDashboard, label: 'Dashboard' },
    { to: '/marketplace', icon: Radio, label: 'Marketplace' },
    { to: '/subscriptions', icon: Library, label: 'Subscriptions' },
    { to: '/payments', icon: CreditCard, label: 'Payments' },
    { to: '/profile', icon: User, label: 'Profile' },
  ];

  return (
    <nav className="fixed top-0 w-full z-50 bg-[#0B1120]/90 backdrop-blur-md border-b border-[#1E3A8A]/30">
      <div className="max-w-7xl mx-auto px-6 py-4">
        <div className="flex justify-between items-center">
          <Link to="/dashboard" className="flex items-center gap-2">
            <Music2 className="w-8 h-8 text-[#3B82F6]" />
            <span className="text-2xl font-bold text-[#E2E8F0]">Equitunes</span>
          </Link>

          <div className="flex items-center gap-6">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = location.pathname === item.to;
              return (
                <Link
                  key={item.to}
                  to={item.to}
                  className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-all ${
                    isActive
                      ? 'bg-[#3B82F6]/20 text-[#3B82F6] border border-[#3B82F6]/30'
                      : 'text-[#94A3B8] hover:text-[#E2E8F0] hover:bg-[#1E293B]'
                  }`}
                >
                  <Icon className="w-5 h-5" />
                  <span className="font-medium">{item.label}</span>
                </Link>
              );
            })}

            <button
              onClick={handleSignOut}
              className="flex items-center gap-2 px-4 py-2 text-[#94A3B8] hover:text-red-400 hover:bg-[#1E293B] rounded-lg transition-all"
            >
              <LogOut className="w-5 h-5" />
              <span className="font-medium">Logout</span>
            </button>
          </div>
        </div>
      </div>
    </nav>
  );
}
