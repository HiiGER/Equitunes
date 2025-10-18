import { useState, useEffect } from 'react';
import { User, Building, MapPin, Phone } from 'lucide-react';
import Navbar from '../components/Navbar';
import { useAuth } from '../contexts/AuthContext';
import { supabase } from '../lib/supabase';

export default function ProfilePage() {
  const { profile, user, refreshProfile } = useAuth();
  const [editing, setEditing] = useState(false);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');

  const [formData, setFormData] = useState({
    business_name: '',
    address: '',
    phone: '',
  });

  useEffect(() => {
    if (profile) {
      setFormData({
        business_name: profile.business_name,
        address: profile.address,
        phone: profile.phone || '',
      });
    }
  }, [profile]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;

    setLoading(true);
    setMessage('');

    try {
      const { error } = await supabase
        .from('profiles')
        .update({
          business_name: formData.business_name,
          address: formData.address,
          phone: formData.phone || null,
          updated_at: new Date().toISOString(),
        })
        .eq('id', user.id);

      if (error) throw error;

      await refreshProfile();
      setMessage('Profile updated successfully');
      setEditing(false);
    } catch (error: any) {
      setMessage(error.message || 'Failed to update profile');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#0B1120] via-[#1E293B] to-[#0B1120]">
      <Navbar />

      <div className="pt-24 px-6 pb-12">
        <div className="max-w-4xl mx-auto">
          <div className="mb-12">
            <h1 className="text-4xl font-bold text-[#E2E8F0] mb-2">Profile Settings</h1>
            <p className="text-[#94A3B8] text-lg">Manage your business information</p>
          </div>

          <div className="bg-[#1E293B]/50 backdrop-blur-sm rounded-2xl p-8 border border-[#1E3A8A]/30">
            <div className="flex items-center gap-4 mb-8">
              <div className="w-20 h-20 bg-gradient-to-br from-[#3B82F6] to-[#1E3A8A] rounded-full flex items-center justify-center">
                <User className="w-10 h-10 text-[#E2E8F0]" />
              </div>
              <div>
                <h2 className="text-2xl font-bold text-[#E2E8F0]">{profile?.business_name}</h2>
                <p className="text-[#94A3B8]">{user?.email}</p>
              </div>
            </div>

            {message && (
              <div className={`mb-6 p-4 rounded-lg ${
                message.includes('success')
                  ? 'bg-green-500/10 border border-green-500/30 text-green-400'
                  : 'bg-red-500/10 border border-red-500/30 text-red-400'
              }`}>
                {message}
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label className="flex items-center gap-2 text-[#E2E8F0] mb-2 font-medium">
                  <Building className="w-5 h-5" />
                  Business Name
                </label>
                <input
                  type="text"
                  value={formData.business_name}
                  onChange={(e) => setFormData({ ...formData, business_name: e.target.value })}
                  disabled={!editing}
                  className="w-full px-4 py-3 bg-[#0B1120] border border-[#1E3A8A] rounded-lg text-[#E2E8F0] focus:outline-none focus:border-[#3B82F6] focus:ring-2 focus:ring-[#3B82F6]/20 transition-all disabled:opacity-60"
                  required
                />
              </div>

              <div>
                <label className="flex items-center gap-2 text-[#E2E8F0] mb-2 font-medium">
                  <MapPin className="w-5 h-5" />
                  Address
                </label>
                <input
                  type="text"
                  value={formData.address}
                  onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                  disabled={!editing}
                  className="w-full px-4 py-3 bg-[#0B1120] border border-[#1E3A8A] rounded-lg text-[#E2E8F0] focus:outline-none focus:border-[#3B82F6] focus:ring-2 focus:ring-[#3B82F6]/20 transition-all disabled:opacity-60"
                  required
                />
              </div>

              <div>
                <label className="flex items-center gap-2 text-[#E2E8F0] mb-2 font-medium">
                  <Phone className="w-5 h-5" />
                  Phone
                </label>
                <input
                  type="tel"
                  value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  disabled={!editing}
                  className="w-full px-4 py-3 bg-[#0B1120] border border-[#1E3A8A] rounded-lg text-[#E2E8F0] focus:outline-none focus:border-[#3B82F6] focus:ring-2 focus:ring-[#3B82F6]/20 transition-all disabled:opacity-60"
                />
              </div>

              <div className="flex gap-4">
                {!editing ? (
                  <button
                    type="button"
                    onClick={() => setEditing(true)}
                    className="px-8 py-3 bg-gradient-to-r from-[#3B82F6] to-[#1E3A8A] text-[#E2E8F0] rounded-lg font-semibold hover:shadow-lg hover:shadow-[#3B82F6]/50 transition-all"
                  >
                    Edit Profile
                  </button>
                ) : (
                  <>
                    <button
                      type="submit"
                      disabled={loading}
                      className="px-8 py-3 bg-gradient-to-r from-[#3B82F6] to-[#1E3A8A] text-[#E2E8F0] rounded-lg font-semibold hover:shadow-lg hover:shadow-[#3B82F6]/50 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      {loading ? 'Saving...' : 'Save Changes'}
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        setEditing(false);
                        setMessage('');
                        if (profile) {
                          setFormData({
                            business_name: profile.business_name,
                            address: profile.address,
                            phone: profile.phone || '',
                          });
                        }
                      }}
                      className="px-8 py-3 bg-[#1E293B] text-[#E2E8F0] rounded-lg font-semibold border border-[#1E3A8A] hover:border-[#3B82F6] transition-all"
                    >
                      Cancel
                    </button>
                  </>
                )}
              </div>
            </form>

            <div className="mt-8 pt-8 border-t border-[#1E3A8A]/30">
              <h3 className="text-xl font-bold text-[#E2E8F0] mb-4">Account Information</h3>
              <div className="space-y-3 text-[#94A3B8]">
                <p>
                  Email: <span className="text-[#E2E8F0]">{user?.email}</span>
                </p>
                <p>
                  Account Created:{' '}
                  <span className="text-[#E2E8F0]">
                    {profile?.created_at ? new Date(profile.created_at).toLocaleDateString() : 'N/A'}
                  </span>
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
