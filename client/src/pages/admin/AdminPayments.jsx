import React, { useEffect, useState } from 'react';
import { CreditCard, ShieldCheck, Download, Users } from 'lucide-react';
import { paymentApi } from '../../api/paymentApi';

export default function AdminPayments() {
  const [payments, setPayments] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchAllPayments();
  }, []);

  const fetchAllPayments = async () => {
    setLoading(true);
    try {
      const res = await paymentApi.getPaymentHistory();
      setPayments(res.data?.payments || []);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const totalCollected = payments
    .filter((p) => p.status === 'paid')
    .reduce((acc, p) => acc + (p.amount / 100 || 0), 0);

  return (
    <div className="min-h-screen bg-slate-50 p-6 lg:p-10 space-y-8">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black text-slate-900">Platform Payments</h1>
          <p className="text-xs text-slate-500 font-medium">Audit all Razorpay transactions across students and batches.</p>
        </div>

        <div className="bg-emerald-100 text-emerald-800 px-5 py-2.5 rounded-full text-xs font-black shadow-sm shrink-0">
          Total Fee Revenue: ₹{totalCollected.toLocaleString()}
        </div>
      </div>

      <div className="bg-white rounded-2xl border border-slate-200/80 shadow-sm overflow-hidden">
        <div className="p-5 border-b border-slate-100 flex items-center justify-between">
          <h3 className="text-sm font-extrabold text-slate-900">All Transactions ({payments.length})</h3>
        </div>

        {loading ? (
          <div className="p-8 text-center text-xs text-slate-400 font-semibold animate-pulse">Loading payment records...</div>
        ) : payments.length === 0 ? (
          <div className="p-10 text-center text-xs text-slate-400 font-medium">No transactions recorded.</div>
        ) : (
          <div className="divide-y divide-slate-100">
            {payments.map((pmt) => (
              <div key={pmt._id} className="p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4 hover:bg-slate-50/50">
                <div className="space-y-1">
                  <div className="flex items-center space-x-2">
                    <CreditCard className="w-4 h-4 text-purple-600" />
                    <h4 className="text-xs font-bold text-slate-900">{pmt.student?.name || 'Student'} ({pmt.student?.email})</h4>
                  </div>
                  <p className="text-[11px] text-slate-500">Batch: {pmt.enrollment?.batch?.name || 'General Course Fee'}</p>
                  <p className="text-[10px] text-slate-400 font-mono">Order ID: {pmt.razorpayOrderId}</p>
                </div>

                <div className="text-right shrink-0">
                  <p className="text-sm font-extrabold text-slate-900">₹{(pmt.amount / 100).toLocaleString()}</p>
                  <span className={`text-[10px] font-extrabold uppercase px-2.5 py-0.5 rounded-full ${
                    pmt.status === 'paid' ? 'bg-emerald-100 text-emerald-800' : 'bg-amber-100 text-amber-800'
                  }`}>
                    {pmt.status}
                  </span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
