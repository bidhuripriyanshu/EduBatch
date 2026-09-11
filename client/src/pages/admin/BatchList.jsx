import React, { useEffect, useState } from 'react';
import { Plus, BookOpen, User, Clock, Trash2, Edit2, ShieldCheck } from 'lucide-react';
import { batchApi } from '../../api/batchApi';
import { authApi } from '../../api/authApi';

export default function BatchList() {
  const [batches, setBatches] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [message, setMessage] = useState('');

  // Form State
  const [name, setName] = useState('');
  const [subject, setSubject] = useState('Physics');
  const [description, setDescription] = useState('');
  const [capacity, setCapacity] = useState(40);
  const [fee, setFee] = useState(14999);
  const [teacher, setTeacher] = useState('6aa12e36aceddf9f6fb1d594'); // Default teacher ID from seed
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    fetchBatches();
  }, []);

  const fetchBatches = async () => {
    setLoading(true);
    try {
      const res = await batchApi.getBatches();
      setBatches(res.data?.batches || []);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleCreateBatch = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    setMessage('');

    try {
      await batchApi.createBatch({
        name,
        subject,
        description,
        capacity: Number(capacity),
        fee: Number(fee),
        teacher,
        status: 'upcoming',
        schedule: {
          days: ['Mon', 'Wed', 'Fri'],
          startTime: '07:00 AM',
          endTime: '09:30 AM',
        },
      });

      setMessage(`Batch "${name}" created successfully!`);
      setShowForm(false);
      setName('');
      setDescription('');
      fetchBatches();
    } catch (err) {
      setMessage(err?.message || 'Failed to create batch');
    } finally {
      setSubmitting(false);
    }
  };

  const handleStatusChange = async (batchId, status) => {
    try {
      await batchApi.changeBatchStatus(batchId, status);
      fetchBatches();
    } catch (err) {
      console.error(err);
    }
  };

  const handleArchive = async (batchId) => {
    if (!window.confirm('Are you sure you want to soft archive this batch?')) return;
    try {
      await batchApi.archiveBatch(batchId);
      fetchBatches();
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 p-6 lg:p-10 space-y-8">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black text-slate-900">Manage Batches</h1>
          <p className="text-xs text-slate-500 font-medium">Create, edit schedules, assign teachers, and archive batches.</p>
        </div>

        <button
          onClick={() => setShowForm(!showForm)}
          className="bg-amber-400 hover:bg-amber-300 text-slate-950 font-bold px-6 py-2.5 rounded-full text-xs shadow-md transition-all flex items-center space-x-2 shrink-0 cursor-pointer"
        >
          <Plus className="w-4 h-4" />
          <span>{showForm ? 'Cancel Form' : 'Create New Batch'}</span>
        </button>
      </div>

      {message && (
        <div className="p-4 bg-emerald-500/10 border border-emerald-500/30 text-emerald-700 text-xs font-semibold rounded-2xl flex items-center space-x-2">
          <ShieldCheck className="w-5 h-5 text-emerald-600" />
          <span>{message}</span>
        </div>
      )}

      {/* Create Form */}
      {showForm && (
        <form onSubmit={handleCreateBatch} className="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-md space-y-4">
          <h3 className="text-sm font-extrabold text-slate-900">Create New Batch</h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-extrabold text-slate-700 mb-1">Batch Name</label>
              <input
                type="text"
                placeholder="e.g. JEE 2027 Morning Rank Booster"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full px-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium text-slate-900 focus:outline-none focus:ring-2 focus:ring-amber-400"
                required
              />
            </div>

            <div>
              <label className="block text-xs font-extrabold text-slate-700 mb-1">Subject</label>
              <input
                type="text"
                placeholder="e.g. Physics & Mathematics"
                value={subject}
                onChange={(e) => setSubject(e.target.value)}
                className="w-full px-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium text-slate-900 focus:outline-none focus:ring-2 focus:ring-amber-400"
                required
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className="block text-xs font-extrabold text-slate-700 mb-1">Capacity (Max Students)</label>
              <input
                type="number"
                value={capacity}
                onChange={(e) => setCapacity(e.target.value)}
                className="w-full px-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium text-slate-900 focus:outline-none focus:ring-2 focus:ring-amber-400"
                required
              />
            </div>

            <div>
              <label className="block text-xs font-extrabold text-slate-700 mb-1">Batch Fee (INR)</label>
              <input
                type="number"
                value={fee}
                onChange={(e) => setFee(e.target.value)}
                className="w-full px-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium text-slate-900 focus:outline-none focus:ring-2 focus:ring-amber-400"
                required
              />
            </div>

            <div>
              <label className="block text-xs font-extrabold text-slate-700 mb-1">Assigned Teacher ID</label>
              <input
                type="text"
                value={teacher}
                onChange={(e) => setTeacher(e.target.value)}
                className="w-full px-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-mono text-slate-900 focus:outline-none focus:ring-2 focus:ring-amber-400"
                required
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-extrabold text-slate-700 mb-1">Description</label>
            <textarea
              rows="2"
              placeholder="Batch details and course description..."
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full px-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium text-slate-900 focus:outline-none focus:ring-2 focus:ring-amber-400"
            ></textarea>
          </div>

          <button
            type="submit"
            disabled={submitting}
            className="bg-purple-900 hover:bg-purple-800 text-cyan-300 font-bold px-6 py-2.5 rounded-xl text-xs shadow-md transition-all cursor-pointer"
          >
            {submitting ? 'Creating Batch...' : 'Save & Publish Batch'}
          </button>
        </form>
      )}

      {/* Batches Table */}
      <div className="bg-white rounded-2xl border border-slate-200/80 shadow-sm overflow-hidden">
        <div className="p-5 border-b border-slate-100 flex items-center justify-between">
          <h3 className="text-sm font-extrabold text-slate-900">All Batches ({batches.length})</h3>
        </div>

        {loading ? (
          <div className="p-8 text-center text-xs text-slate-400 font-semibold animate-pulse">Loading batches...</div>
        ) : batches.length === 0 ? (
          <div className="p-10 text-center text-xs text-slate-400 font-medium">No batches found.</div>
        ) : (
          <div className="divide-y divide-slate-100">
            {batches.map((batch) => (
              <div key={batch._id} className="p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4 hover:bg-slate-50/50">
                <div className="space-y-1">
                  <div className="flex items-center space-x-2">
                    <span className="text-[10px] font-bold uppercase tracking-wider bg-purple-100 text-purple-800 px-2.5 py-0.5 rounded-full">
                      {batch.subject}
                    </span>
                    <h4 className="text-xs font-extrabold text-slate-900">{batch.name}</h4>
                  </div>
                  <p className="text-[11px] text-slate-500">Teacher: {batch.teacher?.name || 'Assigned Instructor'}</p>
                  <p className="text-[11px] text-slate-400">Enrolled: {batch.enrolledCount || 0} / {batch.capacity} | Fee: ₹{batch.fee}</p>
                </div>

                <div className="flex items-center space-x-2 shrink-0">
                  <select
                    value={batch.status}
                    onChange={(e) => handleStatusChange(batch._id, e.target.value)}
                    className="px-3 py-1.5 bg-slate-100 border border-slate-200 rounded-lg text-xs font-bold text-slate-700 capitalize focus:outline-none"
                  >
                    <option value="upcoming">Upcoming</option>
                    <option value="active">Active</option>
                    <option value="archived">Archived</option>
                  </select>

                  <button
                    onClick={() => handleArchive(batch._id)}
                    className="p-2 text-slate-400 hover:text-red-600 rounded-lg hover:bg-red-50 transition-colors"
                    title="Soft Archive"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
