import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { 
  BookOpen, 
  Users, 
  CreditCard, 
  Bell, 
  Plus, 
  Sparkles, 
  CheckCircle2, 
  ArrowRight,
  ShieldCheck
} from 'lucide-react';
import { batchApi } from '../../api/batchApi';
import { paymentApi } from '../../api/paymentApi';
import { noticeApi } from '../../api/noticeApi';

export default function AdminDashboard() {
  const [batches, setBatches] = useState([]);
  const [payments, setPayments] = useState([]);
  const [notices, setNotices] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchAdminMetrics();
  }, []);

  const fetchAdminMetrics = async () => {
    setLoading(true);
    try {
      const [batchRes, paymentRes, noticeRes] = await Promise.allSettled([
        batchApi.getBatches(),
        paymentApi.getPaymentHistory(),
        noticeApi.getNotices(),
      ]);

      if (batchRes.status === 'fulfilled') setBatches(batchRes.value.data?.batches || []);
      if (paymentRes.status === 'fulfilled') setPayments(paymentRes.value.data?.payments || []);
      if (noticeRes.status === 'fulfilled') setNotices(noticeRes.value.data?.notices || []);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const totalRevenue = payments
    .filter((p) => p.status === 'paid')
    .reduce((acc, p) => acc + (p.amount / 100 || 0), 0);

  return (
    <div className="min-h-screen bg-slate-50 p-6 lg:p-10 space-y-8">
      
      {/* Banner */}
      <div className="bg-gradient-to-r from-purple-950 via-purple-900 to-indigo-950 text-white rounded-3xl p-8 lg:p-10 shadow-xl relative overflow-hidden">
        <div className="relative z-10 space-y-3">
          <div className="inline-flex items-center space-x-2 bg-amber-400 text-slate-950 px-3.5 py-1 rounded-full text-xs font-black shadow-md">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Admin Master Control</span>
          </div>
          <h1 className="text-3xl lg:text-4xl font-extrabold tracking-tight">
            EduBatch Management Portal 👑
          </h1>
          <p className="text-purple-200 text-xs md:text-sm max-w-xl leading-relaxed">
            Full platform administration: batch creation, fee payments, student enrollments, and teacher assignments.
          </p>
        </div>
      </div>

      {/* Metrics Row */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm flex items-center justify-between">
          <div className="space-y-1">
            <p className="text-xs font-semibold text-slate-500">Active Batches</p>
            <h3 className="text-2xl font-black text-slate-900">{batches.length}</h3>
          </div>
          <div className="w-12 h-12 rounded-2xl bg-purple-100 text-purple-700 flex items-center justify-center">
            <BookOpen className="w-6 h-6" />
          </div>
        </div>

        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm flex items-center justify-between">
          <div className="space-y-1">
            <p className="text-xs font-semibold text-slate-500">Total Enrolled</p>
            <h3 className="text-2xl font-black text-purple-700">
              {batches.reduce((acc, b) => acc + (b.enrolledCount || 0), 0)}
            </h3>
          </div>
          <div className="w-12 h-12 rounded-2xl bg-sky-100 text-sky-700 flex items-center justify-center">
            <Users className="w-6 h-6" />
          </div>
        </div>

        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm flex items-center justify-between">
          <div className="space-y-1">
            <p className="text-xs font-semibold text-slate-500">Fee Collected</p>
            <h3 className="text-2xl font-black text-emerald-600">₹{totalRevenue.toLocaleString()}</h3>
          </div>
          <div className="w-12 h-12 rounded-2xl bg-emerald-100 text-emerald-700 flex items-center justify-center">
            <CreditCard className="w-6 h-6" />
          </div>
        </div>

        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm flex items-center justify-between">
          <div className="space-y-1">
            <p className="text-xs font-semibold text-slate-500">System Notices</p>
            <h3 className="text-2xl font-black text-amber-600">{notices.length}</h3>
          </div>
          <div className="w-12 h-12 rounded-2xl bg-amber-100 text-amber-700 flex items-center justify-center">
            <Bell className="w-6 h-6" />
          </div>
        </div>
      </div>

      {/* Main Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Left Column: Manage Batches Quick Overview */}
        <div className="lg:col-span-2 space-y-6">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-extrabold text-slate-900 flex items-center space-x-2">
              <BookOpen className="w-5 h-5 text-purple-600" />
              <span>Platform Batches</span>
            </h2>
            <Link to="/admin/batches" className="inline-flex items-center space-x-1 bg-amber-400 hover:bg-amber-300 text-slate-950 px-4 py-2 rounded-full text-xs font-bold shadow-sm">
              <Plus className="w-3.5 h-3.5" />
              <span>Create New Batch</span>
            </Link>
          </div>

          {loading ? (
            <div className="p-8 bg-white rounded-2xl text-center text-xs text-slate-400 font-semibold animate-pulse">
              Loading batches...
            </div>
          ) : batches.length === 0 ? (
            <div className="p-10 bg-white rounded-2xl border border-slate-200 text-center text-xs text-slate-400 font-medium">
              No batches created yet.
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              {batches.map((b) => (
                <div key={b._id} className="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-sm space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-bold uppercase tracking-wider bg-purple-100 text-purple-800 px-2.5 py-1 rounded-full">
                      {b.subject}
                    </span>
                    <span className="text-[10px] font-bold bg-emerald-100 text-emerald-800 px-2.5 py-1 rounded-full capitalize">
                      {b.status}
                    </span>
                  </div>

                  <h3 className="text-sm font-extrabold text-slate-900">{b.name}</h3>
                  <p className="text-xs text-slate-500">Teacher: {b.teacher?.name || 'Assigned'}</p>

                  <div className="text-xs text-slate-500 pt-2 border-t border-slate-100 flex items-center justify-between font-bold">
                    <span>Fee: ₹{b.fee}</span>
                    <span>Enrolled: {b.enrolledCount || 0} / {b.capacity}</span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Right Column: Quick Links */}
        <div className="space-y-6">
          <h2 className="text-lg font-extrabold text-slate-900">Admin Actions</h2>

          <div className="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-sm space-y-3">
            <Link to="/admin/courses" className="w-full bg-cyan-400 hover:bg-cyan-300 text-slate-950 font-extrabold p-3.5 rounded-xl text-xs flex items-center justify-between shadow-md">
              <span>Publish & Manage Platform Courses</span>
              <ArrowRight className="w-4 h-4" />
            </Link>

            <Link to="/admin/batches" className="w-full bg-slate-900 hover:bg-slate-800 text-white font-bold p-3.5 rounded-xl text-xs flex items-center justify-between">
              <span>Manage Batches & Schedules</span>
              <ArrowRight className="w-4 h-4 text-cyan-400" />
            </Link>

            <Link to="/admin/enrollments" className="w-full bg-slate-900 hover:bg-slate-800 text-white font-bold p-3.5 rounded-xl text-xs flex items-center justify-between">
              <span>Student Enrollments</span>
              <ArrowRight className="w-4 h-4 text-cyan-400" />
            </Link>

            <Link to="/admin/payments" className="w-full bg-slate-900 hover:bg-slate-800 text-white font-bold p-3.5 rounded-xl text-xs flex items-center justify-between">
              <span>Razorpay Payments History</span>
              <ArrowRight className="w-4 h-4 text-cyan-400" />
            </Link>

            <Link to="/admin/notices" className="w-full bg-slate-900 hover:bg-slate-800 text-white font-bold p-3.5 rounded-xl text-xs flex items-center justify-between">
              <span>Broadcast System Notice</span>
              <ArrowRight className="w-4 h-4 text-cyan-400" />
            </Link>
          </div>
        </div>

      </div>

    </div>
  );
}
