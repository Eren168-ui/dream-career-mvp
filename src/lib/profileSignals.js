const CAREER_STAGE_BUCKET_MAP = {
  just_entered_university: "lost",
  heard_internship_important: "lost",
  considering_internship_no_direction: "direction_no_target",
  direction_set_seeking_first_internship: "clear_goal_no_action",
  currently_interning_1st: "clear_goal_no_action",
  currently_interning_2nd: "clear_goal_no_action",
  currently_interning_3rd_plus: "clear_goal_no_action",
  experienced_staying_direction: "clear_goal_no_action",
  experienced_changing_direction: "direction_no_target",
};

const ELITE_SCHOOL_KEYWORDS = [
  "985",
  "211",
  "双一流",
  "c9",
  "北京大学",
  "清华大学",
  "复旦大学",
  "上海交通大学",
  "浙江大学",
  "南京大学",
  "中国人民大学",
  "中国科学技术大学",
  "同济大学",
  "北京航空航天大学",
  "哈尔滨工业大学",
  "西安交通大学",
  "武汉大学",
  "华中科技大学",
  "中山大学",
  "南开大学",
  "厦门大学",
  "北京师范大学",
  "天津大学",
  "东南大学",
];

export function mapCareerStageToGuidanceStage(careerStage = "") {
  return CAREER_STAGE_BUCKET_MAP[careerStage] ?? careerStage;
}

export function isEliteSchool(schoolName = "") {
  const normalized = String(schoolName).replace(/\s+/g, "").toLowerCase();
  if (!normalized) return false;

  return ELITE_SCHOOL_KEYWORDS.some((keyword) => normalized.includes(keyword.toLowerCase()));
}
