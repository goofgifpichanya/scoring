import React, { useState } from 'react';
import { Navbar } from './components/Navbar';
import { JudgeView } from './components/JudgeView';
import { AdminDashboard } from './components/AdminDashboard';
import { CheckCircle2, X } from 'lucide-react';

export function App() {
  const [activeTab, setActiveTab] = useState('judge'); // 'judge' | 'admin'
  const [toastMessage, setToastMessage] = useState(null);

  const handleSaveSuccess = (record) => {
    setToastMessage(`บันทึกคะแนนทีม ${record.teamCode} สำเร็จแล้ว! (${record.totalScore} คะแนน)`);
    setTimeout(() => {
      setToastMessage(null);
    }, 4500);
  };

  return (
    <div className="min-h-screen flex flex-col font-sans bg-slate-950 text-slate-100 selection:bg-blue-500 selection:text-white">
      
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed top-24 right-4 z-50 animate-bounce">
          <div className="flex items-center gap-3 px-5 py-3 rounded-2xl bg-emerald-900/90 border border-emerald-500/50 text-emerald-100 shadow-2xl backdrop-blur-md">
            <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" />
            <span className="text-sm font-semibold">{toastMessage}</span>
            <button
              onClick={() => setToastMessage(null)}
              className="p-1 rounded-lg hover:bg-emerald-800 text-emerald-300 transition-colors ml-2"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

      {/* Navigation Bar */}
      <Navbar activeTab={activeTab} setActiveTab={setActiveTab} />

      {/* Main Content Area */}
      <main className="flex-1 px-4 sm:px-6 lg:px-8 py-8">
        {activeTab === 'judge' ? (
          <JudgeView onSaveSuccess={handleSaveSuccess} />
        ) : (
          <AdminDashboard />
        )}
      </main>

      {/* Footer */}
      <footer className="border-t border-slate-900 py-6 text-center text-xs text-slate-500 glass-panel">
        <p>© 2026 ระบบลงคะแนนประเมินผลการอบรม (Scoring System) — รองรับ 2 รุ่นอบรม (31 ทีม)</p>
      </footer>
    </div>
  );
}

export default App;
