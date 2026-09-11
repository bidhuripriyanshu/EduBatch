import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { 
  Sparkles, 
  Star, 
  ArrowRight, 
  CheckCircle2, 
  BookOpen, 
  Award, 
  Clock, 
  Users, 
  ChevronLeft, 
  ChevronRight,
  Send,
  Search,
  Loader2
} from 'lucide-react';
import { useAuth } from '../hooks/useAuth';
import { courseApi } from '../api/courseApi';
import { batchApi } from '../api/batchApi';
import LoadingSpinner, { CardSkeleton } from '../components/common/LoadingSpinner';

export default function Home() {
  const { currentRole } = useAuth();
  const [activeTab, setActiveTab] = useState('All Courses');
  const [popularCourses, setPopularCourses] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchBackendData = async () => {
      setLoading(true);
      try {
        const [batchRes, courseRes] = await Promise.allSettled([
          batchApi.getBatches({ status: 'active' }),
          courseApi.getCourses(),
        ]);

        const combinedList = [];

        // 1. Process active batches from /api/v1/batches?status=active
        if (batchRes.status === 'fulfilled') {
          const rawBatches = batchRes.value?.data?.batches || batchRes.value?.batches || [];
          rawBatches.forEach((b, idx) => {
            let category = 'JEE & NEET Prep';
            const subName = `${b.subject || ''} ${b.name || ''}`.toLowerCase();
            if (subName.includes('board') || subName.includes('cbse')) category = 'Board Exams';
            else if (subName.includes('code') || subName.includes('mern') || subName.includes('web')) category = 'Coding Bootcamps';
            else if (subName.includes('english') || subName.includes('language') || subName.includes('spoken')) category = 'Language Institutes';
            else if (subName.includes('school') || subName.includes('foundation') || subName.includes('class 8')) category = 'School Foundation';

            let img = b.image;
            if (!img) {
              if (subName.includes('chemistry') || subName.includes('biology') || subName.includes('neet')) {
                img = 'https://images.unsplash.com/photo-1532094349884-543bc11b234d?auto=format&fit=crop&q=80&w=600';
              } else if (subName.includes('physics') || subName.includes('jee')) {
                img = 'https://images.unsplash.com/photo-1636466497217-26a8cbeaf0aa?auto=format&fit=crop&q=80&w=600';
              } else if (subName.includes('math') || subName.includes('board')) {
                img = 'https://images.unsplash.com/photo-1509228468518-180dd4864904?auto=format&fit=crop&q=80&w=600';
              } else {
                img = 'https://images.unsplash.com/photo-1498050108023-c5249f4df085?auto=format&fit=crop&q=80&w=600';
              }
            }

            combinedList.push({
              id: b._id || `batch-${idx}`,
              category,
              title: b.name,
              subject: b.subject,
              rating: 4.9,
              oldPrice: Math.round(b.fee * 1.5) || 299,
              price: b.fee,
              image: img,
              isBatch: true,
              teacher: b.teacher?.name || 'Assigned Instructor'
            });
          });
        }

        // 2. Process courses from /api/v1/courses
        if (courseRes.status === 'fulfilled') {
          const rawCourses = courseRes.value?.data?.courses || courseRes.value?.courses || [];
          rawCourses.forEach((c, idx) => {
            // Avoid duplicate titles
            if (!combinedList.some(item => item.title.toLowerCase() === c.title.toLowerCase())) {
              combinedList.push({
                id: c._id || `course-${idx}`,
                category: c.category || 'JEE & NEET Prep',
                title: c.title,
                rating: c.rating || 4.8,
                oldPrice: c.oldPrice || (c.price ? Math.round(c.price * 1.8) : 299),
                price: c.price,
                image: c.image || 'https://images.unsplash.com/photo-1498050108023-c5249f4df085?auto=format&fit=crop&q=80&w=600',
                isBatch: false
              });
            }
          });
        }

        setPopularCourses(combinedList);
      } catch (err) {
        console.error('Error fetching backend data:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchBackendData();
  }, []);

  const courseTabs = [
    'All Courses', 'JEE & NEET Prep', 'Board Exams', 'Coding Bootcamps', 'Language Institutes', 'School Foundation'
  ];

  const filteredCourses = activeTab === 'All Courses'
    ? popularCourses
    : popularCourses.filter(c => c.category === activeTab);

  return (
    <div className="w-full space-y-0 text-slate-800">
      
      {/* SECTION 1: HERO BANNER (Matches Screenshot 1) */}
      <section className="relative overflow-hidden bg-gradient-to-r from-purple-900 via-indigo-900 to-purple-950 text-white py-20 px-6 lg:px-16">
        <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          
          {/* Left Illustration Graphic */}
          <div className="relative flex justify-center items-center">
            <div className="absolute w-72 h-72 bg-sky-500/20 rounded-full blur-3xl -top-10 -left-10 animate-pulse"></div>
            <div className="relative z-10 w-full max-w-lg bg-slate-900/60 p-6 rounded-3xl border border-purple-500/30 backdrop-blur-md shadow-2xl">
              <img 
                src="/main_image.png" 
                alt="Students Online Learning" 
                className="rounded-2xl object-cover shadow-lg w-full h-80"
              />
              <div className="absolute -bottom-5 left-6 bg-slate-900/90 border border-cyan-400/50 p-4 rounded-2xl shadow-xl flex items-center space-x-3">
                <div className="w-10 h-10 rounded-full bg-cyan-400 text-slate-950 flex items-center justify-center font-bold">
                  <BookOpen className="w-5 h-5" />
                </div>
                <div>
                  <p className="text-xs text-slate-300">Live Active Batches</p>
                  <p className="text-sm font-extrabold text-cyan-300">20+ Structured Classes</p>
                </div>
              </div>
            </div>
          </div>

          {/* Right Hero Text */}
          <div className="space-y-6 text-center lg:text-left">
            <div className="inline-flex items-center space-x-2 bg-purple-800/50 border border-purple-600/60 px-4 py-1.5 rounded-full text-xs font-semibold text-cyan-300">
              <Sparkles className="w-4 h-4 text-cyan-400" />
              <span>Next Generation Learning Platform</span>
            </div>
            
            <h1 className="text-4xl lg:text-6xl font-black tracking-tight text-white leading-tight">
              Learn Your <br />
              <span className="bg-gradient-to-r from-cyan-300 via-sky-200 to-amber-300 bg-clip-text text-transparent">
                Favorite Course
              </span> <br />
              From Online
            </h1>

            <p className="text-purple-200 text-base max-w-lg mx-auto lg:mx-0 font-normal leading-relaxed">
              Empowering students and teachers with streamlined batch scheduling, automated attendance, fee management, and notice broadcasts.
            </p>

            <div className="pt-2 flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4">
              <Link 
                to={`/${currentRole}/dashboard`}
                className="bg-cyan-400 hover:bg-cyan-300 text-slate-950 font-bold px-8 py-4 rounded-full text-sm shadow-xl shadow-cyan-500/20 transition-all transform hover:-translate-y-0.5 flex items-center space-x-2"
              >
                <span>Browse Our Courses</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
              
              <Link 
                to="/register"
                className="bg-purple-800/60 hover:bg-purple-700/80 text-white font-semibold px-6 py-4 rounded-full text-sm border border-purple-600/60 transition-all"
              >
                Register as Student
              </Link>
            </div>
          </div>

        </div>
      </section>

      {/* SECTION 2: STATISTICS DIAGRAM & OVERVIEW (Matches Screenshot 2) */}
      <section className="py-20 px-6 lg:px-16 bg-white">
        <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          
          {/* Left Text & CTA */}
          <div className="space-y-6">
            <h2 className="text-3xl lg:text-4xl font-extrabold text-slate-900 tracking-tight leading-snug">
              Over 7000 Tutorials <br />
              from 20 Courses
            </h2>
            <p className="text-slate-600 text-sm leading-relaxed max-w-md">
              Our set rule for firmament morning sixth subdue darkness creeping gathered divide our let god moving. Moving in fourth air night bring upon you're beast let you dominion likeness open place day great wherein heaven sixth lesser subdue fowl.
            </p>
            <div>
              <Link
                to="/student/batches"
                className="inline-flex items-center space-x-2 bg-cyan-400 hover:bg-cyan-500 text-slate-950 font-bold px-7 py-3.5 rounded-full text-xs shadow-md transition-all"
              >
                <span>Enroll a Course</span>
              </Link>
            </div>
          </div>

          {/* Right Venn Diagram Statistic Circles */}
          <div className="relative flex justify-center items-center py-10">
            <div className="relative w-80 h-80 md:w-96 md:h-96">
              {/* Orange Circle */}
              <div className="absolute top-4 left-4 w-44 h-44 rounded-full bg-orange-300/80 text-slate-900 flex flex-col items-center justify-center p-4 text-center font-bold shadow-lg border border-orange-200">
                <span className="text-2xl font-black">20+</span>
                <span className="text-xs font-semibold text-slate-700">Courses</span>
              </div>
              {/* Sky Blue Circle */}
              <div className="absolute top-4 right-4 w-48 h-48 rounded-full bg-sky-300/80 text-slate-900 flex flex-col items-center justify-center p-4 text-center font-bold shadow-lg border border-sky-200">
                <span className="text-3xl font-black">7638</span>
                <span className="text-xs font-semibold text-slate-700">Courses</span>
              </div>
              {/* Cyan Teal Circle */}
              <div className="absolute bottom-4 left-1/2 -translate-x-1/2 w-48 h-48 rounded-full bg-cyan-400/80 text-slate-900 flex flex-col items-center justify-center p-4 text-center font-bold shadow-lg border border-cyan-300">
                <span className="text-3xl font-black">230+</span>
                <span className="text-xs font-semibold text-slate-800">Batches</span>
              </div>
            </div>
          </div>

        </div>
      </section>

      {/* SECTION 3: POPULAR COURSES GRID (Matches Screenshot 3) */}
      <section className="py-20 px-6 lg:px-16 bg-slate-50 border-t border-slate-200/80">
        <div className="max-w-7xl mx-auto space-y-10">
          
          <div className="text-center space-y-3">
            <h2 className="text-3xl lg:text-4xl font-extrabold text-slate-900">
              Popular Courses
            </h2>
            <p className="text-slate-500 text-xs max-w-lg mx-auto">
              Your domain control panel is designed for ease-of-use and allows for all aspects of your domains.
            </p>
          </div>

          {/* Filter Tabs */}
          <div className="flex items-center justify-center flex-wrap gap-2 border-b border-slate-200 pb-4">
            {courseTabs.map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`px-4 py-2 text-xs font-semibold rounded-full transition-all ${
                  activeTab === tab
                    ? 'bg-cyan-400 text-slate-950 shadow-md font-bold'
                    : 'text-slate-600 hover:text-cyan-600 hover:bg-slate-200/60'
                }`}
              >
                {tab}
              </button>
            ))}
          </div>

          {/* Course Cards Grid */}
          {loading ? (
            <CardSkeleton count={3} />
          ) : filteredCourses.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
              {filteredCourses.map((course) => (
                <div 
                  key={course.id} 
                  className="bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 border border-slate-200/80 group flex flex-col justify-between"
                >
                  <div>
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
                      <span className="absolute top-3 left-3 bg-purple-900/90 text-cyan-300 text-[10px] font-bold uppercase tracking-wider px-3 py-1 rounded-full border border-purple-700/50">
                        {course.category}
                      </span>
                    </div>

                    <div className="p-5 space-y-3">
                      <p className="text-xs text-slate-400 font-medium">{course.category}</p>
                      <h3 className="text-sm font-bold text-slate-900 group-hover:text-cyan-600 transition-colors line-clamp-2">
                        {course.title}
                      </h3>
                    </div>
                  </div>

                  <div className="px-5 pb-5 pt-3 border-t border-slate-100 flex items-center justify-between">
                    <div className="flex items-center space-x-1 text-amber-500 text-xs font-bold">
                      <Star className="w-3.5 h-3.5 fill-amber-400" />
                      <span>({course.rating})</span>
                    </div>
                    <div className="flex items-center space-x-2 text-xs">
                      <span className="line-through text-slate-400">₹{course.oldPrice}</span>
                      <span className="font-extrabold text-slate-900 text-sm">₹{course.price}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="bg-white p-12 rounded-3xl border border-slate-200 text-center space-y-3">
              <BookOpen className="w-10 h-10 text-slate-400 mx-auto" />
              <h3 className="text-base font-bold text-slate-800">No active batches or courses match this category</h3>
              <p className="text-xs text-slate-500">Try selecting "All Courses" or check back soon.</p>
            </div>
          )}

        </div>
      </section>

      {/* SECTION 4: TESTIMONIAL BANNER (Matches Screenshot 4) */}
      <section className="py-20 px-6 bg-slate-950 text-white relative overflow-hidden">
        <div className="max-w-4xl mx-auto text-center space-y-8 relative z-10">
          <img 
            src="/teacher_image.png" 
            alt="Lead Instructor"
            className="w-20 h-20 rounded-full mx-auto ring-4 ring-cyan-400 object-cover shadow-2xl"
          />
          <blockquote className="text-lg md:text-xl font-medium text-slate-200 italic max-w-2xl mx-auto leading-relaxed">
            "Working in conjunction with humanitarian aid agencies we have supported programmes to alleviate human suffering."
          </blockquote>
          <p className="text-xs font-bold text-cyan-300 tracking-widest uppercase">- Japsleen, Lead Instructor</p>
        </div>
      </section>

      {/* SECTION 5: COURSE SPECIALITY & NEWSLETTER (Matches Screenshot 5) */}
      <section className="py-20 px-6 lg:px-16 bg-white space-y-16">
        <div className="max-w-7xl mx-auto space-y-12">
          
          <div className="text-center space-y-3">
            <h2 className="text-3xl font-extrabold text-slate-900">Our Course Speciality</h2>
            <p className="text-slate-500 text-xs max-w-md mx-auto">
              Your domain control panel is designed for ease-of-use and allows for all aspects of your domains.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 text-center">
            {[1, 2, 3, 4].map((item) => (
              <div key={item} className="p-6 rounded-2xl border border-slate-200/80 space-y-3 hover:border-cyan-400 transition-colors">
                <div className="w-12 h-12 rounded-full bg-cyan-100 text-cyan-700 flex items-center justify-center mx-auto">
                  <Award className="w-6 h-6" />
                </div>
                <h3 className="text-sm font-bold text-slate-900">Premium Quality</h3>
                <p className="text-xs text-slate-500 leading-relaxed">
                  Your domain control panel is designed for ease-of-use and allows for all aspects of your domains.
                </p>
              </div>
            ))}
          </div>

        </div>

        {/* Turquoise Newsletter Bar (Matches Screenshot 5 Bottom Bar) */}
        <div className="max-w-7xl mx-auto bg-cyan-400 rounded-3xl p-8 lg:p-12 shadow-xl flex flex-col lg:flex-row items-center justify-between gap-8 text-slate-950">
          <div className="space-y-2 text-center lg:text-left">
            <h3 className="text-2xl font-black">Subscribe Newsletter</h3>
            <p className="text-xs font-semibold text-slate-800">
              Your domain control panel is designed for ease-of-use and allows for all aspects of your domains.
            </p>
          </div>

          <div className="w-full lg:w-auto flex items-center max-w-md bg-white rounded-full p-1.5 shadow-md">
            <input 
              type="email" 
              placeholder="Enter your email" 
              className="px-4 py-2 text-xs w-full text-slate-800 focus:outline-none bg-transparent"
            />
            <button className="bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold px-6 py-2.5 rounded-full text-xs transition-colors shrink-0">
              Sign Up
            </button>
          </div>
        </div>
      </section>

    </div>
  );
}
