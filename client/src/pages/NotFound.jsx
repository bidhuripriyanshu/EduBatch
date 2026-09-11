import React from 'react';
import { Link } from 'react-router-dom';

export default function NotFound() {
  return (
    <div className="min-h-[calc(100vh-10rem)] w-full flex items-center justify-center bg-white py-16 px-6 lg:px-16">
      <div className="max-w-5xl w-full grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
        
        {/* Left Side 404 Image */}
        <div className="flex justify-center items-center">
          <img 
            src="/404.png" 
            alt="404 Page Not Found" 
            className="w-full max-w-md object-contain transition-transform duration-300 hover:scale-105"
          />
        </div>

        {/* Right Side Text & Action Button */}
        <div className="space-y-6 text-center md:text-left">
          <h1 className="text-4xl lg:text-5xl font-black text-slate-900 tracking-tight leading-tight">
            404 Page Not Found
          </h1>
          
          <p className="text-slate-600 text-sm md:text-base leading-relaxed max-w-md mx-auto md:mx-0">
            The page you are looking for was moved, removed, renamed or might never existed.
          </p>

          <div className="pt-2">
            <Link
              to="/"
              className="inline-flex items-center space-x-2 bg-cyan-500 hover:bg-cyan-600 text-white font-semibold px-6 py-3 rounded-lg text-sm transition-all shadow-md hover:shadow-cyan-500/20"
            >
              <span>Go to Home</span>
            </Link>
          </div>
        </div>

      </div>
    </div>
  );
}
