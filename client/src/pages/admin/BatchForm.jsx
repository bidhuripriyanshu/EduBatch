import React, { useState, useEffect } from 'react';
import { useNavigate, useParams, Link } from 'react-router-dom';
import { 
  BookOpen, 
  ArrowLeft, 
  CheckCircle2, 
  AlertCircle, 
  Loader2, 
  Plus, 
  Calendar, 
  Clock, 
  Users, 
  DollarSign 
} from 'lucide-react';
import { batchApi } from '../../api/batchApi';
import { client } from '../../api/client';

export default function BatchForm() {
  const { id } = useParams();
  const navigate = useNavigate();
  const isEditing = Boolean(id);

  const [teachers, setTeachers] = useState([]);
  const [loading, setLoading] = useState(isEditing);
  const [submitting, setSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  const [formData, setFormData] = useState({
    name: '',
    subject: '',
    category: 'JEE & NEET Prep',
    image: '',
    description: '',
    capacity: 40,
    fee: 9999,
    teacher: '',
    days: ['Mon', 'Wed', 'Fri'],
    startTime: '07:00 AM',
    endTime: '09:30 AM',
  });

  const availableDays = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];

  const categories = [
    'JEE & NEET Prep',
    'Board Exams',
    'Coding Bootcamps',
    'Language Institutes',
    'School Foundation'
  ];

  const presetImages = [
    { label: 'Physics / Math', url: 'https://images.unsplash.com/photo-1636466497217-26a8cbeaf0aa?auto=format&fit=crop&q=80&w=600' },
    { label: 'Chemistry / Bio', url: 'https://images.unsplash.com/photo-1532094349884-543bc11b234d?auto=format&fit=crop&q=80&w=600' },
    { label: 'Board / Math', url: 'https://images.unsplash.com/photo-1509228468518-180dd4864904?auto=format&fit=crop&q=80&w=600' },
    { label: 'Coding / Web', url: 'https://images.unsplash.com/photo-1498050108023-c5249f4df085?auto=format&fit=crop&q=80&w=600' },
    { label: 'Languages', url: 'https://images.unsplash.com/photo-1543269865-cbf427effbad?auto=format&fit=crop&q=80&w=600' },
  ];

  useEffect(() => {
    fetchTeachers();
    if (isEditing) {
      fetchBatchDetails();
    }
  }, [id]);

  const fetchTeachers = async () => {
    try {
      const res = await client.get('/auth/me').catch(() => null);
      if (res?.data?.user) {
        setTeachers([res.data.user]);
      }
    } catch (err) {
      console.warn('Teacher fetch notice:', err);
    }
  };

  const fetchBatchDetails = async () => {
    setLoading(true);
    try {
      const res = await batchApi.getBatchById(id);
      const b = res.data?.batch || res.batch;
      if (b) {
        setFormData({
          name: b.name || '',
          subject: b.subject || '',
          category: b.category || 'JEE & NEET Prep',
          image: b.image || '',
          description: b.description || '',
          capacity: b.capacity || 40,
          fee: b.fee || 9999,
          teacher: b.teacher?._id || b.teacher || '',
          days: b.schedule?.days || ['Mon', 'Wed', 'Fri'],
          startTime: b.schedule?.startTime || '07:00 AM',
          endTime: b.schedule?.endTime || '09:30 AM',
        });
      }
    } catch (err) {
      setErrorMessage('Failed to load batch details');
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleDayToggle = (day) => {
    const current = [...formData.days];
    if (current.includes(day)) {
      setFormData({ ...formData, days: current.filter(d => d !== day) });
    } else {
      setFormData({ ...formData, days: [...current, day] });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMessage('');
    if (!formData.name || !formData.subject || !formData.fee) {
      setErrorMessage('Please fill in Name, Subject, and Fee.');
      return;
    }

    setSubmitting(true);
    try {
      let teacherId = formData.teacher;
      if (!teacherId) {
        const me = await client.get('/auth/me');
        teacherId = me?.data?.user?._id;
      }

      const payload = {
        name: formData.name,
        subject: formData.subject,
        category: formData.category,
        image: formData.image,
        description: formData.description,
        capacity: Number(formData.capacity),
        fee: Number(formData.fee),
        teacher: teacherId,
        schedule: {
          days: formData.days,
          startTime: formData.startTime,
          endTime: formData.endTime,
        },
        status: 'active'
      };

      if (isEditing) {
        await batchApi.updateBatch(id, payload);
      } else {
        await batchApi.createBatch(payload);
      }

      navigate('/admin/batches');
    } catch (err) {
      console.error('Batch save error:', err);
      setErrorMessage(err.message || 'Failed to save batch. Ensure assigned teacher exists.');
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">
        <Loader2 className="w-8 h-8 text-purple-600 animate-spin" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 p-6 lg:p-10 space-y-8">
      
      {/* Header */}
      <div className="flex items-center justify-between">
        <Link 
          to="/admin/batches"
          className="inline-flex items-center space-x-2 text-xs font-bold text-slate-600 hover:text-slate-900 bg-white px-4 py-2 rounded-xl border border-slate-200 shadow-sm"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Batches</span>
        </Link>
      </div>

      <div className="max-w-3xl mx-auto bg-white rounded-3xl p-8 shadow-sm border border-slate-200/80 space-y-6">
        
        <div className="border-b border-slate-100 pb-4 space-y-1">
          <h1 className="text-2xl font-black text-slate-900">
            {isEditing ? 'Edit Batch Configuration ✏️' : 'Create New Active Batch 🚀'}
          </h1>
          <p className="text-xs text-slate-500">
            Fill details below to create an active batch. Active batches immediately display on the student portal.
          </p>
        </div>

        {errorMessage && (
          <div className="p-4 bg-rose-50 border border-rose-200 text-rose-700 text-xs font-bold rounded-2xl flex items-center space-x-2">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>{errorMessage}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-5 text-xs font-medium text-slate-700">
          
          <div>
            <label className="block mb-1.5 font-bold text-slate-900">Batch Name *</label>
            <input
              type="text"
              name="name"
              required
              placeholder="e.g. JEE 2027 Morning Rank Booster"
              value={formData.name}
              onChange={handleChange}
              className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-400 text-xs text-slate-900 font-bold"
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block mb-1.5 font-bold text-slate-900">Category Tag *</label>
              <select
                name="category"
                value={formData.category}
                onChange={handleChange}
                className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-400 text-xs text-slate-900 font-bold"
              >
                {categories.map((cat) => (
                  <option key={cat} value={cat}>{cat}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block mb-1.5 font-bold text-slate-900">Fee Amount (₹) *</label>
              <input
                type="number"
                name="fee"
                required
                placeholder="14999"
                value={formData.fee}
                onChange={handleChange}
                className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-400 text-xs text-slate-900 font-bold"
              />
            </div>
          </div>

          <div>
            <label className="block mb-1.5 font-bold text-slate-900">Custom Course Cover Image URL</label>
            <input
              type="url"
              name="image"
              placeholder="https://images.unsplash.com/..."
              value={formData.image}
              onChange={handleChange}
              className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-400 text-xs text-slate-900"
            />
            <div className="mt-2 flex items-center gap-2 overflow-x-auto pb-1">
              <span className="text-[10px] font-bold text-slate-400 shrink-0">Presets:</span>
              {presetImages.map((img) => (
                <button
                  key={img.label}
                  type="button"
                  onClick={() => setFormData({ ...formData, image: img.url })}
                  className="px-2.5 py-1 text-[10px] bg-slate-100 hover:bg-purple-100 hover:text-purple-900 rounded-lg text-slate-700 shrink-0 font-semibold transition-colors"
                >
                  {img.label}
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className="block mb-1.5 font-bold text-slate-900">Schedule Days</label>
            <div className="flex items-center gap-2 flex-wrap">
              {availableDays.map((day) => {
                const selected = formData.days.includes(day);
                return (
                  <button
                    key={day}
                    type="button"
                    onClick={() => handleDayToggle(day)}
                    className={`px-3 py-1.5 rounded-xl font-bold transition-all ${
                      selected
                        ? 'bg-purple-900 text-cyan-300 shadow-sm'
                        : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                    }`}
                  >
                    {day}
                  </button>
                );
              })}
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block mb-1.5 font-bold text-slate-900">Class Start Time</label>
              <input
                type="text"
                name="startTime"
                placeholder="07:00 AM"
                value={formData.startTime}
                onChange={handleChange}
                className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-400"
              />
            </div>

            <div>
              <label className="block mb-1.5 font-bold text-slate-900">Class End Time</label>
              <input
                type="text"
                name="endTime"
                placeholder="09:30 AM"
                value={formData.endTime}
                onChange={handleChange}
                className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-400"
              />
            </div>

            <div>
              <label className="block mb-1.5 font-bold text-slate-900">Max Capacity</label>
              <input
                type="number"
                name="capacity"
                placeholder="40"
                value={formData.capacity}
                onChange={handleChange}
                className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-400"
              />
            </div>
          </div>

          <div>
            <label className="block mb-1.5 font-bold text-slate-900">Batch Description</label>
            <textarea
              name="description"
              rows="3"
              placeholder="Detailed description of course syllabus, test series, DPPs..."
              value={formData.description}
              onChange={handleChange}
              className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-400"
            />
          </div>

          <div className="pt-4 flex items-center justify-end space-x-3">
            <Link
              to="/admin/batches"
              className="px-6 py-3 rounded-xl border border-slate-200 text-slate-600 font-semibold hover:bg-slate-100"
            >
              Cancel
            </Link>
            <button
              type="submit"
              disabled={submitting}
              className="bg-purple-900 hover:bg-purple-800 text-cyan-300 font-bold px-8 py-3 rounded-xl shadow-lg flex items-center space-x-2 disabled:opacity-50"
            >
              {submitting && <Loader2 className="w-4 h-4 animate-spin" />}
              <span>{isEditing ? 'Save Changes' : 'Publish Batch Live'}</span>
            </button>
          </div>

        </form>

      </div>

    </div>
  );
}
