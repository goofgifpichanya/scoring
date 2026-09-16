import React, { useState } from 'react';
import { EVALUATION_CATEGORIES } from '../constants/evaluationData';
import { BarChart3, PieChart, Sparkles } from 'lucide-react';

export const AnalyticsCharts = ({ teamStats }) => {
  const [hoveredTeam, setHoveredTeam] = useState(null);

  // Filter teams with at least 1 evaluation
  const activeTeams = teamStats.filter(t => t.evaluationsCount > 0);

  if (activeTeams.length === 0) {
    return (
      <div className="glass-panel p-8 rounded-2xl border border-slate-800 text-center text-slate-400 space-y-2">
        <PieChart className="w-10 h-10 text-slate-600 mx-auto animate-pulse" />
        <p className="font-semibold text-slate-300">ยังไม่มีข้อมูลคะแนนสำหรับการแสดงผลกราฟ</p>
        <p className="text-xs text-slate-500">
          สามารถกดปุ่ม <span className="text-purple-400 font-semibold">"สร้างข้อมูลจำลอง (Demo Data)"</span> ด้านบนเพื่อทดสอบการแสดงผลกราฟและตารางได้ทันที
        </p>
      </div>
    );
  }

  // Max score for relative bar height calculation
  const maxScoreFound = Math.max(...activeTeams.map(t => t.averageTotalScore), 100);

  // Calculate category averages across active teams
  const categorySummary = EVALUATION_CATEGORIES.map(cat => {
    let sum = 0;
    activeTeams.forEach(t => {
      sum += t.categoryAverages[cat.id] || 0;
    });
    const avgScore = Math.round((sum / activeTeams.length) * 10) / 10;
    const percentage = Math.round((avgScore / cat.maxScore) * 100);
    return {
      ...cat,
      avgScore,
      percentage
    };
  });

  const BAR_COLORS = [
    'from-blue-500 to-indigo-600',
    'from-purple-500 to-pink-600',
    'from-emerald-400 to-teal-600',
    'from-amber-400 to-orange-500',
    'from-cyan-400 to-blue-600',
    'from-rose-500 to-red-600'
  ];

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      
      {/* 1. Bar Chart: Overall Average Scores */}
      <div className="glass-panel p-6 rounded-2xl border border-slate-800 space-y-4 relative">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-base font-bold text-white flex items-center gap-2">
              <BarChart3 className="w-5 h-5 text-blue-400" />
              <span>เปรียบเทียบคะแนนเฉลี่ยรวมทุกทีม</span>
            </h3>
            <p className="text-xs text-slate-400">เรียงลำดับคะแนนสุทธิเต็ม 100 คะแนน</p>
          </div>
          <span className="px-2.5 py-1 rounded-full text-xs font-semibold bg-blue-500/10 text-blue-400 border border-blue-500/20">
            {activeTeams.length} ทีม
          </span>
        </div>

        {/* Custom SVG Bar Chart */}
        <div className="space-y-3 pt-4">
          {activeTeams.map((team, index) => {
            const percentage = (team.averageTotalScore / maxScoreFound) * 100;
            const gradientColor = BAR_COLORS[index % BAR_COLORS.length];
            const isHovered = hoveredTeam === team.teamCode;

            return (
              <div 
                key={`${team.cohortId}_${team.teamCode}`}
                onMouseEnter={() => setHoveredTeam(team.teamCode)}
                onMouseLeave={() => setHoveredTeam(null)}
                className={`space-y-1 p-2 rounded-xl transition-all duration-200 ${
                  isHovered ? 'bg-slate-800/80 scale-[1.01]' : 'hover:bg-slate-900/40'
                }`}
              >
                <div className="flex items-center justify-between text-xs">
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-slate-200 px-2 py-0.5 rounded bg-slate-800 border border-slate-700">
                      {team.teamCode}
                    </span>
                    <span className="text-[11px] text-slate-400">({team.cohortName})</span>
                  </div>
                  <div className="font-extrabold text-amber-300 flex items-baseline gap-1">
                    <span className="text-sm">{team.averageTotalScore}</span>
                    <span className="text-[10px] text-slate-500 font-normal">/ 100</span>
                  </div>
                </div>

                {/* Progress Bar Container */}
                <div className="w-full bg-slate-900 rounded-full h-3.5 overflow-hidden border border-slate-800 p-0.5">
                  <div
                    className={`h-full rounded-full bg-gradient-to-r ${gradientColor} transition-all duration-500 shadow-sm`}
                    style={{ width: `${Math.max(5, percentage)}%` }}
                  />
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* 2. Category Breakdown Performance Overview */}
      <div className="glass-panel p-6 rounded-2xl border border-slate-800 space-y-4">
        <div>
          <h3 className="text-base font-bold text-white flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-purple-400" />
            <span>ภาพรวมประสิทธิภาพแยกตามเกณฑ์ 6 หมวด</span>
          </h3>
          <p className="text-xs text-slate-400">เปอร์เซ็นต์คะแนนเฉลี่ยของทุกทีมแบ่งตามเกณฑ์</p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
          {categorySummary.map((cat) => (
            <div key={cat.id} className="p-4 rounded-xl glass-card border border-slate-800/80 space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-xs font-semibold text-slate-200">{cat.title}</span>
                <span className="text-xs font-bold text-purple-300">
                  {cat.avgScore} <span className="text-[10px] text-slate-500 font-normal">/ {cat.maxScore}</span>
                </span>
              </div>

              <div className="w-full bg-slate-900 rounded-full h-2 overflow-hidden border border-slate-800">
                <div 
                  className={`h-full rounded-full bg-gradient-to-r ${cat.color}`}
                  style={{ width: `${cat.percentage}%` }}
                />
              </div>

              <div className="flex items-center justify-between text-[11px] text-slate-400 pt-0.5">
                <span>อัตราคะแนนเฉลี่ย</span>
                <span className="font-bold text-slate-300">{cat.percentage}%</span>
              </div>
            </div>
          ))}
        </div>
      </div>

    </div>
  );
};
