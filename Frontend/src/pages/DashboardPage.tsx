import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Music, TrendingUp, Clock, Play } from 'lucide-react';
import Navbar from '../components/Navbar';
import { useAuth } from '../contexts/AuthContext';
import { supabase, Subscription, Genre, PlayHistory } from '../lib/supabase';

export default function DashboardPage() {
  const { profile } = useAuth();
  const [subscriptions, setSubscriptions] = useState<(Subscription & { genre: Genre })[]>([]);
  const [recentPlays, setRecentPlays] = useState<number>(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      const { data: subs } = await supabase
        .from('subscriptions')
        .select('*, genre:genres(*)')
        .eq('status', 'active')
        .gte('end_date', new Date().toISOString());

      const { count } = await supabase
        .from('play_history')
        .select('*', { count: 'exact', head: true });

      if (subs) setSubscriptions(subs as any);
      if (count) setRecentPlays(count);
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#0B1120] via-[#1E293B] to-[#0B1120]">
      <Navbar />

      <div className="pt-24 px-6 pb-12">
        <div className="max-w-7xl mx-auto">
          <div className="mb-12">
            <h1 className="text-4xl font-bold text-[#E2E8F0] mb-2">
              Selamat datang kembali, {profile?.business_name}
            </h1>
            <p className="text-[#94A3B8] text-lg">
              Kelola langganan musik Anda dan jelajahi genre baru
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-6 mb-12">
            <div className="bg-[#1E293B]/50 backdrop-blur-sm rounded-2xl p-6 border border-[#1E3A8A]/30">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-gradient-to-br from-[#3B82F6] to-[#1E3A8A] rounded-xl flex items-center justify-center">
                  <Music className="w-6 h-6 text-[#E2E8F0]" />
                </div>
                <div>
                  <p className="text-[#94A3B8] text-sm">Langganan Aktif</p>
                  <p className="text-3xl font-bold text-[#E2E8F0]">{subscriptions.length}</p>
                </div>
              </div>
            </div>

            <div className="bg-[#1E293B]/50 backdrop-blur-sm rounded-2xl p-6 border border-[#1E3A8A]/30">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-gradient-to-br from-[#3B82F6] to-[#1E3A8A] rounded-xl flex items-center justify-center">
                  <Play className="w-6 h-6 text-[#E2E8F0]" />
                </div>
                <div>
                  <p className="text-[#94A3B8] text-sm">Lagu Diputar</p>
                  <p className="text-3xl font-bold text-[#E2E8F0]">{recentPlays}</p>
                </div>
              </div>
            </div>

            <div className="bg-[#1E293B]/50 backdrop-blur-sm rounded-2xl p-6 border border-[#1E3A8A]/30">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-gradient-to-br from-[#3B82F6] to-[#1E3A8A] rounded-xl flex items-center justify-center">
                  <TrendingUp className="w-6 h-6 text-[#E2E8F0]" />
                </div>
                <div>
                  <p className="text-[#94A3B8] text-sm">Status</p>
                  <p className="text-2xl font-bold text-green-400">Aktif</p>
                </div>
              </div>
            </div>
          </div>

          <div className="grid md:grid-cols-2 gap-8">
            <div className="bg-[#1E293B]/50 backdrop-blur-sm rounded-2xl p-8 border border-[#1E3A8A]/30">
              <h2 className="text-2xl font-bold text-[#E2E8F0] mb-6">Langganan Aktif</h2>
              {loading ? (
                <p className="text-[#94A3B8]">Memuat...</p>
              ) : subscriptions.length === 0 ? (
                <div className="text-center py-8">
                  <p className="text-[#94A3B8] mb-4">Belum ada langganan aktif</p>
                  <Link
                    to="/marketplace"
                    className="inline-block px-6 py-3 bg-gradient-to-r from-[#3B82F6] to-[#1E3A8A] text-[#E2E8F0] rounded-lg font-semibold hover:shadow-lg hover:shadow-[#3B82F6]/50 transition-all"
                  >
                    Jelajahi Genre
                  </Link>
                </div>
              ) : (
                <div className="space-y-4">
                  {subscriptions.map((sub) => (
                    <div
                      key={sub.id}
                      className="flex items-center justify-between p-4 bg-[#0B1120]/50 rounded-lg border border-[#1E3A8A]/30"
                    >
                      <div className="flex items-center gap-4">
                        <img
                          src={sub.genre.image_url}
                          alt={sub.genre.name}
                          className="w-12 h-12 rounded-lg object-cover"
                        />
                        <div>
                          <p className="text-[#E2E8F0] font-semibold">{sub.genre.name}</p>
                          <p className="text-[#94A3B8] text-sm">
                            Berakhir {new Date(sub.end_date).toLocaleDateString()}
                          </p>
                        </div>
                      </div>
                      <Link
                        to="/player"
                        state={{ genreId: sub.genre_id }}
                        className="px-4 py-2 bg-[#3B82F6] text-[#E2E8F0] rounded-lg hover:bg-[#1E3A8A] transition-colors"
                      >
                        Putar
                      </Link>
                    </div>
                  ))}
                </div>
              )}
            </div>

            <div className="bg-[#1E293B]/50 backdrop-blur-sm rounded-2xl p-8 border border-[#1E3A8A]/30">
              <h2 className="text-2xl font-bold text-[#E2E8F0] mb-6">Menu Cepat</h2>
              <div className="space-y-4">
                <Link
                  to="/marketplace"
                  className="block p-4 bg-[#0B1120]/50 rounded-lg border border-[#1E3A8A]/30 hover:border-[#3B82F6]/50 transition-all group"
                >
                  <h3 className="text-[#E2E8F0] font-semibold mb-2 group-hover:text-[#3B82F6]">
                    Jelajahi Genre Baru
                  </h3>
                  <p className="text-[#94A3B8] text-sm">
                    Temukan dan berlangganan genre musik baru untuk bisnis Anda
                  </p>
                </Link>

                <Link
                  to="/subscriptions"
                  className="block p-4 bg-[#0B1120]/50 rounded-lg border border-[#1E3A8A]/30 hover:border-[#3B82F6]/50 transition-all group"
                >
                  <h3 className="text-[#E2E8F0] font-semibold mb-2 group-hover:text-[#3B82F6]">
                    Kelola Langganan
                  </h3>
                  <p className="text-[#94A3B8] text-sm">
                    Lihat dan kelola langganan genre aktif Anda
                  </p>
                </Link>

                <Link
                  to="/profile"
                  className="block p-4 bg-[#0B1120]/50 rounded-lg border border-[#1E3A8A]/30 hover:border-[#3B82F6]/50 transition-all group"
                >
                  <h3 className="text-[#E2E8F0] font-semibold mb-2 group-hover:text-[#3B82F6]">
                    Perbarui Profil
                  </h3>
                  <p className="text-[#94A3B8] text-sm">
                    Kelola informasi dan pengaturan bisnis Anda
                  </p>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
