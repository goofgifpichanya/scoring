export const EVALUATION_CATEGORIES = [
  {
    id: 'data_quality',
    title: 'ข้อมูลและคุณภาพ',
    titleEn: 'Data & Quality',
    maxScore: 15,
    description: 'ความถูกต้อง ครบถ้วน โครงสร้างข้อมูล และคุณภาพของแหล่งข้อมูลที่นำมาใช้',
    color: 'from-blue-500 to-cyan-500',
    borderColor: 'border-blue-500/30',
    bgColor: 'bg-blue-500/10',
    textColor: 'text-blue-600 dark:text-blue-400',
    iconName: 'Database'
  },
  {
    id: 'analysis_insight',
    title: 'Analysis & Insight',
    titleEn: 'Analysis & Insight',
    maxScore: 20,
    description: 'การลึกซึ้งในการวิเคราะห์ ความถูกต้องของมุมมอง และข้อสรุปเชิงกลยุทธ์ที่มีคุณค่า',
    color: 'from-purple-500 to-indigo-500',
    borderColor: 'border-purple-500/30',
    bgColor: 'bg-purple-500/10',
    textColor: 'text-purple-600 dark:text-purple-400',
    iconName: 'Brain'
  },
  {
    id: 'report_dashboard',
    title: 'Report / Dashboard',
    titleEn: 'Report / Dashboard',
    maxScore: 20,
    description: 'ความสวยงาม การจัดวาง UX/UI การเลือกใช้ Visualizations และความง่ายในการตีความ',
    color: 'from-emerald-500 to-teal-500',
    borderColor: 'border-emerald-500/30',
    bgColor: 'bg-emerald-500/10',
    textColor: 'text-emerald-600 dark:text-emerald-400',
    iconName: 'LayoutDashboard'
  },
  {
    id: 'power_bi',
    title: 'Power BI',
    titleEn: 'Power BI Technical Skills',
    maxScore: 15,
    description: 'การประยุกต์ใช้ DAX, Data Modeling, Interactions, Filters และเทคนิค Power BI Advanced',
    color: 'from-amber-500 to-orange-500',
    borderColor: 'border-amber-500/30',
    bgColor: 'bg-amber-500/10',
    textColor: 'text-amber-600 dark:text-amber-400',
    iconName: 'BarChart3'
  },
  {
    id: 'presentation',
    title: 'Presentation',
    titleEn: 'Presentation & Communication',
    maxScore: 15,
    description: 'ทักษะการนำเสนอ ความกระชับ ลำดับเรื่องราว (Storytelling) และการตอบคำถาม',
    color: 'from-rose-500 to-pink-500',
    borderColor: 'border-rose-500/30',
    bgColor: 'bg-rose-500/10',
    textColor: 'text-rose-600 dark:text-rose-400',
    iconName: 'Mic'
  },
  {
    id: 'creativity_practical',
    title: 'Creativity & Practical Use',
    titleEn: 'Creativity & Practical Value',
    maxScore: 15,
    description: 'ความคิดสร้างสรรค์ ความแปลกใหม่ และความสามารถในการนำไปใช้งานได้จริงในองค์กร',
    color: 'from-violet-500 to-fuchsia-500',
    borderColor: 'border-violet-500/30',
    bgColor: 'bg-violet-500/10',
    textColor: 'text-violet-600 dark:text-violet-400',
    iconName: 'Sparkles'
  }
];

export const TOTAL_MAX_SCORE = EVALUATION_CATEGORIES.reduce((sum, cat) => sum + cat.maxScore, 0); // 100

export const COHORTS = [
  {
    id: 'cohort_1',
    name: 'รุ่นที่ 1',
    teamCount: 16,
    teams: [
      { id: 'c1_01', code: 'บส.', name: 'ทีม บส.' },
      { id: 'c1_02', code: 'สป.', name: 'ทีม สป.' },
      { id: 'c1_03', code: 'ลอ.', name: 'ทีม ลอ.' },
      { id: 'c1_04', code: 'ตส.', name: 'ทีม ตส.' },
      { id: 'c1_05', code: 'สง.', name: 'ทีม สง.' },
      { id: 'c1_06', code: 'อส.', name: 'ทีม อส.' },
      { id: 'c1_07', code: 'พล.', name: 'ทีม พล.' },
      { id: 'c1_08', code: 'จท.', name: 'ทีม จท.' },
      { id: 'c1_09', code: 'ตท.', name: 'ทีม ตท.' },
      { id: 'c1_10', code: 'สบ.', name: 'ทีม สบ.' },
      { id: 'c1_11', code: 'ธญ.', name: 'ทีม ธญ.' },
      { id: 'c1_12', code: 'นร.', name: 'ทีม นร.' },
      { id: 'c1_13', code: 'บน1.', name: 'ทีม บน1.' },
      { id: 'c1_14', code: 'บน2.', name: 'ทีม บน2.' },
      { id: 'c1_15', code: 'พธ.', name: 'ทีม พธ.' },
      { id: 'c1_16', code: 'สส.', name: 'ทีม สส.' }
    ]
  },
  {
    id: 'cohort_2',
    name: 'รุ่นที่ 2',
    teamCount: 15,
    teams: [
      { id: 'c2_01', code: 'กค.', name: 'ทีม กค.' },
      { id: 'c2_02', code: 'บช.', name: 'ทีม บช.' },
      { id: 'c2_03', code: 'บอ.', name: 'ทีม บอ.' },
      { id: 'c2_04', code: 'งฝ.', name: 'ทีม งฝ.' },
      { id: 'c2_05', code: 'บง.', name: 'ทีม บง.' },
      { id: 'c2_06', code: 'ทน.', name: 'ทีม ทน.' },
      { id: 'c2_07', code: 'อก.', name: 'ทีม อก.' },
      { id: 'c2_08', code: 'สว.', name: 'ทีม สว.' },
      { id: 'c2_09', code: 'กก.', name: 'ทีม กก.' },
      { id: 'c2_10', code: 'รส.', name: 'ทีม รส.' },
      { id: 'c2_11', code: 'ผท.', name: 'ทีม ผท.' },
      { id: 'c2_12', code: 'งส.', name: 'ทีม งส.' },
      { id: 'c2_13', code: 'ธต.', name: 'ทีม ธต.' },
      { id: 'c2_14', code: 'LPS', name: 'ทีม LPS' },
      { id: 'c2_15', code: 'ธง.', name: 'ทีม ธง.' }
    ]
  }
];

export const DEFAULT_JUDGES = [
  'กรรมการ 1',
  'กรรมการ 2',
  'กรรมการ 3',
  'กรรมการ 4',
  'กรรมการ 5'
];
