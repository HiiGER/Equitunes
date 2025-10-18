import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Calendar, CheckCircle, XCircle, Clock } from 'lucide-react';
import Navbar from '../components/Navbar';
import { supabase, Subscription, Genre } from '../lib/supabase';

export default function SubscriptionsPage() {
  const [subscriptions, setSubscriptions] = useState<(Subscription & { genre: Genre })[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchSubscriptions();
  }, []);

  const fetchSubscriptions = async () => {
    try {
      const { data, error } = await supabase
        .from('subscriptions')
        .select('*, genre:genres(*)')
        .order('created_at', { ascending: false });

      if (error) throw error;
      if (data) setSubscriptions(data as any);
    } catch (error) {
      console.error('Error fetching subscriptions:', error);
    } finally {
      setLoading(false);
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'active':
        return <CheckCircle className="w-5 h-5 text-green-400" />;
      case 'expired':
        return <XCircle className="w-5 h-5 text-red-400" />;
      case 'cancelled':
        return <XCircle className="w-5 h-5 text-gray-400" />;
      default:
        return <Clock className="w-5 h-5 text-[#94A3B8]" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active':
        return 'text-green-400';
      case 'expired':
        return 'text-red-400';
      case 'cancelled':
        return 'text-gray-400';
      default:
        return 'text-[#94A3B8]';
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#0B1120] via-[#1E293B] to-[#0B1120]">
      <Navbar />

      <div className="pt-24 px-6 pb-12">
        <div className="max-w-7xl mx-auto">
          <div className="mb-12">
            <h1 className="text-4xl font-bold text-[#E2E8F0] mb-2">My Subscriptions</h1>
            <p className="text-[#94A3B8] text-lg">
              Manage your active and past genre subscriptions
            </p>
          </div>

          {loading ? (
            <div className="text-center py-12">
              <p className="text-[#94A3B8]">Loading subscriptions...</p>
            </div>
          ) : subscriptions.length === 0 ? (
            <div className="bg-[#1E293B]/50 backdrop-blur-sm rounded-2xl p-12 border border-[#1E3A8A]/30 text-center">
              <Calendar className="w-16 h-16 text-[#3B82F6] mx-auto mb-4" />
              <h2 className="text-2xl font-bold text-[#E2E8F0] mb-2">No Subscriptions Yet</h2>
              <p className="text-[#94A3B8] mb-6">
                Start your music journey by subscribing to your first genre
              </p>
              <Link
                to="/marketplace"
                className="inline-block px-8 py-3 bg-gradient-to-r from-[#3B82F6] to-[#1E3A8A] text-[#E2E8F0] rounded-lg font-semibold hover:shadow-lg hover:shadow-[#3B82F6]/50 transition-all"
              >
                Browse Marketplace
              </Link>
            </div>
          ) : (
            <div className="space-y-4">
              {subscriptions.map((sub) => (
                <div
                  key={sub.id}
                  className="bg-[#1E293B]/50 backdrop-blur-sm rounded-2xl p-6 border border-[#1E3A8A]/30 hover:border-[#3B82F6]/30 transition-all"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-6">
                      <img
                        src={sub.genre.image_url}
                        alt={sub.genre.name}
                        className="w-20 h-20 rounded-lg object-cover"
                      />
                      <div>
                        <h3 className="text-2xl font-bold text-[#E2E8F0] mb-1">
                          {sub.genre.name}
                        </h3>
                        <p className="text-[#94A3B8] mb-2">{sub.genre.description}</p>
                        <div className="flex items-center gap-4 text-sm">
                          <span className="text-[#94A3B8]">
                            Type: <span className="text-[#E2E8F0] capitalize">{sub.subscription_type}</span>
                          </span>
                          <span className="text-[#94A3B8]">
                            Started: <span className="text-[#E2E8F0]">{new Date(sub.start_date).toLocaleDateString()}</span>
                          </span>
                          <span className="text-[#94A3B8]">
                            Expires: <span className="text-[#E2E8F0]">{new Date(sub.end_date).toLocaleDateString()}</span>
                          </span>
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center gap-4">
                      <div className={`flex items-center gap-2 px-4 py-2 rounded-lg bg-[#0B1120]/50 ${getStatusColor(sub.status)}`}>
                        {getStatusIcon(sub.status)}
                        <span className="font-semibold capitalize">{sub.status}</span>
                      </div>

                      {sub.status === 'active' && (
                        <Link
                          to="/player"
                          state={{ genreId: sub.genre_id }}
                          className="px-6 py-2 bg-gradient-to-r from-[#3B82F6] to-[#1E3A8A] text-[#E2E8F0] rounded-lg font-semibold hover:shadow-lg hover:shadow-[#3B82F6]/50 transition-all"
                        >
                          Listen Now
                        </Link>
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
