import { useState } from 'react';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import { CreditCard, CheckCircle } from 'lucide-react';
import Navbar from '../components/Navbar';
import { supabase, Genre } from '../lib/supabase';
import { useAuth } from '../contexts/AuthContext';
import { useSubscription } from '../contexts/SubscriptionContext';

export default function PaymentPage() {
  const location = useLocation();
  const navigate = useNavigate();
  const { user } = useAuth();
  const { genre, subscriptionType } = location.state as { genre: Genre; subscriptionType: 'monthly' | 'yearly' } || {};

  const [paymentMethod, setPaymentMethod] = useState('credit_card');
  const [processing, setProcessing] = useState(false);
  const [success, setSuccess] = useState(false);

  if (!genre || !subscriptionType) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-[#0B1120] via-[#1E293B] to-[#0B1120]">
        <Navbar />
        <div className="pt-24 px-6 pb-12">
          <div className="max-w-2xl mx-auto text-center">
            <p className="text-[#E2E8F0] mb-4">Belum ada langganan yang dipilih</p>
            <Link to="/marketplace" className="text-[#3B82F6] hover:underline">
              Ke Pasar
            </Link>
          </div>
        </div>
      </div>
    );
  }

  const amount = subscriptionType === 'monthly' ? genre.price_monthly : genre.price_yearly;

  const handlePayment = async () => {
    if (!user) {
      alert('Silakan login terlebih dahulu');
      return;
    }

    setProcessing(true);

    try {
      const endDate = new Date();
      if (subscriptionType === 'monthly') {
        endDate.setMonth(endDate.getMonth() + 1);
      } else {
        endDate.setFullYear(endDate.getFullYear() + 1);
      }

      const startDate = new Date();
      // Format tanggal ke Indonesia
      const formatDate = (date: Date) => {
        return date.toLocaleDateString('id-ID', {
          day: 'numeric',
          month: 'long',
          year: 'numeric'
        });
      };
      const { data: subscription, error: subError } = await supabase
        .from('subscriptions')
        .insert({
          user_id: user.id,
          genre_id: genre.id,
          start_date: startDate.toISOString(),
          end_date: endDate.toISOString(),
          status: 'active',
          subscription_type: subscriptionType,
          created_at: startDate.toISOString()
        })
        .select()
        .single();

      if (subError) throw subError;

      const { error: paymentError } = await supabase.from('payments').insert({
        user_id: user.id,
        subscription_id: subscription.id,
        amount: Number(amount),
        payment_method: paymentMethod,
        status: 'completed',
        transaction_id: `TXN-${Date.now()}`,
      });

      if (paymentError) throw paymentError;

      // Refresh subscription data setelah pembayaran berhasil
      const { refreshSubscriptions } = useSubscription();
      await refreshSubscriptions();

      setSuccess(true);
      setTimeout(() => {
        navigate('/subscriptions');
      }, 2000);
    } catch (error) {
      console.error('Payment error:', error);
      alert('Pembayaran gagal. Silakan coba lagi.');
    } finally {
      setProcessing(false);
    }
  };

  if (success) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-[#0B1120] via-[#1E293B] to-[#0B1120]">
        <Navbar />
        <div className="pt-24 px-6 pb-12">
          <div className="max-w-2xl mx-auto">
            <div className="bg-[#1E293B]/50 backdrop-blur-sm rounded-2xl p-12 border border-[#1E3A8A]/30 text-center">
              <CheckCircle className="w-20 h-20 text-green-400 mx-auto mb-6" />
              <h2 className="text-3xl font-bold text-[#E2E8F0] mb-4">Pembayaran Berhasil!</h2>
              <p className="text-[#94A3B8] text-lg">
                Langganan Anda untuk {genre.name} sekarang aktif
              </p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#0B1120] via-[#1E293B] to-[#0B1120]">
      <Navbar />

      <div className="pt-24 px-6 pb-12">
        <div className="max-w-4xl mx-auto">
          <div className="mb-12">
            <h1 className="text-4xl font-bold text-[#E2E8F0] mb-2">Selesaikan Pembayaran</h1>
            <p className="text-[#94A3B8] text-lg">Tinjau dan konfirmasi langganan Anda</p>
          </div>

          <div className="grid md:grid-cols-2 gap-8">
            <div className="bg-[#1E293B]/50 backdrop-blur-sm rounded-2xl p-8 border border-[#1E3A8A]/30">
              <h2 className="text-2xl font-bold text-[#E2E8F0] mb-6">Ringkasan Pesanan</h2>

              <div className="flex items-center gap-4 mb-6">
                <img
                  src={genre.image_url}
                  alt={genre.name}
                  className="w-20 h-20 rounded-lg object-cover"
                />
                <div>
                  <h3 className="text-xl font-bold text-[#E2E8F0]">{genre.name}</h3>
                  <p className="text-[#94A3B8] capitalize">
                    Langganan {subscriptionType === 'monthly' ? 'Bulanan' : 'Tahunan'}
                  </p>
                </div>
              </div>

              <div className="space-y-3 py-6 border-y border-[#1E3A8A]/30">
                <div className="flex justify-between text-[#94A3B8]">
                  <span>Jenis Langganan</span>
                  <span className="text-[#E2E8F0] capitalize">
                    {subscriptionType === 'monthly' ? 'Bulanan' : 'Tahunan'}
                  </span>
                </div>
                <div className="flex justify-between text-[#94A3B8]">
                  <span>Durasi</span>
                  <span className="text-[#E2E8F0]">
                    {subscriptionType === 'monthly' ? '1 Bulan' : '1 Tahun'}
                  </span>
                </div>
                <div className="flex justify-between text-[#94A3B8]">
                  <span>Jumlah</span>
                  <span className="text-[#E2E8F0]">${Number(amount).toFixed(2)}</span>
                </div>
              </div>

              <div className="flex justify-between text-lg font-bold mt-6">
                <span className="text-[#E2E8F0]">Total</span>
                <span className="text-[#3B82F6]">${Number(amount).toFixed(2)}</span>
              </div>
            </div>

            <div className="bg-[#1E293B]/50 backdrop-blur-sm rounded-2xl p-8 border border-[#1E3A8A]/30">
              <h2 className="text-2xl font-bold text-[#E2E8F0] mb-6">Metode Pembayaran</h2>

              <div className="space-y-4 mb-8">
                <label className="flex items-center gap-3 p-4 bg-[#0B1120]/50 rounded-lg border border-[#1E3A8A]/30 cursor-pointer hover:border-[#3B82F6]/50 transition-all">
                  <input
                    type="radio"
                    value="credit_card"
                    checked={paymentMethod === 'credit_card'}
                    onChange={(e) => setPaymentMethod(e.target.value)}
                    className="w-4 h-4 text-[#3B82F6]"
                  />
                  <CreditCard className="w-5 h-5 text-[#3B82F6]" />
                  <span className="text-[#E2E8F0]">Kartu Kredit</span>
                </label>

                <label className="flex items-center gap-3 p-4 bg-[#0B1120]/50 rounded-lg border border-[#1E3A8A]/30 cursor-pointer hover:border-[#3B82F6]/50 transition-all">
                  <input
                    type="radio"
                    value="debit_card"
                    checked={paymentMethod === 'debit_card'}
                    onChange={(e) => setPaymentMethod(e.target.value)}
                    className="w-4 h-4 text-[#3B82F6]"
                  />
                  <CreditCard className="w-5 h-5 text-[#3B82F6]" />
                  <span className="text-[#E2E8F0]">Kartu Debit</span>
                </label>

                <label className="flex items-center gap-3 p-4 bg-[#0B1120]/50 rounded-lg border border-[#1E3A8A]/30 cursor-pointer hover:border-[#3B82F6]/50 transition-all">
                  <input
                    type="radio"
                    value="bank_transfer"
                    checked={paymentMethod === 'bank_transfer'}
                    onChange={(e) => setPaymentMethod(e.target.value)}
                    className="w-4 h-4 text-[#3B82F6]"
                  />
                  <span className="text-[#E2E8F0]">Transfer Bank</span>
                </label>
              </div>

              <button
                onClick={handlePayment}
                disabled={processing}
                className="w-full py-4 bg-gradient-to-r from-[#3B82F6] to-[#1E3A8A] text-[#E2E8F0] rounded-lg font-semibold hover:shadow-lg hover:shadow-[#3B82F6]/50 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {processing ? 'Memproses...' : `Bayar $${Number(amount).toFixed(2)}`}
              </button>

              <p className="text-[#94A3B8] text-sm text-center mt-4">
                Pembayaran Anda aman dan terenkripsi
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
