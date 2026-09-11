import React from 'react';
import { BookOpen, Sparkles } from 'lucide-react';

export default function LoadingSpinner({ text = 'Fetching live data from database...', fullScreen = false, size = 'default' }) {
  const content = (
    <div className="flex flex-col items-center justify-center p-8 space-y-4 text-center">
      {/* Outer Glowing Ring with Dual Spinners */}
      <div className="relative flex items-center justify-center">
        {/* Ambient Glow */}
        <div className="absolute w-20 h-20 bg-cyan-500/20 rounded-full blur-xl animate-pulse" />

        {/* Outer Spinning Gradient Ring */}
        <div className="w-16 h-16 rounded-full border-4 border-slate-200 border-t-cyan-400 border-r-purple-500 animate-spin shadow-lg shadow-cyan-400/20" />

        {/* Inner Counter-Spinning Accent Ring */}
        <div className="absolute w-10 h-10 rounded-full border-3 border-transparent border-b-amber-400 border-l-cyan-300 animate-spin [animation-duration:1.2s] [animation-direction:reverse]" />

        {/* Center Logo Icon */}
        <div className="absolute w-8 h-8 rounded-xl bg-slate-900 text-cyan-300 flex items-center justify-center shadow-md animate-pulse">
          <BookOpen className="w-4 h-4 stroke-[2.5]" />
        </div>
      </div>

      {/* Loading Label */}
      <div className="space-y-1">
        <div className="flex items-center justify-center space-x-1.5 text-xs font-black text-slate-800 tracking-wide uppercase">
          <Sparkles className="w-3.5 h-3.5 text-amber-500 animate-spin" />
          <span>EduBatch Sync</span>
        </div>
        <p className="text-xs font-semibold text-slate-500 max-w-xs">{text}</p>
      </div>
    </div>
  );

  if (fullScreen) {
    return (
      <div className="min-h-[calc(100vh-6rem)] w-full flex items-center justify-center bg-slate-50/80 backdrop-blur-sm">
        {content}
      </div>
    );
  }

  return content;
}

// 📦 Skeleton Loader for Course & Batch Cards
export function CardSkeleton({ count = 3 }) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 w-full animate-pulse">
      {Array.from({ length: count }).map((_, idx) => (
        <div key={idx} className="bg-white rounded-2xl p-5 border border-slate-200 shadow-sm space-y-4">
          <div className="h-44 bg-slate-200 rounded-xl w-full" />
          <div className="space-y-2">
            <div className="h-4 bg-slate-200 rounded-lg w-3/4" />
            <div className="h-3 bg-slate-150 bg-slate-200/60 rounded-lg w-1/2" />
          </div>
          <div className="pt-3 border-t border-slate-100 flex justify-between items-center">
            <div className="h-4 bg-slate-200 rounded-lg w-20" />
            <div className="h-8 bg-slate-200 rounded-xl w-24" />
          </div>
        </div>
      ))}
    </div>
  );
}

// 📊 Skeleton Loader for Tables & Lists
export function TableSkeleton({ rows = 5 }) {
  return (
    <div className="w-full bg-white rounded-2xl border border-slate-200/80 p-5 space-y-3 animate-pulse">
      <div className="h-6 bg-slate-200 rounded-lg w-1/4 mb-4" />
      {Array.from({ length: rows }).map((_, idx) => (
        <div key={idx} className="h-12 bg-slate-100 rounded-xl w-full flex items-center px-4 space-x-4">
          <div className="w-8 h-8 rounded-full bg-slate-200 shrink-0" />
          <div className="h-3 bg-slate-200 rounded w-1/3" />
          <div className="h-3 bg-slate-200 rounded w-1/4" />
          <div className="h-3 bg-slate-200 rounded w-1/6 ml-auto" />
        </div>
      ))}
    </div>
  );
}
