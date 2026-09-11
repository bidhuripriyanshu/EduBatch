import React, { useEffect, useState } from 'react';
import { Bell, Pin, Calendar, User } from 'lucide-react';
import { noticeApi } from '../../api/noticeApi';

export default function StudentNotices() {
  const [notices, setNotices] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchNotices();
  }, []);

  const fetchNotices = async () => {
    setLoading(true);
    try {
      const res = await noticeApi.getNotices();
      setNotices(res.data?.notices || []);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 p-6 lg:p-10 space-y-8">
      <div>
        <h1 className="text-2xl font-black text-slate-900">Batch Notices</h1>
        <p className="text-xs text-slate-500 font-medium">Important announcements, schedule updates, and test alerts from instructors.</p>
      </div>

      {loading ? (
        <div className="p-10 text-center text-xs text-slate-400 font-semibold animate-pulse">Loading announcements...</div>
      ) : notices.length === 0 ? (
        <div className="p-10 bg-white rounded-2xl border border-slate-200 text-center text-xs text-slate-500 font-medium">
          No notices posted yet.
        </div>
      ) : (
        <div className="space-y-4">
          {notices.map((notice) => (
            <div key={notice._id} className="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-sm space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <Bell className="w-4 h-4 text-amber-500" />
                  <h3 className="text-sm font-extrabold text-slate-900">{notice.title}</h3>
                </div>
                {notice.pinned && (
                  <span className="inline-flex items-center space-x-1 text-[10px] font-bold bg-amber-100 text-amber-800 px-2.5 py-0.5 rounded-full">
                    <Pin className="w-3 h-3" />
                    <span>Pinned</span>
                  </span>
                )}
              </div>

              <p className="text-xs text-slate-700 leading-relaxed">{notice.body}</p>

              <div className="text-[11px] text-slate-400 pt-2 border-t border-slate-100 flex items-center justify-between font-medium">
                <span>Author: {notice.createdBy?.name || 'Instructor'} ({notice.createdBy?.role})</span>
                <span>{new Date(notice.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}</span>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
