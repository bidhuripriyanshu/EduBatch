import React, { useState } from 'react';
import { 
  PhoneCall, 
  Mail, 
  MapPin, 
  Clock, 
  Send, 
  CheckCircle2, 
  MessageSquare,
  Sparkles
} from 'lucide-react';

export default function Contact() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: ''
  });

  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    setSubmitted(true);
    setTimeout(() => {
      setSubmitted(false);
      setFormData({ name: '', email: '', subject: '', message: '' });
    }, 4000);
  };

  const contactCards = [
    {
      icon: PhoneCall,
      title: 'Call Us Directly',
      details: '+91 98765 43210',
      subtext: 'Mon - Sat: 9:00 AM - 7:00 PM IST',
      action: 'tel:+919876543210'
    },
    {
      icon: Mail,
      title: 'Email Support',
      details: 'support@edubatch.com',
      subtext: 'We typically respond within 2 hours',
      action: 'mailto:support@edubatch.com'
    },
    {
      icon: MapPin,
      title: 'Headquarters',
      details: 'EduBatch Tower, Tech Park Road',
      subtext: 'Bengaluru, Karnataka 560100, India',
      action: '#'
    }
  ];

  return (
    <div className="min-h-screen bg-slate-50 py-10 px-4 sm:px-6 lg:px-12 space-y-12">
      
      {/* Hero Banner */}
      <div className="bg-gradient-to-r from-purple-950 via-purple-900 to-indigo-950 rounded-3xl p-8 lg:p-12 text-white shadow-xl text-center space-y-4 relative overflow-hidden">
        <div className="inline-flex items-center space-x-2 bg-purple-800/60 border border-purple-600/50 px-4 py-1.5 rounded-full text-xs font-semibold text-cyan-300">
          <Sparkles className="w-4 h-4 text-cyan-400" />
          <span>Get In Touch</span>
        </div>

        <h1 className="text-3xl lg:text-5xl font-black tracking-tight leading-tight">
          We’re Here to Help You{' '}
          <span className="bg-gradient-to-r from-cyan-300 via-sky-200 to-amber-300 bg-clip-text text-transparent">
            Succeed
          </span>
        </h1>

        <p className="text-purple-200 text-sm max-w-xl mx-auto leading-relaxed">
          Have questions about course enrollments, batch timing, fee payments, or platform access? Contact our team.
        </p>
      </div>

      {/* Contact Info Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-6xl mx-auto">
        {contactCards.map((card) => {
          const Icon = card.icon;
          return (
            <a
              key={card.title}
              href={card.action}
              className="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-sm hover:shadow-md transition-all flex flex-col justify-between space-y-4 group"
            >
              <div className="space-y-3">
                <div className="w-12 h-12 rounded-xl bg-cyan-100 text-cyan-700 flex items-center justify-center group-hover:bg-cyan-400 group-hover:text-slate-950 transition-colors">
                  <Icon className="w-6 h-6" />
                </div>
                <h3 className="text-base font-bold text-slate-900">{card.title}</h3>
                <p className="text-sm font-black text-slate-800">{card.details}</p>
                <p className="text-xs text-slate-500">{card.subtext}</p>
              </div>
            </a>
          );
        })}
      </div>

      {/* Main Contact Form Section */}
      <div className="max-w-4xl mx-auto bg-white p-8 lg:p-12 rounded-3xl border border-slate-200/80 shadow-sm space-y-6">
        
        <div className="space-y-2 text-center md:text-left">
          <h2 className="text-2xl font-black text-slate-900">Send Us a Message</h2>
          <p className="text-xs text-slate-500">Fill out the form below and our academic counseling team will reach out to you.</p>
        </div>

        {submitted ? (
          <div className="bg-emerald-50 border border-emerald-300 p-6 rounded-2xl text-center space-y-2 text-emerald-800 animate-fade-in">
            <CheckCircle2 className="w-10 h-10 text-emerald-600 mx-auto" />
            <h3 className="text-base font-bold">Thank You! Your message has been sent.</h3>
            <p className="text-xs text-emerald-700">We will respond to your registered email address shortly.</p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-5">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              <div>
                <label className="text-xs font-bold text-slate-700 uppercase tracking-wider block mb-1.5">Your Full Name</label>
                <input
                  type="text"
                  placeholder="e.g. Aarav Mehta"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:outline-none focus:ring-2 focus:ring-cyan-400"
                  required
                />
              </div>

              <div>
                <label className="text-xs font-bold text-slate-700 uppercase tracking-wider block mb-1.5">Email Address</label>
                <input
                  type="email"
                  placeholder="e.g. aarav@example.com"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:outline-none focus:ring-2 focus:ring-cyan-400"
                  required
                />
              </div>
            </div>

            <div>
              <label className="text-xs font-bold text-slate-700 uppercase tracking-wider block mb-1.5">Subject</label>
              <input
                type="text"
                placeholder="e.g. Inquiry about Batch Schedule"
                value={formData.subject}
                onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:outline-none focus:ring-2 focus:ring-cyan-400"
                required
              />
            </div>

            <div>
              <label className="text-xs font-bold text-slate-700 uppercase tracking-wider block mb-1.5">Message</label>
              <textarea
                rows="4"
                placeholder="Type your message or inquiry here..."
                value={formData.message}
                onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:outline-none focus:ring-2 focus:ring-cyan-400"
                required
              ></textarea>
            </div>

            <button
              type="submit"
              className="bg-cyan-400 hover:bg-cyan-300 text-slate-950 font-bold px-8 py-3.5 rounded-full text-xs shadow-md transition-all flex items-center justify-center space-x-2 cursor-pointer"
            >
              <Send className="w-4 h-4" />
              <span>Send Message</span>
            </button>
          </form>
        )}

      </div>

    </div>
  );
}
