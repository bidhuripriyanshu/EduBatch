import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { 
  BookOpen, 
  CheckCircle2, 
  Clock, 
  CreditCard, 
  Bell, 
  Calendar, 
  Sparkles, 
  ArrowRight,
  User,
  AlertCircle
} from 'lucide-react';
import { useAuth } from '../../hooks/useAuth';
import { enrollmentApi } from '../../api/enrollmentApi';
import { attendanceApi } from '../../api/attendanceApi';
import { noticeApi } from '../../api/noticeApi';

export default function StudentDashboard() {
  const { user } = useAuth();
  const [enrollments, setEnrollments] = useState([]);
  const [attendanceStats, setAttendanceStats] = useState(null);
  const [notices, setNotices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchDashboardData = async () => {
      setLoading(true);
      try {
        const [enrollRes, attendRes, noticeRes] = await Promise.allSettled([
          enrollmentApi.getMyEnrollments(),
          attendanceApi.getMyAttendance(),
          noticeApi.getNotices(),
        ]);

        if (enrollRes.status === 'fulfilled') {
          setEnrollments(enrollRes.value.data?.enrollments || []);
        }
        if (attendRes.status === 'fulfilled') {
          setAttendanceStats(attendRes.value.data?.stats || null);
        }
        if (noticeRes.status === 'fulfilled') {
          setNotices(noticeRes.value.data?.notices || []);
        }
      } catch (err) {
        setError('Failed to load dashboard metrics');
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  return (
    <div className="min-h-screen bg-slate-50 p-6 lg:p-10 space-y-8">
      
      {/* Welcome Banner */}
      <div className="bg-gradient-to-r from-purple-950 via-indigo-900 to-purple-900 text-white rounded-3xl p-8 lg:p-10 shadow-xl relative overflow-hidden">
        <div className="relative z-10 space-y-3">
          <div className="inline-flex items-center space-x-2 bg-purple-800/60 border border-purple-600/50 px-3.5 py-1 rounded-full text-xs font-semibold text-cyan-300">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Student Dashboard</span>
          </div>
          <h1 className="text-3xl lg:text-4xl font-extrabold tracking-tight">
            Welcome back, <span className="text-cyan-300">{user?.name || 'Student'}</span>! 👋
          </h1>
          <p className="text-purple-200 text-xs md:text-sm max-w-xl leading-relaxed">
            Track your enrolled batches, view upcoming class schedules, monitor attendance, and make fee payments seamlessly.
          </p>
        </div>
      </div>

      {/* Metrics Row */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        
        {/* Metric 1: Enrolled Batches */}
        <div className="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-sm flex items-center justify-between">
          <div className="space-y-1">
            <p className="text-xs font-semibold text-slate-500">Enrolled Batches</p>
            <h3 className="text-2xl font-black text-slate-900">{enrollments.length}</h3>
          </div>
          <div className="w-12 h-12 rounded-2xl bg-purple-100 text-purple-700 flex items-center justify-center">
            <BookOpen className="w-6 h-6" />
          </div>
        </div>

        {/* Metric 2: Attendance Percentage */}
        <div className="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-sm flex items-center justify-between">
          <div className="space-y-1">
            <p className="text-xs font-semibold text-slate-500">Attendance Rate</p>
            <h3 className="text-2xl font-black text-emerald-600">
              {attendanceStats ? attendanceStats.attendancePercentage : '100%'}
            </h3>
          </div>
          <div className="w-12 h-12 rounded-2xl bg-emerald-100 text-emerald-700 flex items-center justify-center">
            <CheckCircle2 className="w-6 h-6" />
          </div>
        </div>

        {/* Metric 3: Active Notices */}
        <div className="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-sm flex items-center justify-between">
          <div className="space-y-1">
            <p className="text-xs font-semibold text-slate-500">Batch Notices</p>
            <h3 className="text-2xl font-black text-amber-600">{notices.length}</h3>
          </div>
          <div className="w-12 h-12 rounded-2xl bg-amber-100 text-amber-700 flex items-center justify-center">
            <Bell className="w-6 h-6" />
          </div>
        </div>

        {/* Metric 4: Total Classes Attended */}
        <div className="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-sm flex items-center justify-between">
          <div className="space-y-1">
            <p className="text-xs font-semibold text-slate-500">Classes Attended</p>
            <h3 className="text-2xl font-black text-sky-600">
              {attendanceStats ? attendanceStats.presentCount : 0} / {attendanceStats ? attendanceStats.totalClasses : 0}
            </h3>
          </div>
          <div className="w-12 h-12 rounded-2xl bg-sky-100 text-sky-700 flex items-center justify-center">
            <Calendar className="w-6 h-6" />
          </div>
        </div>

      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Left Column: My Enrolled Batches */}
        <div className="lg:col-span-2 space-y-6">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-extrabold text-slate-900 flex items-center space-x-2">
              <BookOpen className="w-5 h-5 text-purple-600" />
              <span>My Enrolled Batches</span>
            </h2>
            <Link to="/student/batches" className="text-xs font-bold text-cyan-600 hover:underline">
              View All
            </Link>
          </div>

          {loading ? (
            <div className="p-8 bg-white rounded-2xl text-center text-xs text-slate-400 font-semibold animate-pulse">
              Loading enrolled batches...
            </div>
          ) : enrollments.length === 0 ? (
            <div className="p-10 bg-white rounded-2xl border border-slate-200 text-center space-y-3">
              <BookOpen className="w-10 h-10 text-slate-300 mx-auto" />
              <p className="text-xs text-slate-500 font-medium">You are not enrolled in any batch yet.</p>
              <Link to="/courses" className="inline-flex items-center space-x-2 bg-purple-900 text-cyan-300 px-5 py-2.5 rounded-full text-xs font-bold shadow-md hover:bg-purple-800">
                <span>Browse Courses Catalog</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {enrollments.map((item) => {
                const batch = item.batch;
                return (
                  <div key={item._id} className="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-sm space-y-4 hover:shadow-md transition-shadow">
                    <div className="flex items-center justify-between">
                      <span className="text-[10px] font-bold uppercase tracking-wider bg-purple-100 text-purple-800 px-2.5 py-1 rounded-full">
                        {batch?.subject || 'Batch'}
                      </span>
                      <span className={`text-[10px] font-bold px-2.5 py-1 rounded-full ${
                        item.paymentStatus === 'paid' ? 'bg-emerald-100 text-emerald-800' : 'bg-amber-100 text-amber-800'
                      }`}>
                        {item.paymentStatus === 'paid' ? 'Fee Paid' : 'Payment Pending'}
                      </span>
                    </div>

                    <h3 className="text-sm font-extrabold text-slate-900 leading-snug">{batch?.name}</h3>

                    <div className="text-xs text-slate-500 space-y-1.5 pt-1 border-t border-slate-100">
                      <div className="flex items-center space-x-2">
                        <User className="w-3.5 h-3.5 text-slate-400" />
                        <span>Teacher: {batch?.teacher?.name || 'Assigned Instructor'}</span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Clock className="w-3.5 h-3.5 text-slate-400" />
                        <span>{batch?.schedule?.startTime || '09:00 AM'} - {batch?.schedule?.endTime || '11:00 AM'}</span>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Right Column: Latest Notices & Announcements */}
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-extrabold text-slate-900 flex items-center space-x-2">
              <Bell className="w-5 h-5 text-amber-500" />
              <span>Latest Notices</span>
            </h2>
            <Link to="/student/notices" className="text-xs font-bold text-cyan-600 hover:underline">
              All Notices
            </Link>
          </div>

          {notices.length === 0 ? (
            <div className="p-8 bg-white rounded-2xl border border-slate-200 text-center text-xs text-slate-400 font-medium">
              No active announcements.
            </div>
          ) : (
            <div className="space-y-4">
              {notices.slice(0, 3).map((notice) => (
                <div key={notice._id} className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-sm space-y-2">
                  <div className="flex items-center justify-between">
                    <h4 className="text-xs font-extrabold text-slate-900">{notice.title}</h4>
                    {notice.pinned && (
                      <span className="text-[10px] font-bold bg-amber-100 text-amber-800 px-2 py-0.5 rounded">Pinned</span>
                    )}
                  </div>
                  <p className="text-xs text-slate-600 leading-relaxed line-clamp-2">{notice.body}</p>
                  <p className="text-[10px] text-slate-400 pt-1 font-semibold">By: {notice.createdBy?.name || 'Instructor'}</p>
                </div>
              ))}
            </div>
          )}
        </div>

      </div>

    </div>
  );
}
