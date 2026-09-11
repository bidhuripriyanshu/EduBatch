import React, { useEffect, useState } from 'react';
import { CheckCircle2, XCircle, Clock, Calendar, ShieldCheck, User } from 'lucide-react';
import { batchApi } from '../../api/batchApi';
import { enrollmentApi } from '../../api/enrollmentApi';
import { attendanceApi } from '../../api/attendanceApi';

export default function TeacherAttendance() {
  const [batches, setBatches] = useState([]);
  const [selectedBatchId, setSelectedBatchId] = useState('');
  const [students, setStudents] = useState([]);
  const [records, setRecords] = useState({});
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
  const [loading, setLoading] = useState(false);
  const [submitting, setSubmitting] = useState(false);
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
        fetchBatchStudents(list[0]._id);
      }
    } catch (err) {
      console.error(err);
    }
  };

  const fetchBatchStudents = async (batchId) => {
    setLoading(true);
    try {
      const res = await enrollmentApi.getBatchEnrollments(batchId);
      const enrollList = res.data?.enrollments || [];
      const studentList = enrollList.map((e) => e.student).filter(Boolean);
      setStudents(studentList);

      // Default all to present
      const initialRecords = {};
      studentList.forEach((s) => {
        initialRecords[s._id] = 'present';
      });
      setRecords(initialRecords);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleBatchChange = (e) => {
    const bId = e.target.value;
    setSelectedBatchId(bId);
    fetchBatchStudents(bId);
  };

  const handleStatusToggle = (studentId, status) => {
    setRecords((prev) => ({ ...prev, [studentId]: status }));
  };

  const handleSubmitAttendance = async () => {
    if (!selectedBatchId || students.length === 0) return;
    setSubmitting(true);
    setMessage('');

    const recordsArray = Object.keys(records).map((sId) => ({
      student: sId,
      status: records[sId],
    }));

    try {
      await attendanceApi.markAttendance({
        batchId: selectedBatchId,
        date,
        records: recordsArray,
      });

      setMessage('Attendance marked and recorded successfully in database!');
    } catch (err) {
      setMessage(err?.message || 'Failed to submit attendance');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 p-6 lg:p-10 space-y-8">
      <div>
        <h1 className="text-2xl font-black text-slate-900">Mark Batch Attendance</h1>
        <p className="text-xs text-slate-500 font-medium">Select batch and mark student participation for the session.</p>
      </div>

      {message && (
        <div className="p-4 bg-emerald-500/10 border border-emerald-500/30 text-emerald-700 text-xs font-semibold rounded-2xl flex items-center space-x-2">
          <ShieldCheck className="w-5 h-5 text-emerald-600" />
          <span>{message}</span>
        </div>
      )}

      {/* Selectors */}
      <div className="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-sm grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-xs font-extrabold text-slate-700 mb-1">Select Batch</label>
          <select
            value={selectedBatchId}
            onChange={handleBatchChange}
            className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold text-slate-800 focus:outline-none focus:ring-2 focus:ring-sky-400"
          >
            {batches.map((b) => (
              <option key={b._id} value={b._id}>
                {b.name} ({b.subject})
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-xs font-extrabold text-slate-700 mb-1">Attendance Date</label>
          <input
            type="date"
            value={date}
            onChange={(e) => setDate(e.target.value)}
            className="w-full px-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold text-slate-800 focus:outline-none focus:ring-2 focus:ring-sky-400"
          />
        </div>
      </div>

      {/* Student List */}
      <div className="bg-white rounded-2xl border border-slate-200/80 shadow-sm overflow-hidden space-y-4">
        <div className="p-5 border-b border-slate-100 flex items-center justify-between">
          <h3 className="text-sm font-extrabold text-slate-900">Enrolled Student Roster ({students.length})</h3>
          <button
            onClick={handleSubmitAttendance}
            disabled={submitting || students.length === 0}
            className="bg-sky-500 hover:bg-sky-400 text-slate-950 font-bold px-6 py-2.5 rounded-full text-xs shadow-md transition-all cursor-pointer"
          >
            {submitting ? 'Submitting...' : 'Save Attendance'}
          </button>
        </div>

        {loading ? (
          <div className="p-8 text-center text-xs text-slate-400 font-semibold animate-pulse">Loading batch roster...</div>
        ) : students.length === 0 ? (
          <div className="p-10 text-center text-xs text-slate-400 font-medium">No students enrolled in this batch.</div>
        ) : (
          <div className="divide-y divide-slate-100 p-2">
            {students.map((student) => (
              <div key={student._id} className="p-4 flex items-center justify-between hover:bg-slate-50/50">
                <div className="flex items-center space-x-3">
                  <div className="w-8 h-8 rounded-full bg-purple-100 text-purple-700 flex items-center justify-center font-bold text-xs">
                    <User className="w-4 h-4" />
                  </div>
                  <div>
                    <h4 className="text-xs font-bold text-slate-900">{student.name}</h4>
                    <p className="text-[10px] text-slate-400">{student.email}</p>
                  </div>
                </div>

                <div className="flex items-center space-x-2">
                  <button
                    type="button"
                    onClick={() => handleStatusToggle(student._id, 'present')}
                    className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                      records[student._id] === 'present' ? 'bg-emerald-500 text-white shadow-sm' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                    }`}
                  >
                    Present
                  </button>
                  <button
                    type="button"
                    onClick={() => handleStatusToggle(student._id, 'absent')}
                    className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                      records[student._id] === 'absent' ? 'bg-red-500 text-white shadow-sm' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                    }`}
                  >
                    Absent
                  </button>
                  <button
                    type="button"
                    onClick={() => handleStatusToggle(student._id, 'late')}
                    className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                      records[student._id] === 'late' ? 'bg-amber-500 text-white shadow-sm' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                    }`}
                  >
                    Late
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
