import React from 'react';
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  Tooltip, 
  ResponsiveContainer, 
  Cell, 
  RadarChart, 
  PolarGrid, 
  PolarAngleAxis, 
  PolarRadiusAxis, 
  Radar,
  Legend
} from 'recharts';
import { EVALUATION_CATEGORIES } from '../constants/evaluationData';

export const AnalyticsCharts = ({ teamStats }) => {
  // Filter teams that have evaluations
  const activeTeams = teamStats.filter(t => t.evaluationsCount > 0);

  if (activeTeams.length === 0) {
    return (
      <div className="glass-panel p-8 rounded-2xl border border-slate-800 text-center text-slate-400">
        ยังไม่มีข้อมูลลงคะแนนสำหรับการประมวลผลกราฟ
      </div>
    );
  }

  // Chart 1: Bar chart data of total average scores per team
  const barChartData = activeTeams.map(t => ({
    team: t.teamCode,
    cohort: t.cohortName,
    score: t.averageTotalScore,
    judges: t.evaluationsCount
  }));

  // Chart 2: Radar chart data comparing category performance across all active teams average
  const categoryRadarData = EVALUATION_CATEGORIES.map(cat => {
    let sum = 0;
    activeTeams.forEach(t => {
      sum += t.categoryAverages[cat.id] || 0;
    });
    const avgScore = activeTeams.length > 0 ? Math.round((sum / activeTeams.length) * 10) / 10 : 0;
    const avgPercent = Math.round((avgScore / cat.maxScore) * 100);

    return {
      category: cat.title,
      score: avgScore,
      maxScore: cat.maxScore,
      percentage: avgPercent
    };
  });

  const COLORS = ['#3b82f6', '#8b5cf6', '#10b981', '#f59e0b', '#f43f5e', '#06b6d4', '#ec4899'];

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      
      {/* Bar Chart: Overall Average Scores */}
      <div className="glass-panel p-6 rounded-2xl border border-slate-800 space-y-4">
        <div>
          <h3 className="text-base font-bold text-white">เปรียบเทียบคะแนนเฉลี่ยรวมทุกทีม</h3>
          <p className="text-xs text-slate-400">คะแนนเต็ม 100 คะแนนเรียงตามลำดับ</p>
        </div>

        <div className="h-72 w-full pt-2">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={barChartData} margin={{ top: 10, right: 10, left: -20, bottom: 20 }}>
              <XAxis 
                dataKey="team" 
                stroke="#94a3b8" 
                fontSize={11} 
                tickLine={false} 
              />
              <YAxis 
                stroke="#94a3b8" 
                fontSize={11} 
                domain={[0, 100]} 
              />
              <Tooltip 
                contentStyle={{ 
                  backgroundColor: '#0f172a', 
                  borderColor: '#334155', 
                  borderRadius: '12px',
                  color: '#fff',
                  fontSize: '12px'
                }} 
              />
              <Bar dataKey="score" name="คะแนนเฉลี่ย" radius={[6, 6, 0, 0]}>
                {barChartData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Radar Chart: Category Performance Overview */}
      <div className="glass-panel p-6 rounded-2xl border border-slate-800 space-y-4">
        <div>
          <h3 className="text-base font-bold text-white">ภาพรวมประสิทธิภาพแยกตามเกณฑ์ 6 หมวด</h3>
          <p className="text-xs text-slate-400">เปอร์เซ็นต์คะแนนเฉลี่ยของทุกทีมในแต่ละหมวด</p>
        </div>

        <div className="h-72 w-full pt-2">
          <ResponsiveContainer width="100%" height="100%">
            <RadarChart cx="50%" cy="50%" outerRadius="75%" data={categoryRadarData}>
              <PolarGrid stroke="#334155" />
              <PolarAngleAxis dataKey="category" stroke="#cbd5e1" fontSize={10} />
              <PolarRadiusAxis angle={30} domain={[0, 100]} stroke="#64748b" fontSize={10} />
              <Radar 
                name="เปอร์เซ็นต์คะแนน (%)" 
                dataKey="percentage" 
                stroke="#8b5cf6" 
                fill="#8b5cf6" 
                fillOpacity={0.4} 
              />
              <Tooltip 
                contentStyle={{ 
                  backgroundColor: '#0f172a', 
                  borderColor: '#334155', 
                  borderRadius: '12px',
                  color: '#fff',
                  fontSize: '12px'
                }} 
              />
            </RadarChart>
          </ResponsiveContainer>
        </div>
      </div>

    </div>
  );
};
