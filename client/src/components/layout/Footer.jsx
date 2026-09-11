import React from 'react';
import { Link } from 'react-router-dom';
import { 
  BookOpen, 
  Mail, 
  PhoneCall, 
  MapPin, 
  ArrowRight, 
  Globe, 
  Share2, 
  ShieldCheck, 
  Send
} from 'lucide-react';

export default function Footer() {
  return (
    <footer className="bg-slate-950 text-slate-300 border-t border-purple-900/40 font-sans">
      
      {/* Top Section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12">
        
        {/* Column 1: Brand Info */}
        <div className="space-y-5">
          <Link to="/" className="flex items-center space-x-3 group">
            <div className="w-11 h-11 rounded-xl bg-gradient-to-tr from-cyan-400 to-sky-300 flex items-center justify-center text-slate-950 shadow-md group-hover:scale-105 transition-transform">
              <BookOpen className="w-6 h-6 stroke-[2.5]" />
            </div>
            <div>
              <span className="text-2xl font-extrabold tracking-tight bg-gradient-to-r from-white via-sky-100 to-cyan-300 bg-clip-text text-transparent">
                EduBatch
              </span>
              <span className="block text-[10px] uppercase font-bold tracking-widest text-cyan-300/80 -mt-1">
                Learning Portal
              </span>
            </div>
          </Link>

          <p className="text-xs text-slate-400 leading-relaxed">
            EduBatch is a modern learning platform offering structured courses, live batch schedules, automated attendance tracking, and fee management for students and educators.
          </p>

          <div className="flex items-center space-x-3 pt-2">
            <a href="#global" className="w-8 h-8 rounded-full bg-slate-900 border border-slate-800 hover:border-cyan-400 text-slate-400 hover:text-cyan-300 flex items-center justify-center transition-colors">
              <Globe className="w-4 h-4" />
            </a>
            <a href="#share" className="w-8 h-8 rounded-full bg-slate-900 border border-slate-800 hover:border-cyan-400 text-slate-400 hover:text-cyan-300 flex items-center justify-center transition-colors">
              <Share2 className="w-4 h-4" />
            </a>
          </div>
        </div>

        {/* Column 2: Quick Links */}
        <div className="space-y-4">
          <h3 className="text-sm font-extrabold uppercase tracking-wider text-white border-l-2 border-cyan-400 pl-3">
            Quick Links
          </h3>
          <ul className="space-y-2.5 text-xs text-slate-400">
            <li>
              <Link to="/" className="hover:text-cyan-300 transition-colors flex items-center space-x-1.5">
                <ArrowRight className="w-3 h-3 text-cyan-400" />
                <span>Home Page</span>
              </Link>
            </li>
            <li>
              <Link to="/courses" className="hover:text-cyan-300 transition-colors flex items-center space-x-1.5">
                <ArrowRight className="w-3 h-3 text-cyan-400" />
                <span>All Courses Catalog</span>
              </Link>
            </li>
            <li>
              <Link to="/about" className="hover:text-cyan-300 transition-colors flex items-center space-x-1.5">
                <ArrowRight className="w-3 h-3 text-cyan-400" />
                <span>About Us</span>
              </Link>
            </li>
            <li>
              <Link to="/contact" className="hover:text-cyan-300 transition-colors flex items-center space-x-1.5">
                <ArrowRight className="w-3 h-3 text-cyan-400" />
                <span>Contact & Support</span>
              </Link>
            </li>
            <li>
              <Link to="/cart" className="hover:text-cyan-300 transition-colors flex items-center space-x-1.5">
                <ArrowRight className="w-3 h-3 text-cyan-400" />
                <span>My Shopping Cart</span>
              </Link>
            </li>
          </ul>
        </div>

        {/* Column 3: Course Categories */}
        <div className="space-y-4">
          <h3 className="text-sm font-extrabold uppercase tracking-wider text-white border-l-2 border-purple-400 pl-3">
            Top Categories
          </h3>
          <ul className="space-y-2.5 text-xs text-slate-400">
            <li>
              <Link to="/courses" className="hover:text-cyan-300 transition-colors">Web Development</Link>
            </li>
            <li>
              <Link to="/courses" className="hover:text-cyan-300 transition-colors">UI/UX Design & Prototyping</Link>
            </li>
            <li>
              <Link to="/courses" className="hover:text-cyan-300 transition-colors">Photoshop & Graphic Design</Link>
            </li>
            <li>
              <Link to="/courses" className="hover:text-cyan-300 transition-colors">Python & Data Science</Link>
            </li>
            <li>
              <Link to="/courses" className="hover:text-cyan-300 transition-colors">Artificial Intelligence & ML</Link>
            </li>
            <li>
              <Link to="/courses" className="hover:text-cyan-300 transition-colors">Mobile App Development</Link>
            </li>
          </ul>
        </div>

        {/* Column 4: Contact Info */}
        <div className="space-y-4">
          <h3 className="text-sm font-extrabold uppercase tracking-wider text-white border-l-2 border-amber-400 pl-3">
            Contact & Support
          </h3>
          <p className="text-xs text-slate-400 leading-relaxed">
            Have questions about batch timing, fee payments, or platform access? Get in touch with us.
          </p>

          <div className="pt-2 space-y-2 text-xs text-slate-300">
            <div className="flex items-center space-x-2">
              <Mail className="w-3.5 h-3.5 text-cyan-400" />
              <span>support@edubatch.com</span>
            </div>
            <div className="flex items-center space-x-2">
              <PhoneCall className="w-3.5 h-3.5 text-amber-400" />
              <span>+91 98765 43210</span>
            </div>
          </div>
        </div>

      </div>

      {/* Bottom Bar */}
      <div className="border-t border-slate-900 py-6 px-4 sm:px-6 lg:px-8 text-xs text-slate-500 bg-slate-950/80">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
          <p>© {new Date().getFullYear()} EduBatch LMS. All rights reserved.</p>
          <div className="flex items-center space-x-6">
            <a href="#privacy" className="hover:text-cyan-300 transition-colors">Privacy Policy</a>
            <a href="#terms" className="hover:text-cyan-300 transition-colors">Terms of Service</a>
            <a href="#cookies" className="hover:text-cyan-300 transition-colors">Cookie Settings</a>
          </div>
        </div>
      </div>

    </footer>
  );
}
