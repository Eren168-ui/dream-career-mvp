export const graduationYearOptions = [
  { value: "2029", label: "2029" },
  { value: "2028", label: "2028" },
  { value: "2027", label: "2027" },
  { value: "2026", label: "2026" },
  { value: "graduated", label: "已毕业" },
  { value: "other", label: "其他" },
];

export const resumeStageOptions = [
  { value: "no_resume", label: "没有简历" },
  { value: "draft_resume", label: "有初版简历，但还没投递过" },
  { value: "applied_resume", label: "有投递过的简历" },
];

export const careerStageOptions = [
  { value: "just_entered_university", label: "刚入大学，还没考虑实习" },
  { value: "heard_internship_important", label: "听说过实习重要，但没渠道了解" },
  { value: "considering_internship_no_direction", label: "正在考虑实习，但还没确定方向" },
  { value: "direction_set_seeking_first_internship", label: "已经确定方向，在找第1段实习中" },
  { value: "currently_interning_1st", label: "正在实习中（第1段）" },
  { value: "currently_interning_2nd", label: "正在实习中（第2段）" },
  { value: "currently_interning_3rd_plus", label: "正在实习中（第3段及以上）" },
  { value: "experienced_staying_direction", label: "目前无实习，已有1段+实习经验（持续深耕同方向）" },
  { value: "experienced_changing_direction", label: "目前无实习，已有1段+实习经验（准备转向/换方向）" },
];

export const educationLevelOptions = [
  { value: "bachelor", label: "本科" },
  { value: "master", label: "研究生" },
  { value: "phd", label: "博士" },
  { value: "other", label: "其他" },
];

export const studyRegionOptions = [
  { value: "domestic", label: "国内" },
  { value: "overseas", label: "国外" },
];

export const intentOptions = [
  { value: "general_resume", label: "通用简历批改" },
  { value: "study_abroad_resume", label: "留学/升学定向简历规划" },
];

export const overseasIntentOptions = [
  { value: "domestic_postgrad", label: "国内升学" },
  { value: "abroad_master", label: "国外留学" },
  { value: "hybrid", label: "国内升学 + 国外留学同时准备" },
];

export const targetCountryOptions = [
  { value: "domestic", label: "国内院校" },
  { value: "us", label: "美国" },
  { value: "uk", label: "英国" },
  { value: "hk_sg", label: "香港 / 新加坡" },
  { value: "eu", label: "欧洲 / 其他地区" },
];

export const currentGpaOptions = [
  { value: "below_3_0", label: "3.0 以下 / 均分 80 以下" },
  { value: "3_0_to_3_3", label: "3.0 - 3.3 / 均分 80-84" },
  { value: "3_3_to_3_5", label: "3.3 - 3.5 / 均分 84-87" },
  { value: "3_5_plus", label: "3.5 以上 / 均分 87+" },
];

export const languageScoreOptions = [
  { value: "not_started", label: "还没开始准备" },
  { value: "preparing", label: "正在准备语言考试" },
  { value: "ielts_6_5", label: "雅思 6.5 / 托福 90 左右" },
  { value: "ielts_7_plus", label: "雅思 7.0+ / 托福 100+" },
];

export const applicationTimelineOptions = [
  { value: "sophomore_now", label: "大二，提前规划" },
  { value: "junior_fall", label: "大三上，准备申请季" },
  { value: "junior_spring", label: "大三下，申请临近" },
  { value: "graduate_cycle", label: "毕业前 / 已毕业，补申或二次规划" },
];

/**
 * 各行业头部名企列表（供"理想公司"下拉使用）
 * key = industries[].id
 */
export const companiesByIndustry = {
  "internet-ai": [
    "字节跳动", "腾讯", "阿里巴巴", "百度", "美团", "京东",
    "快手", "小红书", "滴滴", "网易", "小米", "蚂蚁集团",
    "哔哩哔哩", "拼多多", "微博", "商汤科技", "旷视科技",
    "华为（互联网/AI）", "智谱AI", "月之暗面", "深度求索",
  ],
  "fin-sector": [
    "高盛", "摩根大通", "摩根士丹利", "花旗集团", "瑞银",
    "麦肯锡", "波士顿咨询(BCG)", "贝恩咨询", "罗兰贝格",
    "中信证券", "中金公司(CICC)", "华泰证券", "国泰君安",
    "招商银行", "中国银行", "工商银行", "建设银行", "平安集团",
    "中国人寿", "蚂蚁集团（金融）",
  ],
  "new-energy": [
    "宁德时代(CATL)", "比亚迪", "蔚来", "小鹏汽车", "理想汽车",
    "华为智能汽车", "吉利汽车", "长城汽车", "广汽埃安",
    "隆基绿能", "通威股份", "天合光能", "晶科能源",
    "阳光电源", "远景能源", "亿纬锂能", "国轩高科",
    "特斯拉中国", "大众(中国新能源)",
  ],
  "electronics": [
    "华为", "中兴通讯", "联发科(MediaTek)", "高通(Qualcomm)",
    "英特尔中国", "AMD中国", "三星中国研究院", "台积电(TSMC)",
    "中芯国际(SMIC)", "长江存储", "海光信息", "寒武纪",
    "紫光展锐", "兆易创新", "澜起科技", "OPPO研究院",
    "vivo研究院", "小米(硬件)", "大疆创新",
  ],
  "other": [
    "宝洁(P&G)", "联合利华", "雀巢", "路易威登(LVMH)",
    "麦当劳中国", "星巴克中国", "沃尔玛中国",
    "万科", "碧桂园", "恒大（重组后）",
    "中国平安", "中国人保",
  ],
};
