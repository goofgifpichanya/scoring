import React from 'react';
import { EVALUATION_CATEGORIES } from '../constants/evaluationData';
import { getEvaluationsForTeam } from '../utils/storage';
import { X, Award, UserCheck, Scale, Table, Clock, MessageSquare } from 'lucide-react';

export const TeamDetailModal = ({ cohortId, cohortName, teamCode, onClose }) => {
  const evaluations = getEvaluationsForTeam(cohortId, teamCode);

  const avgTotal = evaluations.length > 0
    ? Math.round((evaluations.reduce((sum, e) => sum + (parseFloat(e.totalScore) || 0), 0) / evaluations.length) * 10) / 10
    : 0;

  const categoryAvgs = {};
  EVALUATION_CATEGORIES.forEach(cat => {
    categoryAvgs[cat.id] = evaluations.length > 0
      ? Math.round((evaluations.reduce((sum, e) => sum + (parseFloat(e.scores?.[cat.id]) || 0), 0) / evaluations.length) * 10) / 10
      : 0;
  });

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md animate-fadeIn">
      <div className="bg-slate-900 border border-slate-700/80 rounded-3xl max-w-4xl w-full max-h-[90vh] overflow-y-auto shadow-2xl p-6 sm:p-8 space-y-6 text-slate-100">
        
        {/* Header */}
        <div className="flex items-start justify-between gap-4">
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center text-white font-extrabold text-xl shadow-lg shadow-indigo-500/30">
              {teamCode}
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="px-3 py-1 rounded-full text-xs font-bold bg-indigo-500/20 text-indigo-300 border border-indigo-500/30">
                  {cohortName || cohortId}
                </span>
                <span className="px-3 py-1 rounded-full text-xs font-bold bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 flex items-center gap-1">
                  <UserCheck className="w-3.5 h-3.5" />
                  <span>ประเมินแล้ว {evaluations.length} กรรมการ</span>
                </span>
              </div>
              <h2 className="text-2xl font-black text-white mt-1">
                คะแนนแยกตามกรรมการ — ทีม {teamCode}
              </h2>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-full bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Summary Banner */}
        <div className="p-5 rounded-2xl bg-gradient-to-r from-indigo-600 to-purple-600 text-white flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 shadow-xl">
          <div>
            <p className="text-xs text-indigo-100 font-medium">คะแนนเฉลี่ยรวมทุกหมวด ({evaluations.length} กรรมการ)</p>
            <p className="text-4xl font-extrabold mt-1">
              {avgTotal} <span className="text-base font-normal opacity-80">/ 100 คะแนน</span>
            </p>
          </div>
          <div className="bg-white/15 backdrop-blur-md px-4 py-2.5 rounded-xl border border-white/20 text-sm font-bold flex items-center gap-2">
            <Scale className="w-4 h-4 text-indigo-200" />
            <span>{evaluations.length} กรรมการประเมิน</span>
          </div>
        </div>

        {evaluations.length === 0 ? (
          <div className="text-center py-12 text-slate-400 space-y-3">
            <div className="text-4xl">⏳</div>
            <p className="text-base font-semibold">ยังไม่มีกรรมการคนใดลงคะแนนให้ทีมนี้</p>
          </div>
        ) : (
          <>
            {/* Table: Side-by-Side Comparison */}
            <div className="glass-panel rounded-2xl border border-slate-800 overflow-hidden shadow-lg">
              <div className="px-5 py-3.5 bg-slate-900/90 border-b border-slate-800 flex items-center gap-2 font-bold text-sm text-indigo-300">
                <Table className="w-4 h-4 text-indigo-400" />
                <span>ตารางเปรียบเทียบคะแนนรายกรรมการ (Side-by-Side Comparison)</span>
              </div>
              
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse text-xs">
                  <thead>
                    <tr className="border-b border-slate-800 bg-slate-950 text-slate-400 uppercase">
                      <th className="py-3 px-4 font-semibold">กรรมการ</th>
                      <th className="py-3 px-3 font-semibold text-center text-indigo-400 bg-indigo-950/40">รวม / 100</th>
                      {EVALUATION_CATEGORIES.map(cat => (
                        <th key={cat.id} className="py-3 px-2 font-semibold text-center whitespace-nowrap">
                          {cat.title} ({cat.maxScore})
                        </th>
                      ))}
                      <th className="py-3 px-4 font-semibold">ความคิดเห็น</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-800/80 text-slate-200">
                    {evaluations.map((ev, i) => (
                      <tr key={i} className="hover:bg-slate-800/30 transition-colors">
                        <td className="py-3 px-4 font-bold text-white whitespace-nowrap">
                          🧑‍⚖️ {ev.judgeName || 'ไม่ระบุชื่อ'}
                        </td>
                        <td className="py-3 px-3 text-center font-black text-sm text-indigo-300 bg-indigo-950/20">
                          {ev.totalScore || 0}
                        </td>
                        {EVALUATION_CATEGORIES.map(cat => {
                          const sc = ev.scores?.[cat.id] ?? 0;
                          const isHigh = sc >= cat.maxScore * 0.85;
                          return (
                            <td key={cat.id} className={`py-3 px-2 text-center font-bold ${isHigh ? 'text-emerald-400' : 'text-slate-300'}`}>
                              {sc}
                            </td>
                          );
                        })}
                        <td className="py-3 px-4 text-slate-400 italic text-xs max-w-xs truncate" title={ev.comment}>
                          {ev.comment ? `"${ev.comment}"` : '-'}
                        </td>
                      </tr>
                    ))}
                    {/* Summary Row */}
                    <tr className="bg-indigo-950/40 font-extrabold text-indigo-200 border-t-2 border-indigo-500/50">
                      <td className="py-3.5 px-4 font-black">⭐ คะแนนเฉลี่ย ({evaluations.length} คน)</td>
                      <td className="py-3.5 px-3 text-center text-base text-amber-300 bg-indigo-900/50">{avgTotal}</td>
                      {EVALUATION_CATEGORIES.map(cat => (
                        <td key={cat.id} className="py-3.5 px-2 text-center text-indigo-300">{categoryAvgs[cat.id]}</td>
                      ))}
                      <td className="py-3.5 px-4 text-indigo-400">-</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>

            {/* Detailed Cards Per Judge */}
            <div className="space-y-4 pt-2">
              <h3 className="text-base font-bold text-white flex items-center gap-2">
                <Scale className="w-4 h-4 text-purple-400" />
                <span>รายละเอียดคะแนนแต่ละหมวดของกรรมการแต่ละคน</span>
              </h3>

              <div className="grid grid-cols-1 gap-4">
                {evaluations.map((ev, idx) => (
                  <div key={idx} className="glass-panel p-5 rounded-2xl border border-slate-800 space-y-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className="p-2.5 rounded-xl bg-indigo-500/20 text-indigo-300 border border-indigo-500/30">
                          🧑‍⚖️
                        </div>
                        <div>
                          <p className="font-bold text-white text-base">{ev.judgeName || 'ไม่ระบุชื่อ'}</p>
                          {ev.timestamp && (
                            <p className="text-xs text-slate-400 flex items-center gap-1 mt-0.5">
                              <Clock className="w-3 h-3 text-slate-500" />
                              <span>{new Date(ev.timestamp).toLocaleString('th-TH')}</span>
                            </p>
                          )}
                        </div>
                      </div>

                      <div className="text-right">
                        <span className="text-2xl font-black text-indigo-400">{ev.totalScore || 0}</span>
                        <span className="text-xs text-slate-500 font-medium"> / 100 คะแนน</span>
                      </div>
                    </div>

                    {/* Progress Bar */}
                    <div className="w-full h-2 rounded-full bg-slate-800 overflow-hidden">
                      <div
                        className="h-full bg-gradient-to-r from-indigo-500 to-purple-500 rounded-full transition-all duration-500"
                        style={{ width: `${Math.min(100, ev.totalScore || 0)}%` }}
                      />
                    </div>

                    {/* Category Breakdown */}
                    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-2 pt-1">
                      {EVALUATION_CATEGORIES.map(cat => {
                        const val = ev.scores?.[cat.id] ?? 0;
                        const pct = Math.min(100, (val / cat.maxScore) * 100);
                        return (
                          <div key={cat.id} className="p-2.5 rounded-xl bg-slate-950/70 border border-slate-800/80 text-center space-y-1">
                            <p className="text-[10px] font-semibold text-slate-400 truncate">{cat.title}</p>
                            <p className="text-base font-black text-white">
                              {val} <span className="text-[10px] text-slate-500 font-normal">/{cat.maxScore}</span>
                            </p>
                            <div className="w-full h-1 bg-slate-800 rounded-full overflow-hidden">
                              <div className="h-full bg-indigo-500 rounded-full" style={{ width: `${pct}%` }} />
                            </div>
                          </div>
                        );
                      })}
                    </div>

                    {/* Comment */}
                    {ev.comment && (
                      <div className="p-3.5 rounded-xl bg-slate-950/90 border border-slate-800/80 flex items-start gap-2.5 text-xs text-slate-300 italic">
                        <MessageSquare className="w-4 h-4 text-purple-400 shrink-0 mt-0.5" />
                        <span>"{ev.comment}"</span>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </>
        )}

      </div>
    </div>
  );
};
