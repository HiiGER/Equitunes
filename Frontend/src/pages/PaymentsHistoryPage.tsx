import { useEffect, useState } from 'react';
import { Receipt, Download } from 'lucide-react';
import Navbar from '../components/Navbar';
import { supabase, Payment } from '../lib/supabase';

export default function PaymentsHistoryPage() {
  const [payments, setPayments] = useState<Payment[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchPayments();
  }, []);

  const fetchPayments = async () => {
    try {
      const { data, error } = await supabase
        .from('payments')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      if (data) setPayments(data);
    } catch (error) {
      console.error('Error fetching payments:', error);
    } finally {
      setLoading(false);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed':
        return 'text-green-400 bg-green-400/10 border-green-400/30';
      case 'pending':
        return 'text-yellow-400 bg-yellow-400/10 border-yellow-400/30';
      case 'failed':
        return 'text-red-400 bg-red-400/10 border-red-400/30';
      default:
        return 'text-[#94A3B8] bg-[#94A3B8]/10 border-[#94A3B8]/30';
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'completed':
        return 'Selesai';
      case 'pending':
        return 'Menunggu';
      case 'failed':
        return 'Gagal';
      default:
        return status;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#0B1120] via-[#1E293B] to-[#0B1120]">
      <Navbar />

      <div className="pt-24 px-6 pb-12">
        <div className="max-w-7xl mx-auto">
          <div className="mb-12">
            <h1 className="text-4xl font-bold text-[#E2E8F0] mb-2">Riwayat Pembayaran</h1>
            <p className="text-[#94A3B8] text-lg">Lihat semua catatan transaksi Anda</p>
          </div>

          {loading ? (
            <div className="text-center py-12">
              <p className="text-[#94A3B8]">Memuat pembayaran...</p>
            </div>
          ) : payments.length === 0 ? (
            <div className="bg-[#1E293B]/50 backdrop-blur-sm rounded-2xl p-12 border border-[#1E3A8A]/30 text-center">
              <Receipt className="w-16 h-16 text-[#3B82F6] mx-auto mb-4" />
              <h2 className="text-2xl font-bold text-[#E2E8F0] mb-2">Belum Ada Pembayaran</h2>
              <p className="text-[#94A3B8]">Riwayat pembayaran Anda akan muncul di sini</p>
            </div>
          ) : (
            <div className="bg-[#1E293B]/50 backdrop-blur-sm rounded-2xl border border-[#1E3A8A]/30 overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-[#0B1120]/50 border-b border-[#1E3A8A]/30">
                    <tr>
                      <th className="px-6 py-4 text-left text-[#E2E8F0] font-semibold">Tanggal</th>
                      <th className="px-6 py-4 text-left text-[#E2E8F0] font-semibold">ID Transaksi</th>
                      <th className="px-6 py-4 text-left text-[#E2E8F0] font-semibold">Jumlah</th>
                      <th className="px-6 py-4 text-left text-[#E2E8F0] font-semibold">Metode</th>
                      <th className="px-6 py-4 text-left text-[#E2E8F0] font-semibold">Status</th>
                      <th className="px-6 py-4 text-left text-[#E2E8F0] font-semibold">Faktur</th>
                    </tr>
                  </thead>
                  <tbody>
                    {payments.map((payment) => (
                      <tr
                        key={payment.id}
                        className="border-b border-[#1E3A8A]/20 hover:bg-[#0B1120]/30 transition-colors"
                      >
                        <td className="px-6 py-4 text-[#94A3B8]">
                          {new Date(payment.created_at).toLocaleDateString()}
                        </td>
                        <td className="px-6 py-4 text-[#E2E8F0] font-mono text-sm">
                          {payment.transaction_id || 'N/A'}
                        </td>
                        <td className="px-6 py-4 text-[#E2E8F0] font-semibold">
                          Rp.{Number(payment.amount).toFixed(2)}
                        </td>
                        <td className="px-6 py-4 text-[#94A3B8]">
                          {payment.payment_method === 'credit_card' ? 'Kartu Kredit' :
                           payment.payment_method === 'debit_card' ? 'Kartu Debit' :
                           payment.payment_method === 'bank_transfer' ? 'Transfer Bank' :
                           payment.payment_method.replace('_', ' ')}
                        </td>
                        <td className="px-6 py-4">
                          <span
                            className={`px-3 py-1 rounded-full text-sm font-medium border ${getStatusColor(
                              payment.status
                            )}`}
                          >
                            {getStatusText(payment.status)}
                          </span>
                        </td>
                        <td className="px-6 py-4">
                          {payment.invoice_url ? (
                            <a
                              href={payment.invoice_url}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="flex items-center gap-2 text-[#3B82F6] hover:text-[#1E3A8A] transition-colors"
                            >
                              <Download className="w-4 h-4" />
                              <span>Unduh</span>
                            </a>
                          ) : (
                            <span className="text-[#94A3B8]">-</span>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
