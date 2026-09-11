import React, { useEffect, useState } from 'react';
import { CreditCard, ShieldCheck, Clock, Download } from 'lucide-react';
import { TableSkeleton } from '../../components/common/LoadingSpinner';
import { paymentApi } from '../../api/paymentApi';

export default function StudentPayments() {
  const [payments, setPayments] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchPayments();
  }, []);

  const fetchPayments = async () => {
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

  return (
    <div className="min-h-screen bg-slate-50 p-6 lg:p-10 space-y-8">
      <div>
        <h1 className="text-2xl font-black text-slate-900">Payment Receipts</h1>
        <p className="text-xs text-slate-500 font-medium">History of your batch fee payments and Razorpay transactions.</p>
      </div>

      <div className="bg-white rounded-2xl border border-slate-200/80 shadow-sm overflow-hidden">
        <div className="p-5 border-b border-slate-100 flex items-center justify-between">
          <h3 className="text-sm font-extrabold text-slate-900">Transaction History</h3>
        </div>

        {loading ? (
          <div className="p-4">
            <TableSkeleton rows={4} />
          </div>
        ) : payments.length === 0 ? (
          <div className="p-10 text-center text-xs text-slate-400 font-medium">No payment transactions found.</div>
        ) : (
          <div className="divide-y divide-slate-100">
            {payments.map((pmt) => (
              <div key={pmt._id} className="p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4 hover:bg-slate-50/50">
                <div className="space-y-1">
                  <div className="flex items-center space-x-2">
                    <CreditCard className="w-4 h-4 text-purple-600" />
                    <h4 className="text-xs font-bold text-slate-900">{pmt.enrollment?.batch?.name || 'Batch Fee Payment'}</h4>
                  </div>
                  <p className="text-[11px] text-slate-400 font-mono">Order ID: {pmt.razorpayOrderId}</p>
                  <p className="text-[10px] text-slate-400">{new Date(pmt.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric', hour: '2-digit', minute: '2-digit' })}</p>
                </div>

                <div className="flex items-center space-x-4">
                  <div className="text-right">
                    <p className="text-sm font-extrabold text-slate-900">₹{(pmt.amount / 100).toLocaleString()}</p>
                    <span className={`text-[10px] font-extrabold uppercase px-2.5 py-0.5 rounded-full ${
                      pmt.status === 'paid' ? 'bg-emerald-100 text-emerald-800' : 'bg-amber-100 text-amber-800'
                    }`}>
                      {pmt.status}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
