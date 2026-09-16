import { COHORTS, EVALUATION_CATEGORIES } from '../constants/evaluationData';

const STORAGE_KEY = 'scoring_system_evaluations_v1';

export const getEvaluations = () => {
  try {
    const dataStr = localStorage.getItem(STORAGE_KEY);
    return dataStr ? JSON.parse(dataStr) : [];
  } catch (err) {
    console.error('Error reading evaluations from localStorage:', err);
    return [];
  }
};

export const saveEvaluation = (evaluation) => {
  try {
    const evaluations = getEvaluations();
    // Unique ID based on cohort, team, and judge
    const recordId = evaluation.id || `eval_${evaluation.cohortId}_${evaluation.teamCode}_${evaluation.judgeName.trim()}`;
    const timestamp = new Date().toISOString();

    const newRecord = {
      ...evaluation,
      id: recordId,
      judgeName: evaluation.judgeName.trim(),
      timestamp
    };

    const existingIndex = evaluations.findIndex(item => item.id === recordId);
    let updatedEvaluations;
    if (existingIndex >= 0) {
      updatedEvaluations = [...evaluations];
      updatedEvaluations[existingIndex] = newRecord;
    } else {
      updatedEvaluations = [...evaluations, newRecord];
    }

    localStorage.setItem(STORAGE_KEY, JSON.stringify(updatedEvaluations));
    return newRecord;
  } catch (err) {
    console.error('Error saving evaluation:', err);
    throw err;
  }
};

export const deleteEvaluation = (id) => {
  try {
    const evaluations = getEvaluations();
    const filtered = evaluations.filter(item => item.id !== id);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(filtered));
    return true;
  } catch (err) {
    console.error('Error deleting evaluation:', err);
    return false;
  }
};

export const clearAllEvaluations = () => {
  try {
    localStorage.removeItem(STORAGE_KEY);
    return true;
  } catch (err) {
    console.error('Error clearing evaluations:', err);
    return false;
  }
};

// Seed realistic demo data for testing Admin Dashboard
export const seedDemoData = () => {
  const judges = ['กรรมการ 1', 'กรรมการ 2', 'กรรมการ 3'];
  const mockEvaluations = [];

  COHORTS.forEach((cohort) => {
    cohort.teams.forEach((team, teamIndex) => {
      // Simulate 2-3 judges evaluating each team
      const judgeCount = Math.floor(Math.random() * 2) + 2; // 2 or 3 judges
      for (let j = 0; j < judgeCount; j++) {
        const judgeName = judges[j];
        const scores = {};
        let totalScore = 0;

        EVALUATION_CATEGORIES.forEach((cat) => {
          // Generate realistic scores (between 70% and 95% of max)
          const baseRatio = 0.72 + (Math.sin(teamIndex * 1.5 + j) * 0.18 + Math.random() * 0.1);
          const clampedRatio = Math.min(Math.max(baseRatio, 0.6), 1.0);
          const score = Math.round(clampedRatio * cat.maxScore * 10) / 10;
          scores[cat.id] = Math.min(score, cat.maxScore);
          totalScore += scores[cat.id];
        });

        totalScore = Math.round(totalScore * 10) / 10;

        const comments = [
          'ทำเรื่อง Dashboard สวยงามและเลือกใช้สีได้น่าสนใจมาก สามารถนำไปต่อยอดได้จริง',
          'การวิเคราะห์เชิงลึกทำได้ดีมาก ตอบโจทย์ความต้องการของสายงานอย่างชัดเจน',
          'ข้อเสนอแนะ: ควรปรับปรุงเรื่องการลำดับ Storytelling ในช่วงการนำเสนอให้กระชับยิ่งขึ้น',
          'ใช้เทคนิค DAX ใน Power BI ได้อย่างยอดเยี่ยม มีการจัดการ Data Model ที่มีประสิทธิภาพ',
          'นวัตกรรมและไอเดียดีเยี่ยม มีความเป็นไปได้สูงที่จะปรับใช้จริงในองค์กร'
        ];

        mockEvaluations.push({
          id: `eval_${cohort.id}_${team.code}_${judgeName}`,
          cohortId: cohort.id,
          teamId: team.id,
          teamCode: team.code,
          judgeName: judgeName,
          scores: scores,
          totalScore: totalScore,
          comment: comments[Math.floor(Math.random() * comments.length)],
          timestamp: new Date(Date.now() - Math.floor(Math.random() * 86400000 * 2)).toISOString()
        });
      }
    });
  });

  localStorage.setItem(STORAGE_KEY, JSON.stringify(mockEvaluations));
  return mockEvaluations;
};

// Calculate aggregate statistics for leaderboard and charts
export const calculateTeamStats = (cohortId = 'all') => {
  const evaluations = getEvaluations();

  // Get relevant cohorts
  const targetCohorts = cohortId === 'all' 
    ? COHORTS 
    : COHORTS.filter(c => c.id === cohortId);

  const teamStatsMap = {};

  // Initialize all teams
  targetCohorts.forEach(c => {
    c.teams.forEach(t => {
      const key = `${c.id}_${t.code}`;
      teamStatsMap[key] = {
        cohortId: c.id,
        cohortName: c.name,
        teamId: t.id,
        teamCode: t.code,
        teamName: t.name,
        evaluationsCount: 0,
        judgeNames: [],
        categoryTotals: {},
        categoryAverages: {},
        totalScoreSum: 0,
        averageTotalScore: 0,
        comments: []
      };

      EVALUATION_CATEGORIES.forEach(cat => {
        teamStatsMap[key].categoryTotals[cat.id] = 0;
        teamStatsMap[key].categoryAverages[cat.id] = 0;
      });
    });
  });

  // Aggregate evaluation scores
  evaluations.forEach(evalRecord => {
    const key = `${evalRecord.cohortId}_${evalRecord.teamCode}`;
    if (teamStatsMap[key]) {
      const teamStat = teamStatsMap[key];
      teamStat.evaluationsCount += 1;
      teamStat.judgeNames.push(evalRecord.judgeName);
      teamStat.totalScoreSum += evalRecord.totalScore;

      if (evalRecord.comment && evalRecord.comment.trim() !== '') {
        teamStat.comments.push({
          judgeName: evalRecord.judgeName,
          text: evalRecord.comment
        });
      }

      EVALUATION_CATEGORIES.forEach(cat => {
        const catScore = evalRecord.scores?.[cat.id] || 0;
        teamStat.categoryTotals[cat.id] += catScore;
      });
    }
  });

  // Calculate averages
  const teamStatsList = Object.values(teamStatsMap).map(stat => {
    if (stat.evaluationsCount > 0) {
      stat.averageTotalScore = Math.round((stat.totalScoreSum / stat.evaluationsCount) * 10) / 10;
      EVALUATION_CATEGORIES.forEach(cat => {
        stat.categoryAverages[cat.id] = Math.round((stat.categoryTotals[cat.id] / stat.evaluationsCount) * 10) / 10;
      });
    }
    return stat;
  });

  // Sort by averageTotalScore descending
  teamStatsList.sort((a, b) => b.averageTotalScore - a.averageTotalScore);

  // Assign rank
  let currentRank = 1;
  teamStatsList.forEach((stat, idx) => {
    if (idx > 0 && stat.averageTotalScore < teamStatsList[idx - 1].averageTotalScore) {
      currentRank = idx + 1;
    }
    stat.rank = stat.evaluationsCount > 0 ? currentRank : '-';
  });

  return teamStatsList;
};

// Export to CSV helper
export const exportToCSV = () => {
  const evaluations = getEvaluations();
  if (evaluations.length === 0) {
    alert('ยังไม่มีข้อมูลการลงคะแนนให้ส่งออก');
    return;
  }

  const headers = [
    'รุ่นการอบรม',
    'รหัสทีม',
    'ชื่อกรรมการ',
    'ข้อมูลและคุณภาพ (15)',
    'Analysis & Insight (20)',
    'Report / Dashboard (20)',
    'Power BI (15)',
    'Presentation (15)',
    'Creativity & Practical (15)',
    'คะแนนรวมเต็ม 100',
    'ความคิดเห็นเพิ่มเติม',
    'วันที่-เวลาบันทึก'
  ];

  const rows = evaluations.map(item => {
    const cohortName = item.cohortId === 'cohort_1' ? 'รุ่นที่ 1' : 'รุ่นที่ 2';
    const dateStr = new Date(item.timestamp).toLocaleString('th-TH');
    return [
      `"${cohortName}"`,
      `"${item.teamCode}"`,
      `"${item.judgeName}"`,
      item.scores?.data_quality || 0,
      item.scores?.analysis_insight || 0,
      item.scores?.report_dashboard || 0,
      item.scores?.power_bi || 0,
      item.scores?.presentation || 0,
      item.scores?.creativity_practical || 0,
      item.totalScore,
      `"${(item.comment || '').replace(/"/g, '""')}"`,
      `"${dateStr}"`
    ];
  });

  const csvContent = '\uFEFF' + [headers.join(','), ...rows.map(r => r.join(','))].join('\n');
  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.setAttribute('href', url);
  link.setAttribute('download', `scoring_report_${new Date().toISOString().slice(0,10)}.csv`);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
};

// Export JSON
export const exportToJSON = () => {
  const evaluations = getEvaluations();
  const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(evaluations, null, 2));
  const link = document.createElement('a');
  link.setAttribute("href", dataStr);
  link.setAttribute("download", `scoring_backup_${new Date().toISOString().slice(0,10)}.json`);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
};
