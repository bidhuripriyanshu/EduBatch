import React, { useEffect, useState } from 'react';
import { Calendar, CheckCircle2, XCircle, Clock, Award } from 'lucide-react';
import { attendanceApi } from '../../api/attendanceApi';

export default function StudentAttendance() {
  const [stats, setStats] = useState(null);
  const [records, setRecords] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchAttendance();
  }, []);

  const fetchAttendance = async () => {
    setLoading(true);
    try {
      const res = await attendanceApi.getMyAttendance();
      setStats(res.data?.stats || null);
      setRecords(res.data?.records || []);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 p-6 lg:p-10 space-y-8">
      <div>
        <h1 className="text-2xl font-black text-slate-900">Attendance Log</h1>
        <p className="text-xs text-slate-500 font-medium">Track your class participation and attendance record across all enrolled batches.</p>
      </div>

      {/* Stats Header */}
      {stats && (
        <div className="grid grid-cols-1 sm:grid-cols-4 gap-6">
          <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm space-y-1">
            <p className="text-xs text-slate-500 font-semibold">Attendance Rate</p>
            <p className="text-2xl font-black text-emerald-600">{stats.attendancePercentage}</p>
          </div>
          <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm space-y-1">
            <p className="text-xs text-slate-500 font-semibold">Total Classes</p>
            <p className="text-2xl font-black text-slate-900">{stats.totalClasses}</p>
          </div>
          <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm space-y-1">
            <p className="text-xs text-slate-500 font-semibold">Classes Attended</p>
            <p className="text-2xl font-black text-emerald-600">{stats.presentCount}</p>
          </div>
          <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm space-y-1">
            <p className="text-xs text-slate-500 font-semibold">Classes Missed</p>
            <p className="text-2xl font-black text-red-500">{stats.absentCount}</p>
          </div>
        </div>
      )}

      {/* Log Table */}
      <div className="bg-white rounded-2xl border border-slate-200/80 shadow-sm overflow-hidden">
        <div className="p-5 border-b border-slate-100 flex items-center justify-between">
          <h3 className="text-sm font-extrabold text-slate-900">Recent Class Attendance</h3>
        </div>

        {loading ? (
          <div className="p-8 text-center text-xs text-slate-400 font-semibold animate-pulse">Loading attendance history...</div>
        ) : records.length === 0 ? (
          <div className="p-10 text-center text-xs text-slate-400 font-medium">No attendance records found yet.</div>
        ) : (
          <div className="divide-y divide-slate-100">
            {records.map((log, idx) => (
              <div key={idx} className="p-4 sm:p-5 flex items-center justify-between hover:bg-slate-50/50">
                <div className="flex items-center space-x-3">
                  <div className={`w-9 h-9 rounded-full flex items-center justify-center font-bold ${
                    log.status === 'present' ? 'bg-emerald-100 text-emerald-700' : 'bg-red-100 text-red-700'
                  }`}>
                    {log.status === 'present' ? <CheckCircle2 className="w-5 h-5" /> : <XCircle className="w-5 h-5" />}
                  </div>
                  <div>
                    <h4 className="text-xs font-bold text-slate-900">{log.batch?.name || 'Class Session'}</h4>
                    <p className="text-[11px] text-slate-400">{new Date(log.date).toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric', year: 'numeric' })}</p>
                  </div>
                </div>
                <span className={`text-[10px] font-extrabold capitalize px-3 py-1 rounded-full ${
                  log.status === 'present' ? 'bg-emerald-100 text-emerald-800' : 'bg-red-100 text-red-800'
                }`}>
                  {log.status}
                </span>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
