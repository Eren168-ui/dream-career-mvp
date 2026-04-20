/**
 * jobCategories.js
 *
 * 行业 + 岗位大类 + 细分岗位数据（三级）
 * 数据来源：Boss 直聘公开岗位分类 API (wapi/zpCommon/data/position.json)
 * 最后同步时间：2026-04-14
 *
 * @typedef {{ id: string, name: string, emoji: string }} Industry
 *
 * @typedef {{
 *   id: string,
 *   name: string,
 *   bossCode: number,
 *   source: 'boss' | 'manual'
 * }} JobSubcategory
 *
 * @typedef {{
 *   id: string,
 *   name: string,
 *   emoji: string,
 *   description: string,
 *   industryId: string,
 *   questionSetRoleId: string,
 *   bossCategoryCodes: number[],
 *   children: JobSubcategory[]
 * }} JobCategory
 */

/** @type {Industry[]} */
export const industries = [
  { id: "internet-ai",  name: "互联网 / AI",     emoji: "💻" },
  { id: "fin-sector",   name: "金融",             emoji: "💹" },
  { id: "new-energy",   name: "新能源",           emoji: "⚡" },
  { id: "electronics",  name: "电子 / 通信 / 半导体", emoji: "📡" },
  { id: "other",        name: "其他行业",         emoji: "🌐" },
];

/** @type {JobCategory[]} */
export const jobCategories = [
  /* ── 互联网 / AI ── */
  {
    id: "product-manager",
    name: "产品经理",
    emoji: "🎯",
    description: "连接用户、技术与商业，把需求变成可落地的产品",
    industryId: "internet-ai",
    questionSetRoleId: "product-manager",
    bossCategoryCodes: [110100],
    children: [
      { id: "pm-general",    name: "产品经理",       bossCode: 110100, source: "boss" },
      { id: "pm-ai",         name: "AI产品经理",     bossCode: 110100, source: "boss" },
      { id: "pm-data",       name: "数据产品经理",   bossCode: 110100, source: "boss" },
      { id: "pm-mobile",     name: "移动产品经理",   bossCode: 110100, source: "boss" },
      { id: "pm-ecommerce",  name: "电商产品经理",   bossCode: 110100, source: "boss" },
      { id: "pm-hardware",   name: "硬件产品经理",   bossCode: 110100, source: "boss" },
      { id: "pm-user",       name: "用户研究",       bossCode: 110100, source: "boss" },
      { id: "pm-assistant",  name: "产品专员/助理",  bossCode: 110100, source: "boss" },
      { id: "pm-director",   name: "产品总监",       bossCode: 110100, source: "boss" },
    ],
  },
  {
    id: "internet-operations",
    name: "互联网运营",
    emoji: "📊",
    description: "驱动增长的用户/内容/数据运营岗位",
    industryId: "internet-ai",
    questionSetRoleId: "strategy-operations",
    bossCategoryCodes: [130100, 130400],
    children: [
      { id: "ops-user",        name: "用户运营",       bossCode: 130100, source: "boss" },
      { id: "ops-content",     name: "内容运营",       bossCode: 130100, source: "boss" },
      { id: "ops-data",        name: "数据/策略运营",  bossCode: 130100, source: "boss" },
      { id: "ops-product",     name: "产品运营",       bossCode: 130100, source: "boss" },
      { id: "ops-ecommerce",   name: "电商运营",       bossCode: 130100, source: "boss" },
      { id: "ops-live",        name: "直播运营",       bossCode: 130100, source: "boss" },
      { id: "ops-community",   name: "社区运营",       bossCode: 130100, source: "boss" },
      { id: "ops-newmedia",    name: "新媒体运营",     bossCode: 130100, source: "boss" },
      { id: "ops-growth",      name: "增长运营",       bossCode: 130100, source: "boss" },
      { id: "ops-manager",     name: "运营经理/主管",  bossCode: 130400, source: "boss" },
    ],
  },
  {
    id: "marketing",
    name: "市场营销",
    emoji: "📣",
    description: "品牌传播、活动策划、投放推广全链路岗位",
    industryId: "internet-ai",
    questionSetRoleId: "marketing",
    bossCategoryCodes: [140100, 140900],
    children: [
      { id: "mkt-brand",       name: "品牌营销",       bossCode: 140100, source: "boss" },
      { id: "mkt-campaign",    name: "活动策划执行",   bossCode: 140100, source: "boss" },
      { id: "mkt-planning",    name: "市场营销策划",   bossCode: 140100, source: "boss" },
      { id: "mkt-overseas",    name: "海外市场",       bossCode: 140100, source: "boss" },
      { id: "mkt-event",       name: "会务/会展策划",  bossCode: 140100, source: "boss" },
      { id: "mkt-seo",         name: "SEO",            bossCode: 140900, source: "boss" },
      { id: "mkt-sem",         name: "SEM",            bossCode: 140900, source: "boss" },
      { id: "mkt-infofeed",    name: "信息流优化师",   bossCode: 140900, source: "boss" },
      { id: "mkt-media-buy",   name: "媒介投放",       bossCode: 140900, source: "boss" },
      { id: "mkt-promotion",   name: "市场推广/地推",  bossCode: 140900, source: "boss" },
    ],
  },
  {
    id: "data-analysis",
    name: "数据分析",
    emoji: "📈",
    description: "数据挖掘、BI分析、商业数据决策支持岗位",
    industryId: "internet-ai",
    questionSetRoleId: "data-analyst",
    bossCategoryCodes: [100500, 140120],
    children: [
      { id: "da-analyst",      name: "数据分析师",     bossCode: 100500, source: "boss" },
      { id: "da-mining",       name: "数据挖掘",       bossCode: 100500, source: "boss" },
      { id: "da-dev",          name: "数据开发",       bossCode: 100500, source: "boss" },
      { id: "da-warehouse",    name: "数据仓库",       bossCode: 100500, source: "boss" },
      { id: "da-etl",          name: "ETL工程师",      bossCode: 100500, source: "boss" },
      { id: "da-arch",         name: "数据架构师",     bossCode: 100500, source: "boss" },
      { id: "da-business",     name: "商业数据分析",   bossCode: 140120, source: "boss" },
      { id: "da-bi",           name: "BI工程师",       bossCode: 100500, source: "manual" },
    ],
  },
  {
    id: "ai-algorithm",
    name: "AI / 算法",
    emoji: "🤖",
    description: "机器学习、深度学习、NLP、CV、推荐系统等算法岗位",
    industryId: "internet-ai",
    questionSetRoleId: "ai-algorithm-engineer",
    bossCategoryCodes: [101300],
    children: [
      { id: "ai-llm",          name: "大模型算法",           bossCode: 101300, source: "boss" },
      { id: "ai-nlp",          name: "自然语言处理(NLP)",    bossCode: 101300, source: "boss" },
      { id: "ai-recommend",    name: "推荐算法",             bossCode: 101300, source: "boss" },
      { id: "ai-search",       name: "搜索算法",             bossCode: 101300, source: "boss" },
      { id: "ai-cv",           name: "计算机视觉(CV)",       bossCode: 101300, source: "boss" },
      { id: "ai-engineer",     name: "算法工程师",           bossCode: 101300, source: "boss" },
      { id: "ai-driving",      name: "自动驾驶系统工程师",   bossCode: 101300, source: "boss" },
      { id: "ai-hpc",          name: "高性能计算工程师",     bossCode: 101300, source: "boss" },
      { id: "ai-mlops",        name: "MLOps工程师",          bossCode: 101300, source: "manual" },
    ],
  },
  {
    id: "media-film",
    name: "媒体 / 影视编导",
    emoji: "🎬",
    description: "影视制作、新媒体内容、编导、短视频等传媒岗位",
    industryId: "internet-ai",
    questionSetRoleId: "marketing",
    bossCategoryCodes: [170600, 170100],
    children: [
      { id: "mf-director",     name: "导演/编导",     bossCode: 170600, source: "boss" },
      { id: "mf-edit",         name: "视频剪辑",      bossCode: 170600, source: "boss" },
      { id: "mf-shoot",        name: "摄影/摄像师",   bossCode: 170600, source: "boss" },
      { id: "mf-script",       name: "编剧",          bossCode: 170600, source: "boss" },
      { id: "mf-post",         name: "后期制作",      bossCode: 170600, source: "boss" },
      { id: "mf-vfx",          name: "影视特效",      bossCode: 170600, source: "boss" },
      { id: "mf-host",         name: "主持人/DJ",     bossCode: 170600, source: "boss" },
      { id: "mf-writer",       name: "编辑/撰稿人",   bossCode: 170100, source: "boss" },
      { id: "mf-journalist",   name: "记者/采编",     bossCode: 170100, source: "boss" },
      { id: "mf-producer",     name: "制片人",        bossCode: 170600, source: "boss" },
    ],
  },

  /* ── 金融 ── */
  {
    id: "consulting",
    name: "咨询",
    emoji: "🧠",
    description: "战略咨询、管理咨询、行业研究等知识密集型岗位",
    industryId: "fin-sector",
    questionSetRoleId: "strategy-consulting",
    bossCategoryCodes: [260100],
    children: [
      { id: "clt-strategy",    name: "战略咨询",           bossCode: 260100, source: "boss" },
      { id: "clt-management",  name: "企业管理咨询",       bossCode: 260100, source: "boss" },
      { id: "clt-it",          name: "IT咨询顾问",         bossCode: 260100, source: "boss" },
      { id: "clt-hr",          name: "人力资源咨询顾问",   bossCode: 260100, source: "boss" },
      { id: "clt-research",    name: "市场调研",           bossCode: 260100, source: "boss" },
      { id: "clt-pm",          name: "咨询项目管理",       bossCode: 260100, source: "boss" },
      { id: "clt-director",    name: "咨询总监",           bossCode: 260100, source: "boss" },
      { id: "clt-manager",     name: "咨询经理",           bossCode: 260100, source: "boss" },
    ],
  },
  {
    id: "banking",
    name: "银行",
    emoji: "🏦",
    description: "银行前中后台及信贷、客户管理等金融服务岗位",
    industryId: "fin-sector",
    questionSetRoleId: "account-manager",
    bossCategoryCodes: [180400, 180200],
    children: [
      { id: "bank-rm",         name: "客户经理",     bossCode: 180400, source: "boss" },
      { id: "bank-teller",     name: "柜员",         bossCode: 180400, source: "boss" },
      { id: "bank-lobby",      name: "大堂经理",     bossCode: 180400, source: "boss" },
      { id: "bank-credit",     name: "信贷专员",     bossCode: 180400, source: "boss" },
      { id: "bank-risk",       name: "风控",         bossCode: 180200, source: "boss" },
      { id: "bank-compliance", name: "合规稽查",     bossCode: 180200, source: "boss" },
      { id: "bank-finpm",      name: "金融产品经理", bossCode: 180200, source: "boss" },
    ],
  },
  {
    id: "audit",
    name: "审计",
    emoji: "🔍",
    description: "内审、外审、财务合规、风险管控等审计类岗位",
    industryId: "fin-sector",
    questionSetRoleId: "audit",
    bossCategoryCodes: [150300],
    children: [
      { id: "aud-internal",    name: "审计",         bossCode: 150300, source: "boss" },
      { id: "aud-tax",         name: "税务",         bossCode: 150300, source: "boss" },
      { id: "aud-fa",          name: "财务分析/BP",  bossCode: 150300, source: "boss" },
      { id: "aud-cost",        name: "成本会计",     bossCode: 150300, source: "boss" },
      { id: "aud-general",     name: "总账会计",     bossCode: 150300, source: "boss" },
      { id: "aud-capital",     name: "资金管理",     bossCode: 150300, source: "boss" },
      { id: "aud-advisor",     name: "财务顾问",     bossCode: 150300, source: "boss" },
    ],
  },
  {
    id: "finance-role",
    name: "财务",
    emoji: "💰",
    description: "会计、财务规划、税务、资金管理等全链路财务岗位",
    industryId: "fin-sector",
    questionSetRoleId: "finance",
    bossCategoryCodes: [150300],
    children: [
      { id: "fin-accountant",  name: "会计",         bossCode: 150300, source: "boss" },
      { id: "fin-cashier",     name: "出纳",         bossCode: 150300, source: "boss" },
      { id: "fin-analysis",    name: "财务分析/BP",  bossCode: 150300, source: "boss" },
      { id: "fin-tax",         name: "税务",         bossCode: 150300, source: "boss" },
      { id: "fin-capital",     name: "资金管理",     bossCode: 150300, source: "boss" },
      { id: "fin-cost",        name: "成本会计",     bossCode: 150300, source: "boss" },
      { id: "fin-general",     name: "总账会计",     bossCode: 150300, source: "boss" },
      { id: "fin-cfo",         name: "CFO/财务总监", bossCode: 150300, source: "manual" },
    ],
  },
  {
    id: "securities-investment",
    name: "证券 / 投资",
    emoji: "📉",
    description: "券商、基金、投行、私募等资本市场岗位",
    industryId: "fin-sector",
    questionSetRoleId: "strategy-consulting",
    bossCategoryCodes: [180100],
    children: [
      { id: "sec-analyst",     name: "证券分析师/研究员", bossCode: 180100, source: "boss" },
      { id: "sec-trader",      name: "交易员",           bossCode: 180100, source: "boss" },
      { id: "sec-investment",  name: "投资经理",         bossCode: 180100, source: "boss" },
      { id: "sec-fund",        name: "基金经理",         bossCode: 180100, source: "boss" },
      { id: "sec-ib",          name: "投行/并购",        bossCode: 180100, source: "boss" },
      { id: "sec-risk",        name: "量化风控",         bossCode: 180100, source: "manual" },
    ],
  },

  /* ── 新能源 ── */
  {
    id: "nev",
    name: "新能源汽车",
    emoji: "🚗",
    description: "电动汽车整车、三电系统、智能驾驶相关岗位",
    industryId: "new-energy",
    questionSetRoleId: "embedded-engineer",
    bossCategoryCodes: [102700],
    children: [
      { id: "nev-battery",     name: "动力电池工程师",     bossCode: 102700, source: "boss" },
      { id: "nev-bms",         name: "BMS软件工程师",      bossCode: 102700, source: "boss" },
      { id: "nev-motor",       name: "电机/电控工程师",    bossCode: 102700, source: "boss" },
      { id: "nev-adas",        name: "ADAS/智能驾驶工程师",bossCode: 102700, source: "boss" },
      { id: "nev-vehicle",     name: "整车设计工程师",     bossCode: 102700, source: "boss" },
      { id: "nev-pm",          name: "新能源汽车产品经理", bossCode: 102700, source: "manual" },
      { id: "nev-ops",         name: "充电桩/能源运营",   bossCode: 102700, source: "manual" },
    ],
  },
  {
    id: "solar-wind",
    name: "光伏 / 风电",
    emoji: "☀️",
    description: "光伏组件、逆变器、风力发电等清洁能源岗位",
    industryId: "new-energy",
    questionSetRoleId: "embedded-engineer",
    bossCategoryCodes: [102700],
    children: [
      { id: "pv-design",       name: "光伏系统设计",     bossCode: 102700, source: "boss" },
      { id: "pv-engineer",     name: "光伏工程师",       bossCode: 102700, source: "boss" },
      { id: "wind-engineer",   name: "风电工程师",       bossCode: 102700, source: "boss" },
      { id: "pv-sales",        name: "光伏销售/BD",      bossCode: 102700, source: "boss" },
      { id: "pv-epc",          name: "EPC项目经理",      bossCode: 102700, source: "manual" },
    ],
  },
  {
    id: "energy-storage",
    name: "储能",
    emoji: "🔋",
    description: "电化学储能、液流电池、大型储能系统等岗位",
    industryId: "new-energy",
    questionSetRoleId: "embedded-engineer",
    bossCategoryCodes: [102700],
    children: [
      { id: "es-cell",         name: "储能电芯工程师",   bossCode: 102700, source: "boss" },
      { id: "es-system",       name: "储能系统工程师",   bossCode: 102700, source: "boss" },
      { id: "es-pcs",          name: "PCS/变流器工程师", bossCode: 102700, source: "boss" },
      { id: "es-ops",          name: "储能运维工程师",   bossCode: 102700, source: "manual" },
    ],
  },

  /* ── 电子 / 通信 / 半导体 ── */
  {
    id: "semiconductor",
    name: "半导体 / 芯片",
    emoji: "🔬",
    description: "芯片设计、验证、封测及EDA等半导体核心岗位",
    industryId: "electronics",
    questionSetRoleId: "embedded-engineer",
    bossCategoryCodes: [102600],
    children: [
      { id: "semi-digital",    name: "数字芯片设计工程师",   bossCode: 102600, source: "boss" },
      { id: "semi-analog",     name: "模拟芯片设计工程师",   bossCode: 102600, source: "boss" },
      { id: "semi-verify",     name: "芯片验证工程师",       bossCode: 102600, source: "boss" },
      { id: "semi-layout",     name: "版图工程师",           bossCode: 102600, source: "boss" },
      { id: "semi-test",       name: "芯片测试工程师",       bossCode: 102600, source: "boss" },
      { id: "semi-packaging",  name: "封装工程师",           bossCode: 102600, source: "boss" },
      { id: "semi-eda",        name: "EDA工程师",            bossCode: 102600, source: "manual" },
      { id: "semi-pm",         name: "芯片产品经理",         bossCode: 102600, source: "manual" },
    ],
  },
  {
    id: "telecom",
    name: "通信工程",
    emoji: "📡",
    description: "5G/6G、基站、无线通信协议等电信基础设施岗位",
    industryId: "electronics",
    questionSetRoleId: "embedded-engineer",
    bossCategoryCodes: [102500],
    children: [
      { id: "tel-rf",          name: "射频工程师",           bossCode: 102500, source: "boss" },
      { id: "tel-baseband",    name: "基带算法工程师",       bossCode: 102500, source: "boss" },
      { id: "tel-protocol",    name: "通信协议工程师",       bossCode: 102500, source: "boss" },
      { id: "tel-network",     name: "网络规划/优化工程师",  bossCode: 102500, source: "boss" },
      { id: "tel-antenna",     name: "天线工程师",           bossCode: 102500, source: "boss" },
      { id: "tel-5g",          name: "5G系统工程师",         bossCode: 102500, source: "manual" },
    ],
  },
  {
    id: "hardware-rd",
    name: "硬件研发",
    emoji: "🖥️",
    description: "消费电子、工业硬件、嵌入式系统等研发岗位",
    industryId: "electronics",
    questionSetRoleId: "embedded-engineer",
    bossCategoryCodes: [102400],
    children: [
      { id: "hw-embedded",     name: "嵌入式软件工程师",   bossCode: 102400, source: "boss" },
      { id: "hw-circuit",      name: "硬件电路工程师",     bossCode: 102400, source: "boss" },
      { id: "hw-pcb",          name: "PCB设计工程师",      bossCode: 102400, source: "boss" },
      { id: "hw-structural",   name: "结构工程师",         bossCode: 102400, source: "boss" },
      { id: "hw-iot",          name: "物联网硬件工程师",   bossCode: 102400, source: "boss" },
      { id: "hw-test",         name: "硬件测试工程师",     bossCode: 102400, source: "manual" },
    ],
  },

  /* ── 其他行业 ── */
  {
    id: "hr-ops",
    name: "人力资源",
    emoji: "👥",
    description: "招聘、培训、薪酬、员工关系等HR全模块岗位",
    industryId: "other",
    questionSetRoleId: "strategy-operations",
    bossCategoryCodes: [160100],
    children: [
      { id: "hr-recruit",      name: "招聘/猎头",       bossCode: 160100, source: "boss" },
      { id: "hr-training",     name: "培训/组织发展",   bossCode: 160100, source: "boss" },
      { id: "hr-comp",         name: "薪酬福利",        bossCode: 160100, source: "boss" },
      { id: "hr-hrbp",         name: "HRBP",            bossCode: 160100, source: "boss" },
      { id: "hr-labor",        name: "员工关系",        bossCode: 160100, source: "boss" },
    ],
  },
  {
    id: "supply-chain",
    name: "供应链 / 物流",
    emoji: "🚚",
    description: "供应链管理、采购、仓储物流等全链路岗位",
    industryId: "other",
    questionSetRoleId: "strategy-operations",
    bossCategoryCodes: [120100],
    children: [
      { id: "sc-procurement",  name: "采购",           bossCode: 120100, source: "boss" },
      { id: "sc-planning",     name: "供应链计划",     bossCode: 120100, source: "boss" },
      { id: "sc-logistics",    name: "物流运营",       bossCode: 120100, source: "boss" },
      { id: "sc-warehouse",    name: "仓储管理",       bossCode: 120100, source: "boss" },
      { id: "sc-manager",      name: "供应链经理",     bossCode: 120100, source: "boss" },
    ],
  },
];

/** 按 id 查找行业 */
export function findIndustry(industryId) {
  return industries.find((i) => i.id === industryId);
}

/** 获取某行业下的所有大类 */
export function getCategoriesByIndustry(industryId) {
  return jobCategories.filter((c) => c.industryId === industryId);
}

/** 按 id 查找大类 */
export function findCategory(categoryId) {
  return jobCategories.find((c) => c.id === categoryId);
}

/** 按大类 id + 细分 id 查找细分岗位 */
export function findSubcategory(categoryId, subcategoryId) {
  return findCategory(categoryId)?.children.find((s) => s.id === subcategoryId);
}

/** 获取大类对应的题库 roleId */
export function getQuestionSetRoleId(categoryId) {
  return findCategory(categoryId)?.questionSetRoleId;
}

/** 获取所有细分岗位的平铺列表（含所属大类信息） */
export function flattenSubcategories() {
  return jobCategories.flatMap((cat) =>
    cat.children.map((sub) => ({
      ...sub,
      categoryId: cat.id,
      categoryName: cat.name,
      questionSetRoleId: cat.questionSetRoleId,
    }))
  );
}
