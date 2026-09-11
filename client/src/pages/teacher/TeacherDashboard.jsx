import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { BookOpen, Users, Calendar, Bell, Plus, Sparkles, CheckCircle2 } from 'lucide-react';
import { useAuth } from '../../hooks/useAuth';
import { batchApi } from '../../api/batchApi';
import { noticeApi } from '../../api/noticeApi';

export default function TeacherDashboard() {
  const { user } = useAuth();
  const [batches, setBatches] = useState([]);
  const [notices, setNotices] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchTeacherData();
  }, []);

  const fetchTeacherData = async () => {
    setLoading(true);
    try {
      const [batchRes, noticeRes] = await Promise.allSettled([
        batchApi.getBatches({ teacher: user?._id }),
        noticeApi.getNotices(),
      ]);

      if (batchRes.status === 'fulfilled') {
        setBatches(batchRes.value.data?.batches || []);
      }
      if (noticeRes.status === 'fulfilled') {
        setNotices(noticeRes.value.data?.notices || []);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 p-6 lg:p-10 space-y-8">
      
      {/* Banner */}
      <div className="bg-gradient-to-r from-sky-900 via-indigo-900 to-purple-950 text-white rounded-3xl p-8 lg:p-10 shadow-xl relative overflow-hidden">
        <div className="relative z-10 space-y-3">
          <div className="inline-flex items-center space-x-2 bg-sky-800/60 border border-sky-600/50 px-3.5 py-1 rounded-full text-xs font-semibold text-cyan-300">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Teacher Portal</span>
          </div>
          <h1 className="text-3xl lg:text-4xl font-extrabold tracking-tight">
            Welcome, <span className="text-cyan-300">{user?.name || 'Instructor'}</span>! 👨‍🏫
          </h1>
          <p className="text-sky-100 text-xs md:text-sm max-w-xl leading-relaxed">
            Manage your assigned batches, mark daily student attendance, broadcast notices, and review class rosters.
          </p>
        </div>
      </div>

      {/* Metrics */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm flex items-center justify-between">
          <div className="space-y-1">
            <p className="text-xs font-semibold text-slate-500">Assigned Batches</p>
            <h3 className="text-2xl font-black text-slate-900">{batches.length}</h3>
          </div>
          <div className="w-12 h-12 rounded-2xl bg-sky-100 text-sky-700 flex items-center justify-center">
            <BookOpen className="w-6 h-6" />
          </div>
        </div>

        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm flex items-center justify-between">
          <div className="space-y-1">
            <p className="text-xs font-semibold text-slate-500">Total Students</p>
            <h3 className="text-2xl font-black text-purple-700">
              {batches.reduce((acc, b) => acc + (b.enrolledCount || 0), 0)}
            </h3>
          </div>
          <div className="w-12 h-12 rounded-2xl bg-purple-100 text-purple-700 flex items-center justify-center">
            <Users className="w-6 h-6" />
          </div>
        </div>

        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm flex items-center justify-between">
          <div className="space-y-1">
            <p className="text-xs font-semibold text-slate-500">Notices Posted</p>
            <h3 className="text-2xl font-black text-amber-600">{notices.length}</h3>
          </div>
          <div className="w-12 h-12 rounded-2xl bg-amber-100 text-amber-700 flex items-center justify-center">
            <Bell className="w-6 h-6" />
          </div>
        </div>
      </div>

      {/* Main Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Left Column: Assigned Batches */}
        <div className="lg:col-span-2 space-y-6">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-extrabold text-slate-900 flex items-center space-x-2">
              <BookOpen className="w-5 h-5 text-sky-600" />
              <span>Assigned Batches</span>
            </h2>
            <Link to="/teacher/attendance" className="inline-flex items-center space-x-1.5 bg-sky-500 hover:bg-sky-400 text-slate-950 px-4 py-2 rounded-full text-xs font-bold shadow-sm">
              <Calendar className="w-3.5 h-3.5" />
              <span>Mark Attendance</span>
            </Link>
          </div>

          {loading ? (
            <div className="p-8 bg-white rounded-2xl text-center text-xs text-slate-400 font-semibold animate-pulse">
              Loading assigned batches...
            </div>
          ) : batches.length === 0 ? (
            <div className="p-10 bg-white rounded-2xl border border-slate-200 text-center text-xs text-slate-400 font-medium">
              No batches assigned to you yet.
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              {batches.map((batch) => (
                <div key={batch._id} className="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-sm space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-bold uppercase tracking-wider bg-sky-100 text-sky-800 px-3 py-1 rounded-full">
                      {batch.subject}
                    </span>
                    <span className="text-[10px] font-bold bg-emerald-100 text-emerald-800 px-2.5 py-1 rounded-full capitalize">
                      {batch.status}
                    </span>
                  </div>

                  <h3 className="text-sm font-extrabold text-slate-900">{batch.name}</h3>

                  <div className="text-xs text-slate-500 pt-2 border-t border-slate-100 flex items-center justify-between font-medium">
                    <span>Enrolled: {batch.enrolledCount || 0} / {batch.capacity}</span>
                    <span>Timing: {batch.schedule?.startTime || '07:00 AM'}</span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Right Column: Broadcast Notice CTA */}
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-extrabold text-slate-900 flex items-center space-x-2">
              <Bell className="w-5 h-5 text-amber-500" />
              <span>Broadcast Notice</span>
            </h2>
            <Link to="/teacher/notices" className="text-xs font-bold text-sky-600 hover:underline">
              Create Notice
            </Link>
          </div>

          <div className="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-sm space-y-4">
            <p className="text-xs text-slate-600 leading-relaxed font-medium">
              Post important test announcements, class cancellations, or study material links to your students.
            </p>
            <Link to="/teacher/notices" className="w-full bg-purple-900 hover:bg-purple-800 text-cyan-300 font-bold py-3 rounded-xl text-xs shadow-md transition-all flex items-center justify-center space-x-2">
              <Plus className="w-4 h-4" />
              <span>Post New Batch Notice</span>
            </Link>
          </div>
        </div>

      </div>

    </div>
  );
}
