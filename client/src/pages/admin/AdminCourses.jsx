import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { 
  Plus, 
  Trash2, 
  BookOpen, 
  Sparkles, 
  DollarSign, 
  Tag, 
  User, 
  Image as ImageIcon,
  CheckCircle2,
  AlertCircle,
  Loader2,
  Star
} from 'lucide-react';
import { courseApi } from '../../api/courseApi';

export default function AdminCourses() {
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [toast, setToast] = useState({ show: false, message: '', type: 'success' });

  const [formData, setFormData] = useState({
    title: '',
    category: 'JEE & NEET Prep',
    instructor: '',
    price: '',
    oldPrice: '',
    image: '',
    description: '',
  });

  const categories = [
    'JEE & NEET Prep',
    'Board Exams',
    'Coding Bootcamps',
    'Language Institutes',
    'School Foundation'
  ];

  const presetImages = [
    { label: 'Science / Physics', url: 'https://images.unsplash.com/photo-1636466497217-26a8cbeaf0aa?auto=format&fit=crop&q=80&w=600' },
    { label: 'Biology / Med', url: 'https://images.unsplash.com/photo-1532094349884-543bc11b234d?auto=format&fit=crop&q=80&w=600' },
    { label: 'Math / Calculus', url: 'https://images.unsplash.com/photo-1509228468518-180dd4864904?auto=format&fit=crop&q=80&w=600' },
    { label: 'Coding / Tech', url: 'https://images.unsplash.com/photo-1498050108023-c5249f4df085?auto=format&fit=crop&q=80&w=600' },
    { label: 'Languages', url: 'https://images.unsplash.com/photo-1543269865-cbf427effbad?auto=format&fit=crop&q=80&w=600' },
    { label: 'Foundation', url: 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?auto=format&fit=crop&q=80&w=600' },
  ];

  useEffect(() => {
    fetchCourses();
  }, []);

  const fetchCourses = async () => {
    setLoading(true);
    try {
      const res = await courseApi.getCourses();
      const rawCourses = res.data?.courses || res.courses || (Array.isArray(res.data) ? res.data : []);
      setCourses(rawCourses);
    } catch (err) {
      console.error('Failed to load courses:', err);
    } finally {
      setLoading(false);
    }
  };

  const showNotification = (message, type = 'success') => {
    setToast({ show: true, message, type });
    setTimeout(() => setToast({ show: false, message: '', type: 'success' }), 4000);
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.title || !formData.price) {
      showNotification('Title and price are required', 'error');
      return;
    }

    setSubmitting(true);
    try {
      const payload = {
        title: formData.title,
        category: formData.category,
        instructor: formData.instructor || 'EduBatch Senior Faculty',
        price: Number(formData.price),
        oldPrice: formData.oldPrice ? Number(formData.oldPrice) : Number(formData.price) * 2,
        image: formData.image || presetImages[0].url,
        description: formData.description || 'Comprehensive interactive course.',
        rating: 4.9
      };

      await courseApi.createCourse(payload);
      showNotification('New course published successfully! Live on portal now.');
      setShowModal(false);
      setFormData({
        title: '',
        category: 'JEE & NEET Prep',
        instructor: '',
        price: '',
        oldPrice: '',
        image: '',
        description: '',
      });
      fetchCourses();
    } catch (err) {
      console.error('Failed to create course:', err);
      showNotification(err.message || 'Failed to create course. Ensure Admin access.', 'error');
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to remove this course from the portal?')) return;
    try {
      await courseApi.deleteCourse(id);
      showNotification('Course deleted successfully.');
      setCourses(courses.filter(c => c._id !== id));
    } catch (err) {
      showNotification(err.message || 'Failed to delete course', 'error');
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 p-6 lg:p-10 space-y-8">
      
      {/* Toast Notification */}
      {toast.show && (
        <div className={`fixed bottom-6 right-6 z-50 px-5 py-3.5 rounded-2xl shadow-2xl flex items-center space-x-3 text-xs font-bold animate-bounce ${
          toast.type === 'error' 
            ? 'bg-rose-900 text-rose-200 border border-rose-700' 
            : 'bg-slate-900 text-cyan-300 border border-cyan-400/50'
        }`}>
          {toast.type === 'error' ? <AlertCircle className="w-5 h-5 text-rose-400" /> : <CheckCircle2 className="w-5 h-5 text-cyan-400" />}
          <span>{toast.message}</span>
        </div>
      )}

      {/* Page Header */}
      <div className="bg-gradient-to-r from-purple-950 via-purple-900 to-indigo-950 text-white rounded-3xl p-8 lg:p-10 shadow-xl relative overflow-hidden flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
        <div className="space-y-3 relative z-10">
          <div className="inline-flex items-center space-x-2 bg-amber-400 text-slate-950 px-3.5 py-1 rounded-full text-xs font-black shadow-md">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Course Catalog Admin</span>
          </div>
          <h1 className="text-3xl font-extrabold tracking-tight">
            Manage & Publish Platform Courses 📚
          </h1>
          <p className="text-purple-200 text-xs md:text-sm max-w-xl leading-relaxed">
            Create new courses, edit pricing, and publish directly to the main portal and student catalog.
          </p>
        </div>

        <button
          onClick={() => setShowModal(true)}
          className="bg-cyan-400 hover:bg-cyan-300 text-slate-950 font-bold px-6 py-3.5 rounded-2xl text-xs flex items-center space-x-2 shadow-lg transition-all transform hover:scale-105 shrink-0"
        >
          <Plus className="w-4 h-4 stroke-[3]" />
          <span>Add New Course</span>
        </button>
      </div>

      {/* Courses Grid */}
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-extrabold text-slate-900 flex items-center space-x-2">
            <BookOpen className="w-5 h-5 text-purple-600" />
            <span>Live Published Courses ({courses.length})</span>
          </h2>
        </div>

        {loading ? (
          <div className="flex items-center justify-center py-16 text-slate-400 space-x-3 text-xs font-semibold">
            <Loader2 className="w-6 h-6 animate-spin text-cyan-500" />
            <span>Loading courses catalog...</span>
          </div>
        ) : courses.length === 0 ? (
          <div className="bg-white p-12 rounded-3xl border border-slate-200 text-center space-y-4">
            <BookOpen className="w-12 h-12 text-slate-300 mx-auto" />
            <h3 className="text-base font-bold text-slate-800">No courses created yet</h3>
            <p className="text-xs text-slate-500">Click "Add New Course" above to publish your first course.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {courses.map((course) => (
              <div 
                key={course._id}
                className="bg-white rounded-2xl border border-slate-200/80 shadow-sm overflow-hidden flex flex-col justify-between group hover:shadow-lg transition-all duration-300"
              >
                <div>
                  <div className="relative h-44 overflow-hidden">
                    <img 
                      src={course.image || presetImages[0].url} 
                      alt={course.title} 
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                    <span className="absolute top-3 left-3 bg-purple-950/90 text-cyan-300 text-[10px] font-bold uppercase tracking-wider px-3 py-1 rounded-full border border-purple-700/50">
                      {course.category}
                    </span>
                  </div>

                  <div className="p-5 space-y-3">
                    <p className="text-xs font-semibold text-slate-400">{course.instructor || 'EduBatch Faculty'}</p>
                    <h3 className="text-sm font-bold text-slate-900 leading-snug line-clamp-2">{course.title}</h3>
                    <p className="text-xs text-slate-500 line-clamp-2 leading-relaxed">{course.description}</p>
                  </div>
                </div>

                <div className="px-5 pb-5 pt-3 border-t border-slate-100 flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <span className="text-sm font-black text-slate-900">₹{course.price}</span>
                    {course.oldPrice && (
                      <span className="line-through text-xs text-slate-400">₹{course.oldPrice}</span>
                    )}
                  </div>

                  <button
                    onClick={() => handleDelete(course._id)}
                    className="p-2 rounded-xl text-rose-500 hover:bg-rose-50 hover:text-rose-700 transition-colors"
                    title="Delete Course"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Add Course Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 bg-slate-950/70 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white w-full max-w-xl rounded-3xl p-6 md:p-8 shadow-2xl border border-slate-200 space-y-6 max-h-[90vh] overflow-y-auto">
            
            <div className="flex items-center justify-between border-b border-slate-100 pb-4">
              <h2 className="text-lg font-black text-slate-900 flex items-center space-x-2">
                <BookOpen className="w-5 h-5 text-cyan-600" />
                <span>Publish New Course</span>
              </h2>
              <button
                onClick={() => setShowModal(false)}
                className="text-slate-400 hover:text-slate-700 text-sm font-bold"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4 text-xs font-medium text-slate-700">
              
              <div>
                <label className="block mb-1.5 font-bold text-slate-900">Course Title *</label>
                <input
                  type="text"
                  name="title"
                  required
                  placeholder="e.g. Master Class 12 Physics & Organic Chemistry"
                  value={formData.title}
                  onChange={handleChange}
                  className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-cyan-400"
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block mb-1.5 font-bold text-slate-900">Category *</label>
                  <select
                    name="category"
                    value={formData.category}
                    onChange={handleChange}
                    className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-cyan-400"
                  >
                    {categories.map((cat) => (
                      <option key={cat} value={cat}>{cat}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block mb-1.5 font-bold text-slate-900">Instructor Name</label>
                  <input
                    type="text"
                    name="instructor"
                    placeholder="e.g. Prof. Alok Verma"
                    value={formData.instructor}
                    onChange={handleChange}
                    className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-cyan-400"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block mb-1.5 font-bold text-slate-900">Offer Price (₹) *</label>
                  <input
                    type="number"
                    name="price"
                    required
                    placeholder="149"
                    value={formData.price}
                    onChange={handleChange}
                    className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-cyan-400"
                  />
                </div>

                <div>
                  <label className="block mb-1.5 font-bold text-slate-900">Original Price (₹)</label>
                  <input
                    type="number"
                    name="oldPrice"
                    placeholder="299"
                    value={formData.oldPrice}
                    onChange={handleChange}
                    className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-cyan-400"
                  />
                </div>
              </div>

              <div>
                <label className="block mb-1.5 font-bold text-slate-900">Cover Image URL</label>
                <input
                  type="url"
                  name="image"
                  placeholder="https://images.unsplash.com/..."
                  value={formData.image}
                  onChange={handleChange}
                  className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-cyan-400"
                />
                
                {/* Preset image quick selectors */}
                <div className="mt-2 flex items-center gap-2 overflow-x-auto pb-1">
                  <span className="text-[10px] font-bold text-slate-400 shrink-0">Presets:</span>
                  {presetImages.map((img) => (
                    <button
                      key={img.label}
                      type="button"
                      onClick={() => setFormData({ ...formData, image: img.url })}
                      className="px-2.5 py-1 text-[10px] bg-slate-100 hover:bg-slate-200 rounded-lg text-slate-700 shrink-0"
                    >
                      {img.label}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="block mb-1.5 font-bold text-slate-900">Description</label>
                <textarea
                  name="description"
                  rows="3"
                  placeholder="Brief course curriculum summary..."
                  value={formData.description}
                  onChange={handleChange}
                  className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-cyan-400"
                />
              </div>

              <div className="pt-4 flex items-center justify-end space-x-3">
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="px-5 py-2.5 rounded-xl border border-slate-200 text-slate-600 font-semibold hover:bg-slate-100"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={submitting}
                  className="bg-cyan-400 hover:bg-cyan-300 text-slate-950 font-bold px-6 py-2.5 rounded-xl shadow-md flex items-center space-x-2 disabled:opacity-50"
                >
                  {submitting && <Loader2 className="w-4 h-4 animate-spin" />}
                  <span>Publish Course</span>
                </button>
              </div>

            </form>

          </div>
        </div>
      )}

    </div>
  );
}
