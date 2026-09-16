import React, { useState, useEffect } from 'react';
import { COHORTS } from '../constants/evaluationData';
import { 
  calculateTeamStats, 
  exportToCSV, 
  exportToJSON, 
  clearAllEvaluations, 
  seedDemoData, 
  getEvaluations 
} from '../utils/storage';
import { LeaderboardTable } from './LeaderboardTable';
import { AnalyticsCharts } from './AnalyticsCharts';
import { 
  BarChart3, 
  Download, 
  Trash2, 
  Sparkles, 
  Users, 
  Trophy, 
  CheckCircle2, 
  FileSpreadsheet, 
  DatabaseBackup,
  RefreshCw
} from 'lucide-react';

export const AdminDashboard = ({ onDataChange }) => {
  const [selectedCohortId, setSelectedCohortId] = useState('all');
  const [teamStats, setTeamStats] = useState([]);
  const [evaluationsCount, setEvaluationsCount] = useState(0);

  const refreshData = () => {
    const stats = calculateTeamStats(selectedCohortId);
    setTeamStats(stats);
    const evs = getEvaluations();
    setEvaluationsCount(evs.length);
  };

  useEffect(() => {
    refreshData();
  }, [selectedCohortId]);

  const handleSeedData = () => {
    if (confirm('คุณต้องการสร้างข้อมูลคะแนนจำลองเพื่อทดสอบระบบใช่หรือไม่? (ข้อมูลจะสุ่มคะแนนสมจริงให้กับทุกทีม)')) {
      seedDemoData();
      refreshData();
      if (onDataChange) onDataChange();
    }
  };

  const handleClearData = () => {
    if (confirm('⚠️ เตือน: คุณต้องการลบข้อมูลการลงคะแนนทั้งหมดใช่หรือไม่? (กระบวนการนี้ไม่สามารถย้อนกลับได้)')) {
      clearAllEvaluations();
      refreshData();
      if (onDataChange) onDataChange();
    }
  };

  // Top Teams for Stats Cards
  const cohort1Stats = calculateTeamStats('cohort_1').filter(t => t.evaluationsCount > 0);
  const cohort2Stats = calculateTeamStats('cohort_2').filter(t => t.evaluationsCount > 0);

  const topTeamCohort1 = cohort1Stats.length > 0 ? cohort1Stats[0] : null;
  const topTeamCohort2 = cohort2Stats.length > 0 ? cohort2Stats[0] : null;

  return (
    <div className="max-w-7xl mx-auto space-y-8 pb-12">
      
      {/* Top Header & Actions */}
      <div className="glass-panel rounded-3xl p-6 sm:p-8 border border-slate-700/60 shadow-xl relative overflow-hidden">
        <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6">
          <div>
            <div className="flex items-center gap-2 text-xs font-semibold text-emerald-400 bg-emerald-500/10 px-3 py-1 rounded-full border border-emerald-500/20 w-fit mb-2">
              <BarChart3 className="w-3.5 h-3.5" />
              <span>หลังบ้าน / Admin Dashboard</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-bold text-white tracking-tight">
              สรุปผลและรายงานคะแนนประเมิน
            </h1>
            <p className="text-sm text-slate-400 mt-1">
              ตารางสรุปอันดับ (Leaderboard), คะแนนเฉลี่ย 6 หมวด และกราฟวิเคราะห์ผลคะแนน
            </p>
          </div>

          {/* Action Toolbar */}
          <div className="flex flex-wrap items-center gap-2 w-full lg:w-auto">
            <button
              onClick={handleSeedData}
              className="px-4 py-2.5 rounded-xl bg-purple-600/30 hover:bg-purple-600/50 text-purple-200 border border-purple-500/40 text-xs font-semibold transition-all flex items-center gap-2"
              title="สร้างข้อมูลจำลองเพื่อทดสอบ"
            >
              <Sparkles className="w-4 h-4 text-purple-400" />
              <span>สร้างข้อมูลจำลอง (Demo Data)</span>
            </button>

            <button
              onClick={exportToCSV}
              className="px-4 py-2.5 rounded-xl bg-emerald-600/30 hover:bg-emerald-600/50 text-emerald-200 border border-emerald-500/40 text-xs font-semibold transition-all flex items-center gap-2"
              title="ส่งออกรายงานเป็นไฟล์ CSV/Excel"
            >
              <FileSpreadsheet className="w-4 h-4 text-emerald-400" />
              <span>ส่งออก CSV/Excel</span>
            </button>

            <button
              onClick={exportToJSON}
              className="px-4 py-2.5 rounded-xl bg-blue-600/30 hover:bg-blue-600/50 text-blue-200 border border-blue-500/40 text-xs font-semibold transition-all flex items-center gap-2"
              title="สำรองข้อมูล JSON"
            >
              <DatabaseBackup className="w-4 h-4 text-blue-400" />
              <span>สำรอง JSON</span>
            </button>

            <button
              onClick={handleClearData}
              className="px-3 py-2.5 rounded-xl bg-rose-950/40 hover:bg-rose-900/60 text-rose-300 border border-rose-800/50 text-xs font-semibold transition-all flex items-center gap-1.5"
              title="ลบข้อมูลทั้งหมด"
            >
              <Trash2 className="w-4 h-4 text-rose-400" />
              <span>รีเซ็ต</span>
            </button>
          </div>
        </div>
      </div>

      {/* KPI Stats Overview Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        
        {/* Total Submissions */}
        <div className="glass-card p-5 rounded-2xl border border-slate-800 flex items-center gap-4">
          <div className="p-3.5 rounded-2xl bg-blue-500/10 text-blue-400 border border-blue-500/20">
            <Users className="w-6 h-6" />
          </div>
          <div>
            <p className="text-xs text-slate-400 font-medium">การลงคะแนนทั้งหมด</p>
            <p className="text-2xl font-bold text-white mt-0.5">{evaluationsCount} <span className="text-xs text-slate-500 font-normal">รายการ</span></p>
          </div>
        </div>

        {/* Top Cohort 1 */}
        <div className="glass-card p-5 rounded-2xl border border-slate-800 flex items-center gap-4">
          <div className="p-3.5 rounded-2xl bg-amber-500/10 text-amber-400 border border-amber-500/20">
            <Trophy className="w-6 h-6" />
          </div>
          <div>
            <p className="text-xs text-slate-400 font-medium">อันดับ 1 (รุ่นที่ 1)</p>
            <p className="text-xl font-bold text-amber-300 mt-0.5">
              {topTeamCohort1 ? `${topTeamCohort1.teamCode} (${topTeamCohort1.averageTotalScore} คะแนน)` : 'ยังไม่มีผล'}
            </p>
          </div>
        </div>

        {/* Top Cohort 2 */}
        <div className="glass-card p-5 rounded-2xl border border-slate-800 flex items-center gap-4">
          <div className="p-3.5 rounded-2xl bg-purple-500/10 text-purple-400 border border-purple-500/20">
            <Trophy className="w-6 h-6" />
          </div>
          <div>
            <p className="text-xs text-slate-400 font-medium">อันดับ 1 (รุ่นที่ 2)</p>
            <p className="text-xl font-bold text-purple-300 mt-0.5">
              {topTeamCohort2 ? `${topTeamCohort2.teamCode} (${topTeamCohort2.averageTotalScore} คะแนน)` : 'ยังไม่มีผล'}
            </p>
          </div>
        </div>

        {/* Total Evaluated Teams Count */}
        <div className="glass-card p-5 rounded-2xl border border-slate-800 flex items-center gap-4">
          <div className="p-3.5 rounded-2xl bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
            <CheckCircle2 className="w-6 h-6" />
          </div>
          <div>
            <p className="text-xs text-slate-400 font-medium">ทีมที่ได้รับการประเมินแล้ว</p>
            <p className="text-2xl font-bold text-white mt-0.5">
              {teamStats.filter(t => t.evaluationsCount > 0).length} / {teamStats.length} <span className="text-xs text-slate-500 font-normal">ทีม</span>
            </p>
          </div>
        </div>

      </div>

      {/* Cohort Selector Tabs & Leaderboard Table */}
      <div className="space-y-4">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2 bg-slate-900/80 p-1.5 rounded-2xl border border-slate-800 w-full sm:w-auto">
            <button
              onClick={() => setSelectedCohortId('all')}
              className={`px-5 py-2 rounded-xl text-xs font-semibold transition-all ${
                selectedCohortId === 'all'
                  ? 'bg-blue-600 text-white shadow'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              รวมทุกรุ่น (31 ทีม)
            </button>

            {COHORTS.map(c => (
              <button
                key={c.id}
                onClick={() => setSelectedCohortId(c.id)}
                className={`px-5 py-2 rounded-xl text-xs font-semibold transition-all ${
                  selectedCohortId === c.id
                    ? 'bg-blue-600 text-white shadow'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                {c.name} ({c.teamCount} ทีม)
              </button>
            ))}
          </div>

          <button
            onClick={refreshData}
            className="text-xs text-slate-400 hover:text-white flex items-center gap-1 bg-slate-900/40 px-3 py-1.5 rounded-xl border border-slate-800 transition-colors"
          >
            <RefreshCw className="w-3.5 h-3.5 text-blue-400" />
            <span>อัปเดตข้อมูล</span>
          </button>
        </div>

        {/* Leaderboard Table */}
        <LeaderboardTable 
          teamStats={teamStats}
          onDeleteRecord={refreshData} 
        />
      </div>

      {/* Analytics Visual Charts */}
      <div className="space-y-4">
        <h2 className="text-xl font-bold text-white flex items-center gap-2">
          <span>วิเคราะห์ผลคะแนนและเปรียบเทียบ</span>
        </h2>
        <AnalyticsCharts teamStats={teamStats} />
      </div>

    </div>
  );
};
