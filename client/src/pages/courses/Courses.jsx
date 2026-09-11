import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { 
  Search, 
  Filter, 
  Star, 
  ShoppingCart, 
  Check, 
  Clock, 
  BookOpen, 
  User, 
  Sparkles, 
  ArrowRight,
  TrendingUp,
  Lock,
  Eye
} from 'lucide-react';
import { useCart } from '../../context/CartContext';
import { useAuth } from '../../hooks/useAuth';
import LoadingSpinner, { CardSkeleton } from '../../components/common/LoadingSpinner';
import CourseDetailsModal from '../../components/courses/CourseDetailsModal';
import { courseApi } from '../../api/courseApi';
import { batchApi } from '../../api/batchApi';

export default function Courses() {
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();
  const { addToCart, isInCart, cartCount } = useCart();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [toastMessage, setToastMessage] = useState('');
  const [selectedCourse, setSelectedCourse] = useState(null);

  const categories = [
    'All', 
    'JEE & NEET Prep', 
    'Board Exams', 
    'Coding Bootcamps', 
    'Language Institutes', 
    'School Foundation'
  ];

  const [courseList, setCourseList] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCoursesFromBackend = async () => {
      setLoading(true);
      try {
        const [batchRes, courseRes] = await Promise.allSettled([
          batchApi.getBatches({ status: 'active' }),
          courseApi.getCourses(),
        ]);

        const combined = [];

        // 1. Process Active Batches from Admin
        if (batchRes.status === 'fulfilled') {
          const rawBatches = batchRes.value?.data?.batches || batchRes.value?.batches || [];
          rawBatches.forEach((b, idx) => {
            const text = `${b.subject || ''} ${b.name || ''}`.toLowerCase();
            let category = 'JEE & NEET Prep';
            if (text.includes('board') || text.includes('cbse') || text.includes('class 12')) category = 'Board Exams';
            else if (text.includes('code') || text.includes('mern') || text.includes('web') || text.includes('python')) category = 'Coding Bootcamps';
            else if (text.includes('english') || text.includes('language') || text.includes('spoken')) category = 'Language Institutes';
            else if (text.includes('school') || text.includes('foundation') || text.includes('class 8')) category = 'School Foundation';

            let img = b.image;
            if (!img) {
              if (text.includes('chemistry') || text.includes('biology') || text.includes('neet')) {
                img = 'https://images.unsplash.com/photo-1532094349884-543bc11b234d?auto=format&fit=crop&q=80&w=600';
              } else if (text.includes('physics') || text.includes('jee')) {
                img = 'https://images.unsplash.com/photo-1636466497217-26a8cbeaf0aa?auto=format&fit=crop&q=80&w=600';
              } else if (text.includes('math') || text.includes('board')) {
                img = 'https://images.unsplash.com/photo-1509228468518-180dd4864904?auto=format&fit=crop&q=80&w=600';
              } else {
                img = 'https://images.unsplash.com/photo-1498050108023-c5249f4df085?auto=format&fit=crop&q=80&w=600';
              }
            }

            combined.push({
              _id: b._id,
              name: b.name,
              subject: b.subject,
              id: b._id || `batch-${idx}`,
              title: b.name,
              category,
              instructor: b.teacher?.name || 'Prof. Alok Verma',
              teacher: b.teacher || { name: 'Prof. Alok Verma' },
              rating: 4.9,
              reviewsCount: 380 + idx * 25,
              price: b.fee,
              fee: b.fee,
              oldPrice: Math.round(b.fee * 1.4) || 299,
              duration: `${b.schedule?.days?.join(', ') || 'Mon, Wed, Fri'} (${b.schedule?.startTime || '07:00 AM'})`,
              schedule: b.schedule || { startTime: '07:00 AM', endTime: '09:30 AM', days: ['Mon', 'Wed', 'Fri'] },
              level: `Active Batch (${b.enrolledCount || 0}/${b.capacity || 40})`,
              image: img,
              description: b.description || 'Live interactive batch with daily problem solving and DPP tests.',
            });
          });
        }

        // 2. Process Courses from Admin
        if (courseRes.status === 'fulfilled') {
          const rawCourses = courseRes.value?.data?.courses || courseRes.value?.courses || [];
          rawCourses.forEach((c, idx) => {
            if (!combined.some(item => item.title.toLowerCase() === c.title.toLowerCase())) {
              combined.push({
                _id: c._id,
                name: c.title,
                id: c._id || `course-${idx}`,
                title: c.title,
                category: c.category || 'JEE & NEET Prep',
                instructor: c.instructor || 'EduBatch Senior Faculty',
                teacher: { name: c.instructor || 'EduBatch Senior Faculty' },
                rating: c.rating || 4.8,
                reviewsCount: 300 + idx * 15,
                price: c.price,
                fee: c.price,
                oldPrice: c.oldPrice || (c.price ? Math.round(c.price * 1.8) : 299),
                duration: c.duration || '90 Hours',
                level: c.level || 'All Levels',
                image: c.image || 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?auto=format&fit=crop&q=80&w=600',
                description: c.description || 'Comprehensive video series & interactive practice modules.',
              });
            }
          });
        }

        setCourseList(combined);
      } catch (err) {
        console.warn('Backend course load notice:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchCoursesFromBackend();
  }, []);

  const handleAddToCart = (e, course) => {
    e.stopPropagation(); // prevent modal opening when clicking Add to Cart
    if (!isAuthenticated) {
      setToastMessage('🔒 Please log in to add courses to your cart');
      setTimeout(() => {
        navigate('/login');
      }, 1200);
      return;
    }
    addToCart(course);
    setToastMessage(`"${course.title}" added to your cart!`);
    setTimeout(() => setToastMessage(''), 3000);
  };

  const filteredCourses = courseList.filter((course) => {
    const matchesCategory = selectedCategory === 'All' || course.category === selectedCategory;
    const matchesSearch = (course.title || '').toLowerCase().includes(searchQuery.toLowerCase()) ||
                          (course.description || '').toLowerCase().includes(searchQuery.toLowerCase()) ||
                          (course.instructor || '').toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  return (
    <div className="min-h-screen bg-slate-50 py-10 px-4 sm:px-6 lg:px-12 space-y-10">
      
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 bg-slate-900 text-cyan-300 border border-cyan-400/50 px-5 py-3 rounded-2xl shadow-2xl flex items-center space-x-3 animate-bounce">
          <ShoppingCart className="w-5 h-5 text-cyan-400" />
          <span className="text-xs font-semibold">{toastMessage}</span>
          <Link to="/cart" className="ml-2 text-xs font-bold underline text-amber-400">
            View Cart
          </Link>
        </div>
      )}

      {/* Hero Header */}
      <div className="bg-gradient-to-r from-purple-950 via-purple-900 to-indigo-900 rounded-3xl p-8 lg:p-12 text-white shadow-xl relative overflow-hidden">
        <div className="max-w-3xl space-y-4 relative z-10">
          <div className="inline-flex items-center space-x-2 bg-purple-800/60 border border-purple-600/50 px-4 py-1.5 rounded-full text-xs font-semibold text-cyan-300">
            <Sparkles className="w-4 h-4 text-cyan-400" />
            <span>Structured Learning Courses</span>
          </div>

          <h1 className="text-3xl lg:text-5xl font-black tracking-tight leading-tight">
            Explore All Available <br />
            <span className="bg-gradient-to-r from-cyan-300 via-sky-200 to-amber-300 bg-clip-text text-transparent">
              Educational Courses
            </span>
          </h1>

          <p className="text-purple-200 text-sm max-w-xl leading-relaxed">
            Enhance your skill set with industry-vetted courses. Click on any course card to inspect full syllabus details.
          </p>
        </div>

        {/* Floating Cart Quick Link */}
        <div className="mt-6 lg:mt-0 lg:absolute lg:top-12 lg:right-12">
          <Link
            to="/cart"
            className="inline-flex items-center space-x-3 bg-cyan-400 hover:bg-cyan-300 text-slate-950 font-bold px-6 py-3.5 rounded-2xl shadow-lg transition-all transform hover:scale-105"
          >
            <ShoppingCart className="w-5 h-5" />
            <span className="text-xs">My Cart ({cartCount})</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </div>

      {/* Search & Filter Bar */}
      <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200/80 space-y-6">
        <div className="flex flex-col md:flex-row items-center justify-between gap-4">
          
          {/* Search Input */}
          <div className="relative w-full md:w-96">
            <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              placeholder="Search courses, instructors, keywords..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:outline-none focus:ring-2 focus:ring-cyan-400 text-slate-800"
            />
          </div>

          {/* Results Counter */}
          <div className="text-xs text-slate-500 font-semibold">
            Showing <span className="font-bold text-slate-900">{filteredCourses.length}</span> course{filteredCourses.length !== 1 ? 's' : ''}
          </div>

        </div>

        {/* Category Filter Pills */}
        <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none">
          <span className="text-xs font-bold text-slate-400 uppercase tracking-wider shrink-0 mr-2 flex items-center space-x-1">
            <Filter className="w-3.5 h-3.5" />
            <span>Category:</span>
          </span>
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-4 py-2 text-xs font-semibold rounded-full shrink-0 transition-all ${
                selectedCategory === cat
                  ? 'bg-cyan-400 text-slate-950 font-bold shadow-sm'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* Course Cards Grid */}
      {loading ? (
        <CardSkeleton count={6} />
      ) : filteredCourses.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredCourses.map((course) => {
            const added = isInCart(course.id);
            return (
              <div
                key={course.id}
                onClick={() => setSelectedCourse(course)}
                className="bg-white rounded-2xl overflow-hidden border border-slate-200/80 shadow-sm hover:shadow-xl transition-all duration-300 flex flex-col justify-between group cursor-pointer"
              >
                <div>
                  {/* Thumbnail Image */}
                  <div className="relative h-48 overflow-hidden">
                    <img
                      src={course.image || 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?auto=format&fit=crop&q=80&w=600'}
                      alt={course.title}
                      onError={(e) => {
                        e.target.onerror = null;
                        e.target.src = 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?auto=format&fit=crop&q=80&w=600';
                      }}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                    <span className="absolute top-3 left-3 bg-purple-950/90 text-cyan-300 text-[10px] font-bold uppercase tracking-wider px-3 py-1 rounded-full border border-purple-700/50">
                      {course.category}
                    </span>
                    <span className="absolute top-3 right-3 bg-slate-900/80 text-white text-[10px] font-bold px-2.5 py-1 rounded-full">
                      {course.level}
                    </span>
                  </div>

                  {/* Body Content */}
                  <div className="p-5 space-y-3">
                    <div className="flex items-center justify-between text-xs text-slate-500">
                      <span className="flex items-center space-x-1">
                        <User className="w-3.5 h-3.5 text-cyan-600" />
                        <span>{course.instructor}</span>
                      </span>
                      <span className="flex items-center space-x-1">
                        <Clock className="w-3.5 h-3.5 text-purple-600" />
                        <span>{course.duration}</span>
                      </span>
                    </div>

                    <h3 className="text-base font-bold text-slate-900 group-hover:text-cyan-600 transition-colors line-clamp-2">
                      {course.title}
                    </h3>

                    <p className="text-xs text-slate-500 line-clamp-2 leading-relaxed">
                      {course.description}
                    </p>
                  </div>
                </div>

                {/* Footer Controls */}
                <div className="px-5 pb-5 pt-3 border-t border-slate-100 space-y-3">
                  
                  {/* Rating & Pricing */}
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-1 text-amber-500 text-xs font-bold">
                      <Star className="w-4 h-4 fill-amber-400" />
                      <span>{course.rating}</span>
                      <span className="text-slate-400 font-normal">({course.reviewsCount})</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <span className="line-through text-xs text-slate-400">₹{course.oldPrice}</span>
                      <span className="text-lg font-black text-slate-900">₹{course.price}</span>
                    </div>
                  </div>

                  {/* Action Controls: View Details & Add to Cart */}
                  <div className="grid grid-cols-2 gap-2">
                    <button
                      onClick={() => setSelectedCourse(course)}
                      className="py-2.5 rounded-xl text-xs font-bold bg-slate-100 hover:bg-slate-200 text-slate-800 flex items-center justify-center space-x-1 transition-all cursor-pointer"
                    >
                      <Eye className="w-3.5 h-3.5" />
                      <span>Details</span>
                    </button>

                    <button
                      onClick={(e) => handleAddToCart(e, course)}
                      className={`py-2.5 rounded-xl text-xs font-bold flex items-center justify-center space-x-1 transition-all ${
                        added
                          ? 'bg-emerald-500 text-white shadow-md cursor-default'
                          : 'bg-cyan-400 hover:bg-cyan-300 text-slate-950 shadow-md hover:shadow-cyan-400/30'
                      }`}
                    >
                      {added ? (
                        <>
                          <Check className="w-3.5 h-3.5" />
                          <span>Added</span>
                        </>
                      ) : (
                        <>
                          <ShoppingCart className="w-3.5 h-3.5" />
                          <span>Add to Cart</span>
                        </>
                      )}
                    </button>
                  </div>

                </div>

              </div>
            );
          })}
        </div>
      ) : (
        <div className="bg-white p-12 rounded-3xl border border-slate-200 text-center space-y-4">
          <BookOpen className="w-12 h-12 text-slate-400 mx-auto" />
          <h3 className="text-lg font-bold text-slate-800">No courses match your search</h3>
          <p className="text-xs text-slate-500">Try adjusting your category filter or search keywords.</p>
        </div>
      )}

      {/* Course Details Modal */}
      <CourseDetailsModal
        course={selectedCourse}
        isOpen={!!selectedCourse}
        onClose={() => setSelectedCourse(null)}
      />

    </div>
  );
}

