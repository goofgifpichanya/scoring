import React from 'react';
import { 
  Database, 
  Brain, 
  LayoutDashboard, 
  BarChart3, 
  Mic, 
  Sparkles, 
  AlertTriangle,
  CheckCircle2,
  Plus,
  Minus
} from 'lucide-react';

const ICON_MAP = {
  Database,
  Brain,
  LayoutDashboard,
  BarChart3,
  Mic,
  Sparkles
};

export const CategoryCard = ({ category, value, onChange, error }) => {
  const IconComponent = ICON_MAP[category.iconName] || Database;
  const numValue = value === '' ? '' : Number(value);
  const isExceeded = numValue !== '' && numValue > category.maxScore;
  const isNegative = numValue !== '' && numValue < 0;
  const isFilled = numValue !== '' && !isExceeded && !isNegative;
  
  const percentage = numValue !== '' && !isExceeded && !isNegative 
    ? Math.min(100, Math.max(0, (numValue / category.maxScore) * 100)) 
    : 0;

  const handleInputChange = (e) => {
    const val = e.target.value;
    if (val === '') {
      onChange(category.id, '');
      return;
    }
    const parsed = parseFloat(val);
    if (!isNaN(parsed)) {
      onChange(category.id, parsed);
    }
  };

  const handleQuickAdjust = (delta) => {
    const current = numValue === '' ? 0 : numValue;
    const nextVal = Math.min(category.maxScore, Math.max(0, Math.round((current + delta) * 10) / 10));
    onChange(category.id, nextVal);
  };

  return (
    <div className={`glass-card rounded-2xl p-5 transition-all duration-300 relative overflow-hidden border ${
      isExceeded 
        ? 'border-red-500/80 bg-red-950/20 shadow-lg shadow-red-950/30' 
        : isFilled 
          ? 'border-emerald-500/40 bg-slate-900/60' 
          : 'border-slate-700/60 hover:border-slate-500/60'
    }`}>
      {/* Top accent bar */}
      <div className={`absolute top-0 left-0 right-0 h-1 bg-gradient-to-r ${category.color}`} />

      <div className="flex items-start justify-between gap-3 mb-3">
        <div className="flex items-center gap-3">
          <div className={`p-2.5 rounded-xl ${category.bgColor} ${category.textColor} flex items-center justify-center shrink-0`}>
            <IconComponent className="w-5 h-5" />
          </div>
          <div>
            <h3 className="font-semibold text-slate-100 text-base flex items-center gap-2">
              {category.title}
            </h3>
            <p className="text-xs text-slate-400">{category.titleEn}</p>
          </div>
        </div>

        {/* Max score badge */}
        <div className="px-3 py-1 rounded-full bg-slate-800/80 border border-slate-700 text-xs font-medium text-slate-300 shrink-0 flex items-center gap-1">
          <span>เต็ม</span>
          <span className="font-bold text-amber-400 text-sm">{category.maxScore}</span>
          <span>คะแนน</span>
        </div>
      </div>

      <p className="text-xs text-slate-400 mb-4 line-clamp-2 min-h-[32px]">
        {category.description}
      </p>

      {/* Input area */}
      <div className="space-y-3">
        <div className="flex items-center gap-2">
          {/* Minus button */}
          <button
            type="button"
            onClick={() => handleQuickAdjust(-1)}
            disabled={numValue <= 0 || numValue === ''}
            className="p-2 rounded-lg bg-slate-800 hover:bg-slate-700 active:bg-slate-600 disabled:opacity-30 disabled:cursor-not-allowed text-slate-300 transition-colors"
            title="ลด 1 คะแนน"
          >
            <Minus className="w-4 h-4" />
          </button>

          {/* Main Number Input */}
          <div className="relative flex-1">
            <input
              type="number"
              step="0.5"
              min="0"
              max={category.maxScore}
              value={value}
              onChange={handleInputChange}
              placeholder={`0 - ${category.maxScore}`}
              className={`w-full text-center text-lg font-bold py-2.5 px-3 rounded-xl glass-input transition-all ${
                isExceeded
                  ? 'border-red-500 text-red-400 focus:ring-red-500'
                  : 'text-white'
              }`}
            />
            {isFilled && (
              <CheckCircle2 className="w-4 h-4 text-emerald-400 absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none" />
            )}
          </div>

          {/* Plus button */}
          <button
            type="button"
            onClick={() => handleQuickAdjust(1)}
            disabled={numValue >= category.maxScore}
            className="p-2 rounded-lg bg-slate-800 hover:bg-slate-700 active:bg-slate-600 disabled:opacity-30 disabled:cursor-not-allowed text-slate-300 transition-colors"
            title="เพิ่ม 1 คะแนน"
          >
            <Plus className="w-4 h-4" />
          </button>
        </div>

        {/* Quick preset buttons */}
        <div className="flex items-center justify-between gap-1 pt-1">
          <span className="text-[11px] text-slate-500 font-medium">ทางลัด:</span>
          <div className="flex gap-1.5">
            {[0.5, 0.75, 1.0].map((ratio) => {
              const presetVal = Math.round(category.maxScore * ratio * 10) / 10;
              return (
                <button
                  key={ratio}
                  type="button"
                  onClick={() => onChange(category.id, presetVal)}
                  className="px-2 py-0.5 rounded text-[11px] font-medium bg-slate-800/60 hover:bg-slate-700 text-slate-300 border border-slate-700/50 transition-colors"
                >
                  {presetVal}
                </button>
              );
            })}
          </div>
        </div>

        {/* Progress Bar */}
        <div className="space-y-1 pt-1">
          <div className="w-full bg-slate-800/80 rounded-full h-2 overflow-hidden border border-slate-700/50">
            <div
              className={`h-full transition-all duration-300 rounded-full bg-gradient-to-r ${
                isExceeded ? 'from-red-600 to-red-500' : category.color
              }`}
              style={{ width: `${isExceeded ? 100 : percentage}%` }}
            />
          </div>
        </div>

        {/* Error message */}
        {(isExceeded || isNegative || error) && (
          <div className="flex items-center gap-1.5 text-xs text-red-400 font-medium bg-red-950/40 p-2 rounded-lg border border-red-800/40 animate-pulse">
            <AlertTriangle className="w-3.5 h-3.5 shrink-0" />
            <span>
              {isExceeded 
                ? `กรอกเกินคะแนนเต็ม! (สูงสุด ${category.maxScore} คะแนน)`
                : isNegative
                ? 'คะแนนต้องไม่ติดลบ'
                : error}
            </span>
          </div>
        )}
      </div>
    </div>
  );
};
