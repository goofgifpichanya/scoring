import React from 'react';
import { EVALUATION_CATEGORIES, TOTAL_MAX_SCORE } from '../constants/evaluationData';
import { CheckCircle2, Edit3, ShieldAlert, Award, MessageSquare, UserCheck, Users } from 'lucide-react';

export const ReviewModal = ({ isOpen, onClose, onConfirm, evaluationData, cohortName, teamName }) => {
  if (!isOpen || !evaluationData) return null;

  const { judgeName, scores, comment, totalScore } = evaluationData;

  // Grade rating calculator
  const getRating = (score) => {
    if (score >= 90) return { label: 'ดีเยี่ยมอย่างยิ่ง (Excellent)', color: 'text-amber-400 bg-amber-400/10 border-amber-400/30' };
    if (score >= 80) return { label: 'ดีมาก (Very Good)', color: 'text-emerald-400 bg-emerald-400/10 border-emerald-400/30' };
    if (score >= 70) return { label: 'ดี (Good)', color: 'text-blue-400 bg-blue-400/10 border-blue-400/30' };
    if (score >= 60) return { label: 'ผ่านเกณฑ์ (Passed)', color: 'text-indigo-400 bg-indigo-400/10 border-indigo-400/30' };
    return { label: 'ควรปรับปรุง (Needs Improvement)', color: 'text-rose-400 bg-rose-400/10 border-rose-400/30' };
  };

  const rating = getRating(totalScore);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md animate-fadeIn">
      <div className="glass-panel w-full max-w-2xl rounded-3xl p-6 sm:p-8 border border-slate-700/80 shadow-2xl max-h-[90vh] overflow-y-auto space-y-6 relative">
        
        {/* Header */}
        <div className="flex items-center justify-between border-b border-slate-700/60 pb-4">
          <div className="flex items-center gap-3">
            <div className="p-3 rounded-2xl bg-blue-500/10 text-blue-400 border border-blue-500/20">
              <ShieldAlert className="w-6 h-6" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-white flex items-center gap-2">
                สรุปและยืนยันการบันทึกคะแนน
              </h2>
              <p className="text-xs text-slate-400">
                โปรดตรวจสอบความถูกต้องของคะแนนทั้งหมดก่อนยืนยันบันทึก
              </p>
            </div>
          </div>
        </div>

        {/* Info Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 p-4 rounded-2xl bg-slate-900/80 border border-slate-800">
          <div className="flex items-center gap-2.5">
            <UserCheck className="w-4 h-4 text-cyan-400 shrink-0" />
            <div>
              <p className="text-[11px] text-slate-400">กรรมการผู้ประเมิน</p>
              <p className="text-sm font-semibold text-slate-100">{judgeName || 'ไม่ระบุ'}</p>
            </div>
          </div>

          <div className="flex items-center gap-2.5">
            <Users className="w-4 h-4 text-purple-400 shrink-0" />
            <div>
              <p className="text-[11px] text-slate-400">รุ่นการอบรม</p>
              <p className="text-sm font-semibold text-slate-100">{cohortName}</p>
            </div>
          </div>

          <div className="flex items-center gap-2.5">
            <Award className="w-4 h-4 text-amber-400 shrink-0" />
            <div>
              <p className="text-[11px] text-slate-400">ทีมที่ประเมิน</p>
              <p className="text-sm font-bold text-amber-300">{teamName}</p>
            </div>
          </div>
        </div>

        {/* Category Breakdown Table */}
        <div className="space-y-3">
          <h3 className="text-sm font-semibold text-slate-300 flex items-center gap-2">
            <span>รายการคะแนนแยกตามเกณฑ์ 6 หมวด</span>
          </h3>

          <div className="space-y-2">
            {EVALUATION_CATEGORIES.map((category) => {
              const catScore = scores[category.id] ?? 0;
              const catPercent = (catScore / category.maxScore) * 100;
              return (
                <div 
                  key={category.id} 
                  className="flex items-center justify-between p-3 rounded-xl bg-slate-900/60 border border-slate-800/80 hover:border-slate-700 transition-colors"
                >
                  <div className="flex items-center gap-3">
                    <div className={`w-2.5 h-2.5 rounded-full bg-gradient-to-r ${category.color}`} />
                    <span className="text-sm font-medium text-slate-200">{category.title}</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="w-24 hidden sm:block bg-slate-800 rounded-full h-1.5 overflow-hidden">
                      <div 
                        className={`h-full bg-gradient-to-r ${category.color}`} 
                        style={{ width: `${catPercent}%` }} 
                      />
                    </div>
                    <div className="text-sm font-bold text-white min-w-[60px] text-right">
                      <span className="text-blue-400">{catScore}</span>
                      <span className="text-slate-500 font-normal text-xs"> / {category.maxScore}</span>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Total Score Summary Box */}
        <div className="p-5 rounded-2xl bg-gradient-to-r from-slate-900 via-blue-950/40 to-slate-900 border border-blue-500/30 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div>
            <p className="text-xs font-medium text-slate-400">คะแนนประเมินรวมสุทธิ</p>
            <div className="flex items-baseline gap-2 mt-0.5">
              <span className="text-4xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-blue-400 via-cyan-300 to-indigo-300">
                {totalScore}
              </span>
              <span className="text-sm text-slate-400">/ {TOTAL_MAX_SCORE} คะแนน</span>
            </div>
          </div>

          <div className={`px-4 py-2 rounded-xl border text-xs font-semibold ${rating.color}`}>
            {rating.label}
          </div>
        </div>

        {/* Judge Comments Review */}
        {comment && comment.trim() !== '' && (
          <div className="p-4 rounded-xl bg-slate-900/60 border border-slate-800 space-y-1">
            <div className="flex items-center gap-2 text-xs font-semibold text-slate-300">
              <MessageSquare className="w-3.5 h-3.5 text-purple-400" />
              <span>ความคิดเห็นเพิ่มเติมจากกรรมการ:</span>
            </div>
            <p className="text-xs text-slate-300 italic pl-5 whitespace-pre-wrap">
              "{comment}"
            </p>
          </div>
        )}

        {/* Modal Action Buttons */}
        <div className="flex flex-col-reverse sm:flex-row items-center justify-end gap-3 pt-3 border-t border-slate-800">
          <button
            type="button"
            onClick={onClose}
            className="w-full sm:w-auto px-5 py-2.5 rounded-xl border border-slate-700 bg-slate-800/80 hover:bg-slate-700 text-slate-300 font-medium text-sm transition-all flex items-center justify-center gap-2"
          >
            <Edit3 className="w-4 h-4" />
            <span>กลับไปแก้ไขคะแนน</span>
          </button>

          <button
            type="button"
            onClick={onConfirm}
            className="w-full sm:w-auto px-6 py-2.5 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-400 hover:to-teal-500 text-white font-semibold text-sm shadow-lg shadow-emerald-600/30 hover:shadow-emerald-500/50 transition-all flex items-center justify-center gap-2"
          >
            <CheckCircle2 className="w-4 h-4" />
            <span>ยืนยันบันทึกคะแนน</span>
          </button>
        </div>

      </div>
    </div>
  );
};
