import React from 'react';
import { Link } from 'react-router-dom';
import { 
  Sparkles, 
  Award, 
  Users, 
  BookOpen, 
  CheckCircle2, 
  ShieldCheck, 
  Globe, 
  Clock, 
  ArrowRight 
} from 'lucide-react';

export default function About() {
  const stats = [
    { label: 'Enrolled Students', value: '10,000+' },
    { label: 'Expert Instructors', value: '50+' },
    { label: 'Completed Courses', value: '120+' },
    { label: 'Satisfaction Rate', value: '99.4%' },
  ];

  const values = [
    {
      icon: Award,
      title: 'Quality First',
      description: 'Every course is designed by industry experts with hands-on projects and up-to-date curriculum.'
    },
    {
      icon: ShieldCheck,
      title: 'Verified Certification',
      description: 'Earn shareable credentials upon completion to highlight your expertise to top recruiters.'
    },
    {
      icon: Clock,
      title: 'Flexible Schedule',
      description: 'Learn at your own pace with lifetime access to batch recordings, resources, and live help.'
    },
    {
      icon: Globe,
      title: 'Global Community',
      description: 'Connect with thousands of fellow students and mentors across tech and design domains.'
    }
  ];

  const team = [
    {
      name: 'Dr. Rajesh Sharma',
      role: 'Founder & Chief Learning Officer',
      image: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=300',
      bio: 'Ex-Tech Lead with over 15 years of education and software engineering experience.'
    },
    {
      name: 'Prof. Ananya Sen',
      role: 'Head of Full-Stack Engineering',
      image: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&q=80&w=300',
      bio: 'Specialist in React 19, Node.js, and scalable cloud architecture.'
    },
    {
      name: 'Aarav Mehta',
      role: 'Lead UI/UX Mentor',
      image: 'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?auto=format&fit=crop&q=80&w=300',
      bio: 'Award-winning product designer dedicated to teaching modern design systems.'
    }
  ];

  return (
    <div className="min-h-screen bg-slate-50 py-10 px-4 sm:px-6 lg:px-12 space-y-16">
      
      {/* Hero Section */}
      <div className="bg-gradient-to-r from-purple-950 via-purple-900 to-indigo-950 rounded-3xl p-8 lg:p-16 text-white shadow-xl text-center space-y-6 relative overflow-hidden">
        <div className="inline-flex items-center space-x-2 bg-purple-800/60 border border-purple-600/50 px-4 py-1.5 rounded-full text-xs font-semibold text-cyan-300">
          <Sparkles className="w-4 h-4 text-cyan-400" />
          <span>About EduBatch LMS</span>
        </div>

        <h1 className="text-3xl lg:text-5xl font-black tracking-tight leading-tight max-w-3xl mx-auto">
          Empowering Next-Gen Learners with{' '}
          <span className="bg-gradient-to-r from-cyan-300 via-sky-200 to-amber-300 bg-clip-text text-transparent">
            Structured Education
          </span>
        </h1>

        <p className="text-purple-200 text-sm md:text-base max-w-2xl mx-auto leading-relaxed">
          EduBatch is a premier learning management system offering structured batch schedules, real-time attendance tracking, seamless fee payment, and notices broadcasting for students and educators.
        </p>

        <div className="pt-4 flex items-center justify-center space-x-4">
          <Link
            to="/courses"
            className="bg-cyan-400 hover:bg-cyan-300 text-slate-950 font-bold px-8 py-3.5 rounded-full text-xs shadow-xl transition-all flex items-center space-x-2"
          >
            <span>Explore Courses</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </div>

      {/* Stats Counter Bar */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-6 max-w-6xl mx-auto">
        {stats.map((stat) => (
          <div key={stat.label} className="bg-white p-6 rounded-2xl border border-slate-200/80 text-center space-y-1 shadow-sm">
            <p className="text-3xl font-black text-purple-900">{stat.value}</p>
            <p className="text-xs text-slate-500 font-medium">{stat.label}</p>
          </div>
        ))}
      </div>

      {/* Core Values */}
      <div className="max-w-6xl mx-auto space-y-10">
        <div className="text-center space-y-2">
          <h2 className="text-3xl font-extrabold text-slate-900">Why Choose EduBatch?</h2>
          <p className="text-xs text-slate-500 max-w-md mx-auto">
            We bridge the gap between structured classroom discipline and self-paced online learning.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {values.map((val) => {
            const Icon = val.icon;
            return (
              <div key={val.title} className="bg-white p-6 rounded-2xl border border-slate-200/80 space-y-3 shadow-sm hover:shadow-md transition-shadow">
                <div className="w-12 h-12 rounded-xl bg-purple-50 text-purple-700 flex items-center justify-center">
                  <Icon className="w-6 h-6" />
                </div>
                <h3 className="text-base font-bold text-slate-900">{val.title}</h3>
                <p className="text-xs text-slate-500 leading-relaxed">{val.description}</p>
              </div>
            );
          })}
        </div>
      </div>

      {/* Instructors Team */}
      <div className="max-w-6xl mx-auto space-y-10">
        <div className="text-center space-y-2">
          <h2 className="text-3xl font-extrabold text-slate-900">Meet Our Mentors</h2>
          <p className="text-xs text-slate-500 max-w-md mx-auto">
            Learn directly from seasoned professionals with years of industry experience.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {team.map((member) => (
            <div key={member.name} className="bg-white rounded-2xl overflow-hidden border border-slate-200/80 shadow-sm text-center p-6 space-y-4">
              <img
                src={member.image}
                alt={member.name}
                className="w-24 h-24 rounded-full mx-auto object-cover ring-4 ring-cyan-400"
              />
              <div>
                <h3 className="text-base font-bold text-slate-900">{member.name}</h3>
                <p className="text-xs font-semibold text-cyan-600">{member.role}</p>
              </div>
              <p className="text-xs text-slate-500 leading-relaxed">{member.bio}</p>
            </div>
          ))}
        </div>
      </div>

    </div>
  );
}
