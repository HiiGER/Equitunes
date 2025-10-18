import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Music } from 'lucide-react';
import Navbar from '../components/Navbar';
import { supabase, Genre } from '../lib/supabase';

export default function MarketplacePage() {
  const [genres, setGenres] = useState<Genre[]>([]);
  const [ownedGenreIds, setOwnedGenreIds] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    fetchGenres();
    fetchOwnedGenres();
  }, []);

  const fetchGenres = async () => {
    try {
      const { data, error } = await supabase
        .from('genres')
        .select('*')
        .eq('is_active', true)
        .order('name');

      if (error) throw error;
      if (data) setGenres(data);
    } catch (error) {
      console.error('Error fetching genres:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchOwnedGenres = async () => {
    try {
      // fetch active subscriptions for current user
      const { data, error } = await supabase
        .from('subscriptions')
        .select('genre_id')
        .eq('status', 'active');

      if (error) throw error;
      if (data) {
        setOwnedGenreIds(data.map((s: any) => s.genre_id));
      }
    } catch (error) {
      console.error('Error fetching owned genres:', error);
    }
  };

  const handleSubscribe = (genre: Genre, type: 'monthly' | 'yearly') => {
    navigate('/payment', { state: { genre, subscriptionType: type } });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#0B1120] via-[#1E293B] to-[#0B1120]">
      <Navbar />

      <div className="pt-24 px-6 pb-12">
        <div className="max-w-7xl mx-auto">
          <div className="mb-12">
            <h1 className="text-4xl font-bold text-[#E2E8F0] mb-2">Genre Marketplace</h1>
            <p className="text-[#94A3B8] text-lg">
              Subscribe to the perfect genres for your business ambiance
            </p>
          </div>

          {loading ? (
            <div className="text-center py-12">
              <p className="text-[#94A3B8]">Loading genres...</p>
            </div>
          ) : genres.length === 0 ? (
            <div className="text-center py-12 bg-[#1E293B]/50 rounded-2xl border border-[#1E3A8A]/30">
              <Music className="w-16 h-16 text-[#3B82F6] mx-auto mb-4" />
              <p className="text-[#E2E8F0] text-xl">No genres available yet</p>
              <p className="text-[#94A3B8] mt-2">Check back soon for new music genres</p>
            </div>
          ) : (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              {genres.map((genre) => (
                <div
                  key={genre.id}
                  className="bg-[#1E293B]/50 backdrop-blur-sm rounded-2xl overflow-hidden border border-[#1E3A8A]/30 hover:border-[#3B82F6]/50 transition-all group"
                >
                  <div className="relative h-48 overflow-hidden">
                    <img
                      src={genre.image_url}
                      alt={genre.name}
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-[#0B1120] to-transparent"></div>
                  </div>

                  <div className="p-6">
                    <h3 className="text-2xl font-bold text-[#E2E8F0] mb-2">{genre.name}</h3>
                    <p className="text-[#94A3B8] mb-6 line-clamp-2">{genre.description}</p>

                    <div className="space-y-3">
                      <div className="flex items-center justify-between p-3 bg-[#0B1120]/50 rounded-lg border border-[#1E3A8A]/30">
                        <span className="text-[#94A3B8]">Monthly</span>
                        <span className="text-[#E2E8F0] font-bold">
                          ${Number(genre.price_monthly).toFixed(2)}/mo
                        </span>
                      </div>

                      <div className="flex items-center justify-between p-3 bg-[#0B1120]/50 rounded-lg border border-[#1E3A8A]/30">
                        <span className="text-[#94A3B8]">Yearly</span>
                        <span className="text-[#E2E8F0] font-bold">
                          ${Number(genre.price_yearly).toFixed(2)}/yr
                        </span>
                      </div>
                    </div>

                    <div className="mt-6 space-y-2">
                      {ownedGenreIds.includes(genre.id) ? (
                        <div className="space-y-2">
                          <button
                            onClick={() => navigate('/player', { state: { genreId: genre.id } })}
                            className="w-full py-3 bg-green-600 text-white rounded-lg font-semibold hover:opacity-90 transition-all"
                          >
                            Subscribed — Play
                          </button>
                        </div>
                      ) : (
                        <>
                          <button
                            onClick={() => handleSubscribe(genre, 'monthly')}
                            className="w-full py-3 bg-gradient-to-r from-[#3B82F6] to-[#1E3A8A] text-[#E2E8F0] rounded-lg font-semibold hover:shadow-lg hover:shadow-[#3B82F6]/50 transition-all"
                          >
                            Subscribe Monthly
                          </button>
                          <button
                            onClick={() => handleSubscribe(genre, 'yearly')}
                            className="w-full py-3 bg-[#0B1120] text-[#E2E8F0] rounded-lg font-semibold border border-[#3B82F6] hover:bg-[#1E3A8A] transition-all"
                          >
                            Subscribe Yearly
                          </button>
                        </>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
