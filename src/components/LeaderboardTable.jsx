import React, { useState } from 'react';
import { EVALUATION_CATEGORIES, TOTAL_MAX_SCORE } from '../constants/evaluationData';
import { Trophy, Medal, MessageSquare, ChevronDown, ChevronUp, Trash2, Eye } from 'lucide-react';

export const LeaderboardTable = ({ teamStats, onDeleteRecord }) => {
  const [expandedTeamKey, setExpandedTeamKey] = useState(null);

  const toggleExpand = (key) => {
    setExpandedTeamKey(expandedTeamKey === key ? null : key);
  };

  const getRankBadge = (rank) => {
    if (rank === 1) {
      return (
        <span className="flex items-center gap-1 font-bold text-amber-300 bg-amber-400/20 border border-amber-400/40 px-2.5 py-1 rounded-full text-xs">
          <Trophy className="w-3.5 h-3.5 text-amber-400 fill-amber-400" />
          <span>อันดับ 1 (Gold)</span>
        </span>
      );
    }
    if (rank === 2) {
      return (
        <span className="flex items-center gap-1 font-bold text-slate-200 bg-slate-300/20 border border-slate-300/40 px-2.5 py-1 rounded-full text-xs">
          <Medal className="w-3.5 h-3.5 text-slate-300 fill-slate-300" />
          <span>อันดับ 2 (Silver)</span>
        </span>
      );
    }
    if (rank === 3) {
      return (
        <span className="flex items-center gap-1 font-bold text-amber-600 bg-amber-700/20 border border-amber-600/40 px-2.5 py-1 rounded-full text-xs">
          <Medal className="w-3.5 h-3.5 text-amber-600 fill-amber-600" />
          <span>อันดับ 3 (Bronze)</span>
        </span>
      );
    }
    return (
      <span className="font-semibold text-slate-400 text-sm">
        #{rank}
      </span>
    );
  };

  return (
    <div className="glass-panel rounded-2xl border border-slate-800 overflow-hidden shadow-xl">
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse text-sm">
          <thead>
            <tr className="border-b border-slate-800 bg-slate-900/90 text-slate-400 text-xs uppercase tracking-wider">
              <th className="py-4 px-4 font-semibold text-center w-16">อันดับ</th>
              <th className="py-4 px-4 font-semibold">รุ่นการอบรม</th>
              <th className="py-4 px-4 font-semibold">ทีม</th>
              <th className="py-4 px-4 font-semibold text-center">คะแนนเฉลี่ยรวม ({TOTAL_MAX_SCORE})</th>
              {EVALUATION_CATEGORIES.map(cat => (
                <th key={cat.id} className="py-4 px-3 font-semibold text-center text-[11px] whitespace-nowrap">
                  {cat.title} ({cat.maxScore})
                </th>
              ))}
              <th className="py-4 px-4 font-semibold text-center">จำนวนกรรมการ</th>
              <th className="py-4 px-4 font-semibold text-center">รายละเอียด</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-800/60 text-slate-200">
            {teamStats.map((stat, idx) => {
              const rowKey = `${stat.cohortId}_${stat.teamCode}`;
              const isExpanded = expandedTeamKey === rowKey;
              const hasEvaluations = stat.evaluationsCount > 0;

              return (
                <React.Fragment key={rowKey}>
                  <tr className={`hover:bg-slate-800/40 transition-colors ${
                    stat.rank === 1 ? 'bg-amber-950/10' : ''
                  }`}>
                    {/* Rank */}
                    <td className="py-4 px-4 text-center font-bold">
                      {hasEvaluations ? getRankBadge(stat.rank) : <span className="text-slate-600">-</span>}
                    </td>

                    {/* Cohort Name */}
                    <td className="py-4 px-4 font-medium text-xs text-slate-400">
                      {stat.cohortName}
                    </td>

                    {/* Team Code */}
                    <td className="py-4 px-4 font-bold text-white text-base">
                      <span className="px-2.5 py-1 rounded-lg bg-slate-800 border border-slate-700">
                        {stat.teamCode}
                      </span>
                    </td>

                    {/* Total Avg Score */}
                    <td className="py-4 px-4 text-center">
                      {hasEvaluations ? (
                        <div className="inline-flex items-baseline gap-1 font-extrabold text-lg text-amber-300">
                          <span>{stat.averageTotalScore}</span>
                          <span className="text-xs font-normal text-slate-500">/ 100</span>
                        </div>
                      ) : (
                        <span className="text-xs text-slate-500 italic">ยังไม่มีคะแนน</span>
                      )}
                    </td>

                    {/* 6 Categories Scores */}
                    {EVALUATION_CATEGORIES.map(cat => {
                      const avg = stat.categoryAverages[cat.id];
                      return (
                        <td key={cat.id} className="py-4 px-3 text-center text-xs font-semibold text-slate-300">
                          {hasEvaluations ? (
                            <span className={avg >= cat.maxScore * 0.85 ? 'text-emerald-400 font-bold' : ''}>
                              {avg}
                            </span>
                          ) : (
                            <span className="text-slate-600">-</span>
                          )}
                        </td>
                      );
                    })}

                    {/* Judge Count */}
                    <td className="py-4 px-4 text-center">
                      <span className={`px-2.5 py-1 rounded-full text-xs font-medium ${
                        hasEvaluations ? 'bg-blue-500/20 text-blue-300 border border-blue-500/30' : 'bg-slate-800 text-slate-500'
                      }`}>
                        {stat.evaluationsCount} คน
                      </span>
                    </td>

                    {/* Actions */}
                    <td className="py-4 px-4 text-center">
                      {hasEvaluations ? (
                        <button
                          onClick={() => toggleExpand(rowKey)}
                          className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 transition-colors inline-flex items-center gap-1 text-xs"
                        >
                          <Eye className="w-3.5 h-3.5 text-blue-400" />
                          <span>ดูความเห็น</span>
                          {isExpanded ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
                        </button>
                      ) : (
                        <span className="text-slate-600 text-xs">-</span>
                      )}
                    </td>
                  </tr>

                  {/* Expanded Row for Comments & Judge Detail */}
                  {isExpanded && hasEvaluations && (
                    <tr className="bg-slate-900/90 border-b border-slate-800">
                      <td colSpan={6 + EVALUATION_CATEGORIES.length} className="p-4 sm:p-6 space-y-3">
                        <div className="flex items-center gap-2 text-xs font-bold text-slate-300">
                          <MessageSquare className="w-4 h-4 text-purple-400" />
                          <span>ความคิดเห็นของกรรมการสำหรับทีม {stat.teamCode}:</span>
                        </div>

                        {stat.comments.length > 0 ? (
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                            {stat.comments.map((c, i) => (
                              <div key={i} className="p-3 rounded-xl bg-slate-950/80 border border-slate-800 space-y-1">
                                <div className="text-xs font-semibold text-blue-400">{c.judgeName}</div>
                                <p className="text-xs text-slate-300 italic">"{c.text}"</p>
                              </div>
                            ))}
                          </div>
                        ) : (
                          <p className="text-xs text-slate-500 italic">ไม่มีความคิดเห็นเพิ่มเติม</p>
                        )}
                      </td>
                    </tr>
                  )}
                </React.Fragment>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
};
