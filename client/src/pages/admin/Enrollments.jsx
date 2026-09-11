import React, { useEffect, useState } from 'react';
import { Plus, Users, BookOpen, ShieldCheck, CheckCircle2 } from 'lucide-react';
import { batchApi } from '../../api/batchApi';
import { enrollmentApi } from '../../api/enrollmentApi';

export default function Enrollments() {
  const [batches, setBatches] = useState([]);
  const [selectedBatchId, setSelectedBatchId] = useState('');
  const [enrollments, setEnrollments] = useState([]);
  const [studentIdInput, setStudentIdInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [enrolling, setEnrolling] = useState(false);
  const [message, setMessage] = useState('');

  useEffect(() => {
    fetchBatches();
  }, []);

  const fetchBatches = async () => {
    try {
      const res = await batchApi.getBatches();
      const list = res.data?.batches || [];
      setBatches(list);
      if (list.length > 0) {
        setSelectedBatchId(list[0]._id);
        fetchEnrollments(list[0]._id);
      }
    } catch (err) {
      console.error(err);
    }
  };

  const fetchEnrollments = async (batchId) => {
    setLoading(true);
    try {
      const res = await enrollmentApi.getBatchEnrollments(batchId);
      setEnrollments(res.data?.enrollments || []);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleEnrollStudent = async (e) => {
    e.preventDefault();
    if (!selectedBatchId || !studentIdInput) return;

    setEnrolling(true);
    setMessage('');
    try {
      await enrollmentApi.enrollStudent({
        studentId: studentIdInput,
        batchId: selectedBatchId,
      });

      setMessage('Student enrolled into batch successfully!');
      setStudentIdInput('');
      fetchEnrollments(selectedBatchId);
    } catch (err) {
      setMessage(err?.message || 'Failed to enroll student');
    } finally {
      setEnrolling(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 p-6 lg:p-10 space-y-8">
      <div>
        <h1 className="text-2xl font-black text-slate-900">Student Enrollments</h1>
        <p className="text-xs text-slate-500 font-medium">Manage student batch memberships and manual enrollments.</p>
      </div>

      {message && (
        <div className="p-4 bg-emerald-500/10 border border-emerald-500/30 text-emerald-700 text-xs font-semibold rounded-2xl flex items-center space-x-2">
          <ShieldCheck className="w-5 h-5 text-emerald-600" />
          <span>{message}</span>
        </div>
      )}

      {/* Enroll Form */}
      <form onSubmit={handleEnrollStudent} className="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-sm space-y-4">
        <h3 className="text-sm font-extrabold text-slate-900">Enroll Student into Batch</h3>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-extrabold text-slate-700 mb-1">Select Batch</label>
            <select
              value={selectedBatchId}
              onChange={(e) => {
                setSelectedBatchId(e.target.value);
                fetchEnrollments(e.target.value);
              }}
              className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold text-slate-900 focus:outline-none focus:ring-2 focus:ring-amber-400"
            >
              {batches.map((b) => (
                <option key={b._id} value={b._id}>
                  {b.name} ({b.subject})
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-xs font-extrabold text-slate-700 mb-1">Student User ID</label>
            <input
              type="text"
              placeholder="e.g. 6aa12e37aceddf9f6fb1d595"
              value={studentIdInput}
              onChange={(e) => setStudentIdInput(e.target.value)}
              className="w-full px-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-mono text-slate-900 focus:outline-none focus:ring-2 focus:ring-amber-400"
              required
            />
          </div>
        </div>

        <button
          type="submit"
          disabled={enrolling}
          className="bg-purple-900 hover:bg-purple-800 text-cyan-300 font-bold px-6 py-2.5 rounded-xl text-xs shadow-md transition-all cursor-pointer"
        >
          {enrolling ? 'Enrolling...' : 'Enroll Student'}
        </button>
      </form>

      {/* Enrollments Roster */}
      <div className="bg-white rounded-2xl border border-slate-200/80 shadow-sm overflow-hidden">
        <div className="p-5 border-b border-slate-100 flex items-center justify-between">
          <h3 className="text-sm font-extrabold text-slate-900">Enrolled Students ({enrollments.length})</h3>
        </div>

        {loading ? (
          <div className="p-8 text-center text-xs text-slate-400 font-semibold animate-pulse">Loading enrollments...</div>
        ) : enrollments.length === 0 ? (
          <div className="p-10 text-center text-xs text-slate-400 font-medium">No enrollments in this batch yet.</div>
        ) : (
          <div className="divide-y divide-slate-100">
            {enrollments.map((item) => (
              <div key={item._id} className="p-5 flex items-center justify-between hover:bg-slate-50/50">
                <div className="space-y-0.5">
                  <h4 className="text-xs font-extrabold text-slate-900">{item.student?.name || 'Student'}</h4>
                  <p className="text-[11px] text-slate-500">{item.student?.email}</p>
                </div>

                <span className={`text-[10px] font-extrabold uppercase px-3 py-1 rounded-full ${
                  item.paymentStatus === 'paid' ? 'bg-emerald-100 text-emerald-800' : 'bg-amber-100 text-amber-800'
                }`}>
                  {item.paymentStatus}
                </span>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
