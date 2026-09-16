import React, { useState, useEffect } from 'react';
import { COHORTS, EVALUATION_CATEGORIES, TOTAL_MAX_SCORE, DEFAULT_JUDGES } from '../constants/evaluationData';
import { CategoryCard } from './CategoryCard';
import { ReviewModal } from './ReviewModal';
import { saveEvaluation, getEvaluations } from '../utils/storage';
import confetti from 'canvas-confetti';
import { 
  UserCheck, 
  Users, 
  CheckCircle2, 
  AlertTriangle, 
  Send, 
  RotateCcw, 
  Award,
  Sparkles,
  Info
} from 'lucide-react';

export const JudgeView = ({ onSaveSuccess }) => {
  const [selectedCohortId, setSelectedCohortId] = useState('cohort_1');
  const [selectedTeamCode, setSelectedTeamCode] = useState('');
  const [judgeName, setJudgeName] = useState('กรรมการ 1');
  const [customJudgeName, setCustomJudgeName] = useState('');
  
  // Scores state: { data_quality: '', analysis_insight: '', ... }
  const [scores, setScores] = useState({
    data_quality: '',
    analysis_insight: '',
    report_dashboard: '',
    power_bi: '',
    presentation: '',
    creativity_practical: ''
  });
  
  const [comment, setComment] = useState('');
  const [errors, setErrors] = useState({});
  const [isReviewOpen, setIsReviewOpen] = useState(false);
  const [evaluatedTeamsMap, setEvaluatedTeamsMap] = useState({});

  // Current cohort object
  const currentCohort = COHORTS.find(c => c.id === selectedCohortId) || COHORTS[0];

  // Refresh evaluated status when cohort or judge changes
  const activeJudge = judgeName === 'other' ? customJudgeName.trim() : judgeName;

  useEffect(() => {
    const evaluations = getEvaluations();
    const map = {};
    evaluations.forEach(ev => {
      if (ev.judgeName === activeJudge && ev.cohortId === selectedCohortId) {
        map[ev.teamCode] = true;
      }
    });
    setEvaluatedTeamsMap(map);

    // Auto select first team if none selected
    if (currentCohort.teams.length > 0 && !selectedTeamCode) {
      setSelectedTeamCode(currentCohort.teams[0].code);
    }
  }, [selectedCohortId, activeJudge]);

  // Load existing score if judge already scored this team
  useEffect(() => {
    if (!selectedTeamCode || !activeJudge) return;
    const evaluations = getEvaluations();
    const existing = evaluations.find(
      ev => ev.cohortId === selectedCohortId && ev.teamCode === selectedTeamCode && ev.judgeName === activeJudge
    );

    if (existing) {
      setScores(existing.scores || {});
      setComment(existing.comment || '');
    } else {
      // Reset form for new evaluation
      setScores({
        data_quality: '',
        analysis_insight: '',
        report_dashboard: '',
        power_bi: '',
        presentation: '',
        creativity_practical: ''
      });
      setComment('');
    }
    setErrors({});
  }, [selectedTeamCode, selectedCohortId, activeJudge]);

  const handleScoreChange = (categoryId, value) => {
    setScores(prev => ({ ...prev, [categoryId]: value }));
    // Clear error for category
    if (errors[categoryId]) {
      setErrors(prev => ({ ...prev, [categoryId]: null }));
    }
  };

  // Calculate current total score
  const totalScore = Object.values(scores).reduce((sum, val) => {
    const num = parseFloat(val);
    return sum + (isNaN(num) ? 0 : num);
  }, 0);

  const roundedTotalScore = Math.round(totalScore * 10) / 10;

  // Validate before opening Review Modal
  const handleOpenReview = () => {
    const newErrors = {};
    let hasError = false;

    if (!activeJudge) {
      alert('โปรดระบุชื่อกรรมการผู้ประเมิน');
      return;
    }

    if (!selectedTeamCode) {
      alert('โปรดเลือกทีมที่ต้องการประเมิน');
      return;
    }

    EVALUATION_CATEGORIES.forEach(cat => {
      const scoreVal = scores[cat.id];
      if (scoreVal === '' || scoreVal === undefined || scoreVal === null) {
        newErrors[cat.id] = `โปรดกรอกคะแนน (0 - ${cat.maxScore})`;
        hasError = true;
      } else {
        const num = Number(scoreVal);
        if (isNaN(num)) {
          newErrors[cat.id] = 'คะแนนต้องเป็นตัวเลข';
          hasError = true;
        } else if (num < 0) {
          newErrors[cat.id] = 'คะแนนต้องไม่ติดลบ';
          hasError = true;
        } else if (num > cat.maxScore) {
          newErrors[cat.id] = `คะแนนเกินคะแนนเต็ม! (สูงสุด ${cat.maxScore})`;
          hasError = true;
        }
      }
    });

    if (hasError) {
      setErrors(newErrors);
      alert('โปรดตรวจสอบคะแนนที่กรอกให้ถูกต้องตามเกณฑ์เต็มของทุกหมวด');
      return;
    }

    setIsReviewOpen(true);
  };

  // Final Submit Handler
  const handleConfirmSubmit = () => {
    const currentTeam = currentCohort.teams.find(t => t.code === selectedTeamCode);
    const evaluationRecord = {
      cohortId: selectedCohortId,
      teamId: currentTeam?.id || selectedTeamCode,
      teamCode: selectedTeamCode,
      judgeName: activeJudge,
      scores: scores,
      totalScore: roundedTotalScore,
      comment: comment
    };

    saveEvaluation(evaluationRecord);
    setIsReviewOpen(false);

    // Trigger celebratory confetti
    confetti({
      particleCount: 80,
      spread: 70,
      origin: { y: 0.6 }
    });

    // Refresh local evaluated map
    setEvaluatedTeamsMap(prev => ({ ...prev, [selectedTeamCode]: true }));

    if (onSaveSuccess) {
      onSaveSuccess(evaluationRecord);
    }
  };

  const currentTeamObj = currentCohort.teams.find(t => t.code === selectedTeamCode);

  return (
    <div className="max-w-6xl mx-auto space-y-8 pb-12">
      
      {/* Top Header Card */}
      <div className="glass-panel rounded-3xl p-6 sm:p-8 border border-slate-700/60 shadow-xl relative overflow-hidden">
        <div className="absolute -right-12 -top-12 w-64 h-64 bg-blue-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -left-12 -bottom-12 w-64 h-64 bg-purple-500/10 rounded-full blur-3xl pointer-events-none" />

        <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6 relative z-10">
          <div>
            <div className="flex items-center gap-2 text-xs font-semibold text-blue-400 bg-blue-500/10 px-3 py-1 rounded-full border border-blue-500/20 w-fit mb-2">
              <Sparkles className="w-3.5 h-3.5" />
              <span>ระบบลงคะแนนกรรมการ (Judge Evaluation)</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-bold text-white tracking-tight">
              แบบประเมินผลงานการอบรม
            </h1>
            <p className="text-sm text-slate-400 mt-1">
              กรอกคะแนนตามเกณฑ์ 6 หมวด (คะแนนเต็ม 100 คะแนน) และตรวจสอบก่อนยืนยันบันทึก
            </p>
          </div>

          {/* Judge Name Picker */}
          <div className="glass-card p-4 rounded-2xl border border-slate-700/80 w-full lg:w-auto min-w-[280px]">
            <label className="text-xs font-semibold text-slate-300 flex items-center gap-2 mb-2">
              <UserCheck className="w-4 h-4 text-cyan-400" />
              <span>ระบุชื่อกรรมการผู้ประเมิน:</span>
            </label>
            <div className="space-y-2">
              <select
                value={judgeName}
                onChange={(e) => setJudgeName(e.target.value)}
                className="w-full text-sm font-medium py-2 px-3 rounded-xl glass-input text-white focus:ring-blue-500"
              >
                {DEFAULT_JUDGES.map((j) => (
                  <option key={j} value={j} className="bg-slate-900 text-white">
                    {j}
                  </option>
                ))}
                <option value="other" className="bg-slate-900 text-white">+ ระบุชื่ออื่น...</option>
              </select>

              {judgeName === 'other' && (
                <input
                  type="text"
                  placeholder="พิมพ์ชื่อกรรมการ..."
                  value={customJudgeName}
                  onChange={(e) => setCustomJudgeName(e.target.value)}
                  className="w-full text-sm py-2 px-3 rounded-xl glass-input text-white"
                />
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Cohort & Team Selection Area */}
      <div className="space-y-4">
        {/* 1. Cohort Selector Tabs */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2 bg-slate-900/80 p-1.5 rounded-2xl border border-slate-800 w-full sm:w-auto">
            {COHORTS.map((cohort) => {
              const isActive = selectedCohortId === cohort.id;
              return (
                <button
                  key={cohort.id}
                  onClick={() => {
                    setSelectedCohortId(cohort.id);
                    setSelectedTeamCode(cohort.teams[0]?.code || '');
                  }}
                  className={`flex-1 sm:flex-none px-6 py-2.5 rounded-xl font-semibold text-sm transition-all duration-300 flex items-center justify-center gap-2 ${
                    isActive
                      ? 'bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-lg shadow-blue-600/30'
                      : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/50'
                  }`}
                >
                  <Users className="w-4 h-4" />
                  <span>{cohort.name}</span>
                  <span className="px-2 py-0.5 rounded-full text-xs bg-slate-950/40 text-slate-300">
                    {cohort.teamCount} ทีม
                  </span>
                </button>
              );
            })}
          </div>

          <div className="text-xs text-slate-400 flex items-center gap-2 bg-slate-900/40 px-3 py-1.5 rounded-xl border border-slate-800">
            <Info className="w-4 h-4 text-blue-400" />
            <span>สัญลักษณ์ <span className="text-emerald-400 font-bold">✓</span> คือทีมที่บันทึกคะแนนแล้ว</span>
          </div>
        </div>

        {/* 2. Teams Selector Chips Grid */}
        <div className="glass-panel p-5 rounded-2xl border border-slate-800 space-y-3">
          <div className="flex items-center justify-between">
            <h2 className="text-sm font-semibold text-slate-300 flex items-center gap-2">
              <Award className="w-4 h-4 text-amber-400" />
              <span>เลือกทีมที่ต้องการประเมิน ({currentCohort.name}):</span>
            </h2>
          </div>

          <div className="grid grid-cols-4 sm:grid-cols-8 md:grid-cols-8 lg:grid-cols-8 gap-2">
            {currentCohort.teams.map((team) => {
              const isSelected = selectedTeamCode === team.code;
              const isEvaluated = evaluatedTeamsMap[team.code];

              return (
                <button
                  key={team.id}
                  onClick={() => setSelectedTeamCode(team.code)}
                  className={`py-3 px-2 rounded-xl text-center font-bold text-sm transition-all relative border ${
                    isSelected
                      ? 'bg-gradient-to-br from-amber-500/20 to-orange-500/20 border-amber-400 text-amber-300 shadow-md shadow-amber-500/10 scale-105 z-10'
                      : isEvaluated
                      ? 'bg-emerald-950/30 border-emerald-500/40 text-emerald-300 hover:border-emerald-400'
                      : 'bg-slate-900/70 border-slate-800 text-slate-300 hover:border-slate-600 hover:bg-slate-800/80'
                  }`}
                >
                  <div className="text-xs font-semibold">{team.code}</div>
                  
                  {isEvaluated && (
                    <span className="absolute top-1 right-1 w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                  )}
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* Selected Team Banner & Live Score Summary */}
      <div className="p-5 rounded-2xl glass-card border border-blue-500/30 bg-gradient-to-r from-slate-900 via-blue-950/30 to-slate-900 flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-amber-500 to-orange-500 flex items-center justify-center text-slate-950 font-black text-xl shadow-lg shadow-amber-500/20">
            {selectedTeamCode || '?'}
          </div>
          <div>
            <div className="text-xs text-slate-400 font-medium">กำลังประเมินทีม:</div>
            <div className="text-lg font-bold text-white flex items-center gap-2">
              <span>{currentTeamObj?.name || selectedTeamCode}</span>
              {evaluatedTeamsMap[selectedTeamCode] && (
                <span className="px-2 py-0.5 rounded-full text-xs font-medium bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 flex items-center gap-1">
                  <CheckCircle2 className="w-3 h-3" />
                  ประเมินแล้ว (มีข้อมูลเดิม)
                </span>
              )}
            </div>
          </div>
        </div>

        <div className="flex items-center gap-4 border-t sm:border-t-0 sm:border-l border-slate-700/60 pt-3 sm:pt-0 sm:pl-6 w-full sm:w-auto justify-between sm:justify-start">
          <div className="text-right">
            <div className="text-xs text-slate-400">คะแนนรวมปัจจุบัน:</div>
            <div className="text-2xl font-black text-amber-300">
              {roundedTotalScore} <span className="text-xs text-slate-400 font-normal">/ {TOTAL_MAX_SCORE}</span>
            </div>
          </div>
        </div>
      </div>

      {/* 6 Category Evaluation Grid */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-bold text-white flex items-center gap-2">
            <span>เกณฑ์การประเมิน 6 หมวด</span>
          </h2>
          <span className="text-xs text-slate-400">
            * ระบบบล็อกไม่ให้กรอกเกินคะแนนเต็มแต่ละหมวดอัตโนมัติ
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {EVALUATION_CATEGORIES.map((category) => (
            <CategoryCard
              key={category.id}
              category={category}
              value={scores[category.id] ?? ''}
              onChange={handleScoreChange}
              error={errors[category.id]}
            />
          ))}
        </div>
      </div>

      {/* Judge Feedback & Recommendations */}
      <div className="glass-card p-6 rounded-2xl border border-slate-800 space-y-3">
        <label className="text-sm font-semibold text-slate-200 flex items-center gap-2">
          <MessageSquare className="w-4 h-4 text-purple-400" />
          <span>ความคิดเห็นและข้อเสนอแนะเพิ่มเติมของกรรมการ:</span>
        </label>
        <textarea
          rows="3"
          placeholder="ระบุจุดเด่น ข้อเสนอแนะ หรือความคิดเห็นเพิ่มเติมสำหรับทีมนี้..."
          value={comment}
          onChange={(e) => setComment(e.target.value)}
          className="w-full text-sm py-3 px-4 rounded-xl glass-input text-white focus:ring-purple-500 placeholder-slate-500"
        />
      </div>

      {/* Action Submit Bar */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-4 border-t border-slate-800">
        <button
          type="button"
          onClick={() => {
            setScores({
              data_quality: '',
              analysis_insight: '',
              report_dashboard: '',
              power_bi: '',
              presentation: '',
              creativity_practical: ''
            });
            setComment('');
            setErrors({});
          }}
          className="w-full sm:w-auto px-5 py-3 rounded-xl border border-slate-700 bg-slate-900/60 hover:bg-slate-800 text-slate-400 hover:text-slate-200 font-medium text-sm transition-all flex items-center justify-center gap-2"
        >
          <RotateCcw className="w-4 h-4" />
          <span>ล้างฟอร์ม</span>
        </button>

        <button
          type="button"
          onClick={handleOpenReview}
          className="w-full sm:w-auto px-8 py-3 rounded-xl bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 hover:from-blue-500 hover:to-purple-500 text-white font-bold text-base shadow-xl shadow-indigo-600/30 hover:shadow-indigo-500/50 transition-all flex items-center justify-center gap-2 group"
        >
          <span>ตรวจสอบและบันทึกคะแนน</span>
          <Send className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
        </button>
      </div>

      {/* Pre-submission Review Modal */}
      <ReviewModal
        isOpen={isReviewOpen}
        onClose={() => setIsReviewOpen(false)}
        onConfirm={handleConfirmSubmit}
        evaluationData={{
          judgeName: activeJudge,
          scores,
          totalScore: roundedTotalScore,
          comment
        }}
        cohortName={currentCohort.name}
        teamName={currentTeamObj?.name || selectedTeamCode}
      />

    </div>
  );
};
