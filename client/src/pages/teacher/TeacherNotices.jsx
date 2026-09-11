import React, { useEffect, useState } from 'react';
import { Bell, Plus, Pin, ShieldCheck } from 'lucide-react';
import { batchApi } from '../../api/batchApi';
import { noticeApi } from '../../api/noticeApi';

export default function TeacherNotices() {
  const [notices, setNotices] = useState([]);
  const [batches, setBatches] = useState([]);
  const [title, setTitle] = useState('');
  const [body, setBody] = useState('');
  const [selectedBatchId, setSelectedBatchId] = useState('');
  const [pinned, setPinned] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [message, setMessage] = useState('');

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const [noticeRes, batchRes] = await Promise.all([
        noticeApi.getNotices(),
        batchApi.getBatches(),
      ]);
      setNotices(noticeRes.data?.notices || []);
      setBatches(batchRes.data?.batches || []);
    } catch (err) {
      console.error(err);
    }
  };

  const handlePostNotice = async (e) => {
    e.preventDefault();
    if (!title || !body) return;

    setSubmitting(true);
    setMessage('');
    try {
      await noticeApi.createNotice({
        title,
        body,
        batchId: selectedBatchId || null,
        pinned,
      });

      setMessage('Notice published successfully!');
      setTitle('');
      setBody('');
      setSelectedBatchId('');
      setPinned(false);
      fetchData();
    } catch (err) {
      setMessage(err?.message || 'Failed to post notice');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 p-6 lg:p-10 space-y-8">
      <div>
        <h1 className="text-2xl font-black text-slate-900">Broadcast Batch Notice</h1>
        <p className="text-xs text-slate-500 font-medium">Post announcements, test updates, or syllabus alerts to students.</p>
      </div>

      {message && (
        <div className="p-4 bg-emerald-500/10 border border-emerald-500/30 text-emerald-700 text-xs font-semibold rounded-2xl flex items-center space-x-2">
          <ShieldCheck className="w-5 h-5 text-emerald-600" />
          <span>{message}</span>
        </div>
      )}

      {/* Notice Form */}
      <form onSubmit={handlePostNotice} className="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-sm space-y-4">
        <h3 className="text-sm font-extrabold text-slate-900">Create New Announcement</h3>

        <div>
          <label className="block text-xs font-extrabold text-slate-700 mb-1">Notice Title</label>
          <input
            type="text"
            placeholder="e.g. Physics Mock Test Schedule Change"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-sky-400 font-medium"
            required
          />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-extrabold text-slate-700 mb-1">Target Batch (Optional)</label>
            <select
              value={selectedBatchId}
              onChange={(e) => setSelectedBatchId(e.target.value)}
              className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-sky-400 font-medium"
            >
              <option value="">All Batches (Global Notice)</option>
              {batches.map((b) => (
                <option key={b._id} value={b._id}>
                  {b.name} ({b.subject})
                </option>
              ))}
            </select>
          </div>

          <div className="flex items-center space-x-2 pt-6">
            <input
              type="checkbox"
              id="pinNotice"
              checked={pinned}
              onChange={(e) => setPinned(e.target.checked)}
              className="w-4 h-4 text-sky-600 rounded focus:ring-sky-400 cursor-pointer"
            />
            <label htmlFor="pinNotice" className="text-xs font-bold text-slate-700 cursor-pointer">
              Pin Notice to Top
            </label>
          </div>
        </div>

        <div>
          <label className="block text-xs font-extrabold text-slate-700 mb-1">Content / Body</label>
          <textarea
            rows="3"
            placeholder="Write announcement details here..."
            value={body}
            onChange={(e) => setBody(e.target.value)}
            className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-sky-400 font-medium"
            required
          ></textarea>
        </div>

        <button
          type="submit"
          disabled={submitting}
          className="bg-purple-900 hover:bg-purple-800 text-cyan-300 font-bold px-6 py-3 rounded-xl text-xs shadow-md transition-all cursor-pointer flex items-center space-x-2"
        >
          <Plus className="w-4 h-4" />
          <span>{submitting ? 'Publishing...' : 'Publish Announcement'}</span>
        </button>
      </form>

      {/* Recent Posted Notices */}
      <div className="space-y-4">
        <h3 className="text-sm font-extrabold text-slate-900">Recent Notices ({notices.length})</h3>
        {notices.map((notice) => (
          <div key={notice._id} className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-sm space-y-2">
            <div className="flex items-center justify-between">
              <h4 className="text-xs font-extrabold text-slate-900">{notice.title}</h4>
              {notice.pinned && (
                <span className="text-[10px] font-bold bg-amber-100 text-amber-800 px-2 py-0.5 rounded">Pinned</span>
              )}
            </div>
            <p className="text-xs text-slate-600 leading-relaxed">{notice.body}</p>
            <p className="text-[10px] text-slate-400 pt-1">Target: {notice.batch?.name || 'All Batches'}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
