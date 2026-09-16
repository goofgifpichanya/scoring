import React from 'react';
import { Award, BarChart3, Sparkles, Layers } from 'lucide-react';

export const Navbar = ({ activeTab, setActiveTab }) => {
  return (
    <header className="sticky top-0 z-40 glass-panel border-b border-slate-800/80 backdrop-blur-xl">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          
          {/* Logo / Title */}
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-blue-600 via-indigo-600 to-purple-600 flex items-center justify-center text-white shadow-lg shadow-blue-500/20">
              <Award className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <span className="font-extrabold text-lg text-white tracking-wide">SCORING SYSTEM</span>
                <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-blue-500/20 text-blue-400 border border-blue-500/30">
                  2 รุ่นอบรม
                </span>
              </div>
              <p className="text-xs text-slate-400">ระบบประเมินและสรุปผลคะแนนผลงาน</p>
            </div>
          </div>

          {/* Navigation View Switcher Tabs */}
          <nav className="flex items-center gap-1.5 bg-slate-950/60 p-1.5 rounded-2xl border border-slate-800/80">
            <button
              onClick={() => setActiveTab('judge')}
              className={`flex items-center gap-2 px-5 py-2.5 rounded-xl font-semibold text-xs sm:text-sm transition-all duration-300 ${
                activeTab === 'judge'
                  ? 'bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-md shadow-blue-600/30'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900/60'
              }`}
            >
              <Award className="w-4 h-4" />
              <span>หน้ากรรมการลงคะแนน</span>
            </button>

            <button
              onClick={() => setActiveTab('admin')}
              className={`flex items-center gap-2 px-5 py-2.5 rounded-xl font-semibold text-xs sm:text-sm transition-all duration-300 ${
                activeTab === 'admin'
                  ? 'bg-gradient-to-r from-purple-600 to-pink-600 text-white shadow-md shadow-purple-600/30'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900/60'
              }`}
            >
              <BarChart3 className="w-4 h-4" />
              <span>หลังบ้าน / Admin Dashboard</span>
            </button>
          </nav>

        </div>
      </div>
    </header>
  );
};
