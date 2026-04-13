export const roles = [
  {
    id: "product-manager",
    name: "产品经理",
    emoji: "🎯",
    description: "偏用户理解、需求拆解、跨团队推进的岗位。",
    definition: "连接用户、技术与商业的桥梁，把模糊需求变成可落地的产品方案",
    realWorldInterpretation:
      "产品经理的核心工作是：搞清楚用户真正要什么（而不是用户说要什么），判断哪些事值得做，协调设计和研发把事做出来，上线后看数据迭代。大厂的 PM 分工极细，初期能进去学到完整链路比岗位名字更重要。",
    commonMisconceptions: [
      "产品经理不需要写代码 → 不写，但完全不懂技术可行性会在和研发沟通时失去基本判断力",
      "产品经理=项目经理 → 项目经理管时间表，产品经理管\"做什么\"和\"为什么做\"",
      "产品经理很好转行 → 没有数据分析能力+用户思维+方法论积累，转产品只是换了个头衔",
    ],
  },
  {
    id: "marketing",
    name: "市场营销",
    emoji: "📣",
    description: "偏市场洞察、内容传播、活动转化的岗位。",
    definition: "通过精准触达目标用户，把产品价值转化成真实购买决策",
    realWorldInterpretation:
      "市场营销不是\"做广告\"，而是理解目标用户在哪、用什么内容影响他们、用什么渠道触达他们、怎么量化效果。大厂市场岗分品牌、增长、内容、活动、媒介投放，每个方向差异极大。",
    commonMisconceptions: [
      "\"市场就是发发朋友圈\" → 成熟的市场工作高度依赖数据：投放 ROI、用户转化漏斗、A/B 测试",
      "\"创意最重要\" → 创意是其中一环，没有数据支撑的创意是自嗨",
      "\"市场=公关\" → 公关管品牌声誉，市场管增长和转化",
    ],
  },
  {
    id: "account-manager",
    name: "客户经理",
    emoji: "🤝",
    description: "偏客户沟通、方案整合、关系维护的岗位。",
    definition: "维系和拓展客户关系，把公司服务价值转化成可持续的商业订单",
    realWorldInterpretation:
      "客户经理在不同行业差异极大：银行的主要卖理财产品；互联网的主要维护大客户广告投放；To B 软件的帮客户用好产品、续约扩量。核心共性是：靠专业能力+信任，而不是话术。",
    commonMisconceptions: [
      "\"客户经理就是销售，靠嘴\" → 靠嘴只能做低端单，高净值客户看的是专业判断力",
      "\"适合外向型\" → 内向但细心、稳定的人在关系维护上反而更好",
      "\"没有技术门槛\" → To B 领域的客户经理需要懂自己卖的产品核心逻辑",
    ],
  },
  {
    id: "ai-algorithm-engineer",
    name: "AI算法工程师",
    emoji: "🤖",
    description: "偏建模、实验、工程落地的技术岗位。",
    definition: "研究和落地机器学习/深度学习模型，把算法从论文变成真实跑通的系统",
    realWorldInterpretation:
      "AI算法工程师分很多层：做基础模型研究的（大厂研究院）、做应用层算法的（推荐/广告/CV/NLP）、做工程落地的（MLOps）。大厂应届生门槛极高，但垂直行业（医疗/工业）落地 AI 的机会在快速增加。",
    commonMisconceptions: [
      "\"会用 ChatGPT 就是 AI 工程师\" → 会调用 API 和能训练/优化模型是两回事",
      "\"只要学好数学就行\" → 工程能力（代码/系统设计/模型部署）同样关键",
      "\"AI 是万金油，什么都能做\" → 每个 AI 细分领域知识壁垒都极高",
    ],
  },
  {
    id: "embedded-engineer",
    name: "嵌入式开发工程师",
    emoji: "🔌",
    description: "偏底层开发、硬件联调、稳定性验证的岗位。",
    definition: "在资源受限的硬件平台上编写运行稳定、效率极高的系统级软件",
    realWorldInterpretation:
      "嵌入式工程师做的是让硬件\"会跑\"的那层软件：从单片机固件驱动，到工业控制器实时系统，到车载系统中间件。汽车智能化浪潮让嵌入式供不应求，尤其懂 AUTOSAR/功能安全的人才。",
    commonMisconceptions: [
      "\"嵌入式就是写单片机\" → 现代嵌入式涵盖 RTOS、Linux 驱动、BSP、车载软件栈等多个层次",
      "\"嵌入式不如互联网高薪\" → 车载嵌入式工程师在大厂薪资完全不输互联网",
      "\"只要懂 C 就行\" → 还需要理解硬件原理（数字电路/体系结构）+ 时序/中断/DMA 等底层机制",
    ],
  },
  {
    id: "strategy-consulting",
    name: "战略咨询",
    emoji: "🧠",
    description: "偏结构化分析、行业研究、商业判断的岗位。",
    definition: "用结构化分析和数据支撑，帮助企业高层做出更优的战略决策",
    realWorldInterpretation:
      "战略咨询的核心工作是：接到模糊的大问题，把它拆成可以被数据回答的小问题，通过分析框架+访谈+数据给出有逻辑支撑的建议，再做成 PPT 向客户高管呈现。节奏快、压力大、成长极快。",
    commonMisconceptions: [
      "\"咨询就是出行业报告\" → 真正的战略咨询是解决客户特定问题，不是写通用报告",
      "\"需要什么都懂\" → 需要快速学习+结构化表达+数据分析，不是什么都精通",
      "\"MBA 出身才能进\" → 顶尖咨询公司大量录用本科应届生，但对逻辑和分析能力要求极高",
    ],
  },
  {
    id: "strategy-operations",
    name: "策略运营",
    emoji: "⚙️",
    description: "偏数据分析、策略迭代、业务协同的岗位。",
    definition: "用数据和系统化思维驱动用户增长、内容分发或商业化效率的提升",
    realWorldInterpretation:
      "策略运营是\"懂数据的运营\"，区别于普通执行型运营。核心是分析哪些运营动作真正有效、用模型或规则优化分发/推荐/激励机制、设计实验验证假设。在字节系公司，策略运营几乎和算法团队协作。",
    commonMisconceptions: [
      "\"运营就是发消息、搞活动\" → 策略运营的核心是实验设计和效果归因，不是执行层",
      "\"策略运营就是数据分析师\" → 数据分析师更多出报告，策略运营更多做决策和迭代",
      "\"不需要写代码\" → SQL 是最低要求，Python 是加分项",
    ],
  },
  {
    id: "audit",
    name: "审计",
    emoji: "📋",
    description: "偏流程核查、风险识别、合规判断的岗位。",
    definition: "对企业财务信息的真实性和合规性进行独立核查，出具有公信力的意见",
    realWorldInterpretation:
      "审计分外部审计（四大/国内所）和内部审计。外部审计就是每年给公司\"查账\"，核查财务报表有没有重大错误或造假。工作强度极高（尤其年审季），但能快速积累大量行业财务知识和职业资格（CPA 是标配）。",
    commonMisconceptions: [
      "\"审计就是做表格\" → 审计需要理解企业商业模式、判断重大风险点、和管理层博弈",
      "\"进四大就稳了\" → 四大是跳板，流动率极高，留下来做合伙人的比例极低",
      "\"审计没有意思\" → 能接触不同行业真实财务数据，积累速度比很多岗位快",
    ],
  },
  {
    id: "finance",
    name: "财务",
    emoji: "💰",
    description: "偏财务分析、预算管理、经营支持的岗位。",
    definition: "管理企业资金流动、规划资源配置、支撑战略决策的核心职能",
    realWorldInterpretation:
      "财务不只是记账。财务体系分基础会计/出纳、财务报告、财务分析（FP&A）、税务筹划、资金管理。越往上走越需要业务理解力，顶尖的 CFO 实际上是公司第二号决策者。大厂财务轮岗体系是最快培养路径。",
    commonMisconceptions: [
      "\"财务就是做账\" → 财务分析（FP&A）岗位核心是帮业务部门做预算和决策支撑",
      "\"财务没有发展空间\" → 精通财务+懂业务的人是最稀缺的，晋升路径可以到 CFO",
      "\"财务只需要考 CPA\" → CPA 是资格证，不是能力。财务分析需要更强的商业洞察",
    ],
  },
  {
    id: "data-analyst",
    name: "数据分析",
    emoji: "📊",
    description: "偏指标拆解、分析建模、业务洞察的岗位。",
    definition: "从海量数据中提取有意义的规律，支撑业务决策和产品迭代",
    realWorldInterpretation:
      "数据分析师的日常工作是：取数（SQL）、清洗、分析、可视化、出报告、给结论、推动决策。顶尖的数据分析师会逐渐进化成\"数据驱动业务增长的核心人员\"，而不只是\"提数的人\"。",
    commonMisconceptions: [
      "\"数据分析就是画图\" → 图表只是表达工具，核心是从数据里找到真正影响决策的洞察",
      "\"只要会 Python 就够\" → Python 只是工具，业务理解力才是核心竞争力",
      "\"数据分析和机器学习是一回事\" → 数据分析偏解释性（发生了什么），机器学习偏预测性（会发生什么）",
    ],
  },
];

export const roleSubcategories = [
  { id: "pm-user-growth", roleId: "product-manager", name: "用户增长产品" },
  { id: "pm-platform", roleId: "product-manager", name: "平台产品" },
  { id: "marketing-brand", roleId: "marketing", name: "品牌营销" },
  { id: "marketing-growth", roleId: "marketing", name: "增长营销" },
  { id: "account-enterprise", roleId: "account-manager", name: "企业客户经理" },
  { id: "account-key", roleId: "account-manager", name: "大客户经理" },
  { id: "ai-cv", roleId: "ai-algorithm-engineer", name: "计算机视觉" },
  { id: "ai-llm", roleId: "ai-algorithm-engineer", name: "大模型应用" },
  { id: "embedded-firmware", roleId: "embedded-engineer", name: "固件开发" },
  { id: "embedded-iot", roleId: "embedded-engineer", name: "IoT 设备开发" },
  { id: "consulting-general", roleId: "strategy-consulting", name: "综合战略咨询" },
  { id: "consulting-industry", roleId: "strategy-consulting", name: "行业研究咨询" },
  { id: "ops-strategy", roleId: "strategy-operations", name: "业务策略运营" },
  { id: "ops-growth", roleId: "strategy-operations", name: "增长策略运营" },
  { id: "audit-financial", roleId: "audit", name: "财务审计" },
  { id: "audit-internal", roleId: "audit", name: "内部审计" },
  { id: "finance-fpna", roleId: "finance", name: "经营分析" },
  { id: "finance-accounting", roleId: "finance", name: "会计核算" },
  { id: "data-bi", roleId: "data-analyst", name: "BI 分析" },
  { id: "data-growth", roleId: "data-analyst", name: "增长分析" },
];

export function getRoleById(roleId) {
  return roles.find((role) => role.id === roleId) ?? null;
}
