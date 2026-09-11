import React from 'react';
import { Sparkles, Mail, PhoneCall, HelpCircle } from 'lucide-react';

export default function Header() {
  return (
    <div className="bg-slate-950 text-slate-300 border-b border-purple-900/40 text-[11px] sm:text-xs py-2 px-3 sm:px-6 lg:px-8 w-full max-w-full overflow-hidden">
      <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-1.5 sm:gap-2">
        
        {/* Left Side Announcement Banner */}
        <div className="flex items-center space-x-1.5 text-cyan-300 font-medium max-w-full truncate text-center sm:text-left">
          <Sparkles className="w-3.5 h-3.5 text-amber-400 shrink-0 animate-pulse" />
          <span className="truncate">
            🎉 <strong className="text-white">Special Discount:</strong> Use code <span className="bg-amber-400/20 text-amber-300 px-1.5 py-0.5 rounded font-mono font-bold">EDUBATCH10</span> for 10% OFF!
          </span>
        </div>

        {/* Right Side Direct Contact Shortcuts */}
        <div className="flex items-center space-x-4 text-slate-400 shrink-0">
          <a
            href="mailto:support@edubatch.com"
            className="flex items-center space-x-1 hover:text-cyan-300 transition-colors"
          >
            <Mail className="w-3.5 h-3.5" />
            <span className="hidden md:inline">support@edubatch.com</span>
          </a>

          <a
            href="tel:+919876543210"
            className="flex items-center space-x-1 hover:text-cyan-300 transition-colors"
          >
            <PhoneCall className="w-3.5 h-3.5" />
            <span>+91 98765 43210</span>
          </a>

          <div className="hidden sm:flex items-center space-x-3 border-l border-slate-800 pl-4">
            <a href="#help" className="flex items-center space-x-1 hover:text-cyan-300 transition-colors">
              <HelpCircle className="w-3.5 h-3.5" />
              <span>Help Center</span>
            </a>
          </div>
        </div>

      </div>
    </div>
  );
}
