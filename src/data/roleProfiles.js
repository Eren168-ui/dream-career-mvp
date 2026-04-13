function gap(dimension, label, description) {
  return { dimension, label, description };
}

function successCase(name, background, keyMove, lesson) {
  return { name, background, keyMove, lesson };
}

export const ROLE_PROFILES = {
  "product-manager": {
    name: "产品经理",
    coreCompetencies: ["用户洞察", "需求结构化", "跨团队对齐", "数据迭代"],
    topCompanies: ["字节跳动", "腾讯", "美团", "阿里巴巴"],
    avgSalary: "18k-35k / 月",
    careerPath: "产品实习生 → 助理 PM → 产品经理 → 高级产品经理",
    gapDimensions: [
      gap("user_insight", "用户洞察", "是否能透过表面反馈识别真实用户问题与场景。"),
      gap("requirement_structuring", "需求结构化", "是否能把模糊想法拆成目标、范围、优先级和 MVP。"),
      gap("stakeholder_alignment", "协同推进", "是否能与设计、研发、运营对齐目标并推动落地。"),
      gap("data_iteration", "数据迭代", "是否能用数据、反馈和复盘不断修正方案。"),
    ],
    successCases: [
      successCase(
        "案例 1：校园选课流程改造",
        "针对选课高峰期卡顿和信息不透明的问题，梳理学生完整旅程并找出三个核心断点。",
        "把问题拆成信息呈现、流程提醒和选课后反馈三条线，先做低成本 MVP，再通过问卷和行为数据复盘优先级。",
        "产品案例的关键不是功能堆叠，而是你能否证明自己真的理解问题、做了取舍，并知道下一步怎么迭代。",
      ),
      successCase(
        "案例 2：社团报名工具优化",
        "原有报名表单完成率低、活动到场率差，社团负责人只能靠人工催收。",
        "先访谈组织者和报名者，再把流程改成“统一入口 + 自动提醒 + 报名后确认”，并用到场率和表单完成率做验证。",
        "哪怕是校园项目，只要你能讲清楚用户、流程、指标和结果，也能形成很像真的产品证据。",
      ),
    ],
  },
  marketing: {
    name: "市场营销",
    coreCompetencies: ["受众洞察", "内容策略", "渠道执行", "结果复盘"],
    topCompanies: ["宝洁", "联合利华", "小红书", "字节跳动"],
    avgSalary: "10k-22k / 月",
    careerPath: "市场实习生 → 市场专员 → 品牌 / 增长经理",
    gapDimensions: [
      gap("audience_insight", "受众洞察", "是否能判断目标人群是谁、为什么会被内容打动。"),
      gap("content_strategy", "内容策略", "是否能围绕目标设计传播主线与内容节奏。"),
      gap("channel_execution", "渠道执行", "是否理解平台差异并能做资源与节奏取舍。"),
      gap("conversion_review", "结果复盘", "是否能从曝光、互动、转化和成本中得出结论。"),
    ],
    successCases: [
      successCase(
        "案例 1：新品校园冷启动",
        "某新品在校园场景中认知度低，活动热度有了但留资效果不稳定。",
        "先明确核心受众，再按渠道拆分内容形式，最终通过内容节奏调整和留资话术优化提升转化。",
        "营销不是只做热闹，真正拉开差距的是你能不能解释为什么这波传播带来了更好的转化。",
      ),
      successCase(
        "案例 2：社媒账号增长复盘",
        "一个校园公众号长期更新，但阅读稳定、互动偏低，团队不知道问题出在哪。",
        "把内容分成信息型、情绪型、活动型三类做复盘，对比打开率、完读率和留言互动，重做栏目结构。",
        "当你能把内容表现拆开讲，而不是一句“做过新媒体运营”，岗位说服力会明显更强。",
      ),
    ],
  },
  "account-manager": {
    name: "客户经理",
    coreCompetencies: ["信任建立", "需求发现", "方案对齐", "长期跟进"],
    topCompanies: ["华为", "腾讯广告", "Salesforce", "招商银行"],
    avgSalary: "10k-25k / 月 + 绩效",
    careerPath: "商务支持 → 客户经理 → 大客户经理 → 销售总监",
    gapDimensions: [
      gap("trust_building", "信任建立", "是否能在陌生场景快速建立专业、稳定的第一印象。"),
      gap("needs_discovery", "需求发现", "是否能把客户含糊的表达追问成清楚需求。"),
      gap("solution_alignment", "方案对齐", "是否能在客户目标和内部资源间找到平衡方案。"),
      gap("relationship_followthrough", "长期跟进", "是否能在推进周期长、变化多时持续维护关系。"),
    ],
    successCases: [
      successCase(
        "案例 1：校企合作推进",
        "一项校企合作意向反复拖延，双方对交付范围理解不一致。",
        "通过二次访谈重新梳理客户真正关心的结果，再把方案拆成可分阶段推进的版本，降低对方决策压力。",
        "客户岗位不是一次讲赢，而是让对方在整个推进过程中一直愿意继续信任你。",
      ),
      successCase(
        "案例 2：大赛赞助拓展",
        "团队在拉赞助时频繁被拒，原因并不是预算，而是方案无法对应商家的目标。",
        "把统一招商话术改成按行业定制的合作提案，并在沟通后持续回访、补材料、调整权益设计。",
        "你真正要证明的不是“我能聊”，而是“我能听懂对方为什么不买单”。",
      ),
    ],
  },
  "ai-algorithm-engineer": {
    name: "AI算法工程师",
    coreCompetencies: ["建模理解", "实验设计", "复现迭代", "工程落地"],
    topCompanies: ["字节跳动", "百度", "阿里达摩院", "华为诺亚"],
    avgSalary: "25k-45k / 月",
    careerPath: "算法实习生 → 算法工程师 → 高级算法工程师 → 技术专家",
    gapDimensions: [
      gap("mathematical_modeling", "建模理解", "是否理解指标、损失函数和建模选择背后的原因。"),
      gap("experiment_design", "实验设计", "是否能建立基线、做对照实验并记录关键变量。"),
      gap("reproduction_iteration", "复现迭代", "是否能在复现和调参中稳定推进问题定位。"),
      gap("engineering_deployment", "工程落地", "是否考虑模型上线、资源、延迟和业务接入约束。"),
    ],
    successCases: [
      successCase(
        "案例 1：公开数据集分类模型优化",
        "基线模型准确率一般，最初只会盲目调参，无法解释结果变化。",
        "重新建立实验记录，分别验证数据增强、模型结构和损失函数调整的影响，并做误差分析定位瓶颈。",
        "算法项目的亮点不在“用了什么大模型”，而在“你能不能解释为什么这样改更有效”。",
      ),
      successCase(
        "案例 2：推荐模型离线到线上方案",
        "一个推荐模型离线指标不错，但业务团队担心上线成本和延迟风险。",
        "补充推理耗时、召回收益和服务接入方案说明，把算法结论翻译成业务和工程可接受的决策材料。",
        "真正成熟的算法工程师，不只看离线效果，也会考虑它是否真的能被用起来。",
      ),
    ],
  },
  "embedded-engineer": {
    name: "嵌入式开发工程师",
    coreCompetencies: ["硬件基础", "问题定位", "稳定性验证", "文档吸收"],
    topCompanies: ["华为", "比亚迪", "大疆", "小米 IoT"],
    avgSalary: "15k-30k / 月",
    careerPath: "固件实习生 → 嵌入式工程师 → 平台工程师 → 技术负责人",
    gapDimensions: [
      gap("hardware_foundation", "底层基础", "是否理解接口、寄存器、资源限制和系统链路。"),
      gap("debugging_trace", "排障定位", "是否能按现象和链路逐层定位问题。"),
      gap("stability_verification", "稳定性验证", "是否能从边界条件和异常场景验证系统稳定性。"),
      gap("documentation_absorption", "文档吸收", "是否愿意并能够从手册和协议中提取关键约束。"),
    ],
    successCases: [
      successCase(
        "案例 1：传感器联调异常排查",
        "设备在特定温度下出现数据漂移，最初只看应用层日志无法定位原因。",
        "从协议抓包、驱动时序、供电稳定性三层排查，最终确认是初始化时序在边界条件下不稳。",
        "嵌入式的价值不在“写了多少代码”，而在你是否能把底层问题一步步查清楚。",
      ),
      successCase(
        "案例 2：控制板功能回归验证",
        "新功能跑通后，老功能在高并发场景下偶发失效，团队一度以为是硬件问题。",
        "建立回归清单和异常复现流程，对中断、资源占用和时序冲突逐步验证，最终找到软件侧竞争条件。",
        "稳定性意识是嵌入式岗位的核心分水岭，功能跑通只是开始。",
      ),
    ],
  },
  "strategy-consulting": {
    name: "战略咨询",
    coreCompetencies: ["结构化拆解", "行业研究", "商业综合", "高层表达"],
    topCompanies: ["麦肯锡", "BCG", "贝恩", "德勤战略"],
    avgSalary: "20k-40k / 月",
    careerPath: "分析师 → 顾问 → 项目经理 → 合伙人",
    gapDimensions: [
      gap("structured_problem_solving", "结构化拆解", "是否能把复杂问题拆成清晰框架与分析路径。"),
      gap("industry_research", "行业研究", "是否能快速吸收行业、公司和竞争信息。"),
      gap("business_synthesis", "商业综合", "是否能把数据与事实整合成商业判断。"),
      gap("executive_communication", "高层表达", "是否能把复杂内容压缩成管理层能快速理解的结论。"),
    ],
    successCases: [
      successCase(
        "案例 1：新消费行业进入策略",
        "面对一个看似热闹的新消费赛道，团队最初只停留在市场规模和品牌案例罗列。",
        "重新拆分成用户需求、竞争格局、渠道壁垒和盈利路径四块，再用数据和访谈验证关键假设。",
        "咨询案例不是看你收集了多少信息，而是看你能否用信息支撑一个可执行判断。",
      ),
      successCase(
        "案例 2：区域扩张优先级评估",
        "客户准备拓展新区域，但内部对是先扩规模还是先做单点验证意见不一致。",
        "通过人口结构、渠道成本、竞争密度和回本周期对区域做分层，最终形成分阶段进入建议。",
        "结构化分析的终点不是漂亮的框架，而是让管理层敢据此做决策。",
      ),
    ],
  },
  "strategy-operations": {
    name: "策略运营",
    coreCompetencies: ["指标拆解", "业务诊断", "跨团队推动", "策略沉淀"],
    topCompanies: ["字节跳动", "美团", "小红书", "滴滴"],
    avgSalary: "15k-28k / 月",
    careerPath: "运营实习生 → 策略运营 → 高级策略运营 → 业务负责人",
    gapDimensions: [
      gap("metric_decomposition", "指标拆解", "是否能把业务目标拆到关键指标和分层切片。"),
      gap("business_diagnosis", "业务诊断", "是否能在看数前先校准口径并判断业务原因。"),
      gap("cross_function_push", "协同推进", "是否能推动产品、销售、技术等多方共同落地策略。"),
      gap("strategy_iteration", "策略沉淀", "是否能从执行结果里沉淀可复用的策略经验。"),
    ],
    successCases: [
      successCase(
        "案例 1：留存下降策略诊断",
        "业务留存突然下降，团队一开始只想追加活动预算。",
        "先拆用户分层和关键漏斗，再发现问题主要集中在新用户首次转化阶段，随后改成分层激励和触达优化。",
        "策略运营的价值不在于动作多，而在于先把真正的问题找准。",
      ),
      successCase(
        "案例 2：商家活跃度提升项目",
        "商家侧活跃波动大，运营同学各做各的动作，缺少统一判断框架。",
        "把目标拆成激活、复访、产出三个指标层，再结合商家类型分层设计动作和复盘机制。",
        "好的策略运营不是“今天干了什么”，而是“以后类似问题该怎么更快判断”。",
      ),
    ],
  },
  audit: {
    name: "审计",
    coreCompetencies: ["证据追踪", "风险识别", "会计判断", "规范执行"],
    topCompanies: ["普华永道", "德勤", "安永", "毕马威"],
    avgSalary: "9k-18k / 月",
    careerPath: "审计助理 → 审计员 → 高级审计员 → 经理",
    gapDimensions: [
      gap("evidence_tracing", "证据追踪", "是否能顺着业务与凭证建立清楚的证据链。"),
      gap("control_risk_sense", "风险识别", "是否能敏感发现流程漏洞、异常波动和控制缺口。"),
      gap("accounting_judgment", "会计判断", "是否理解核算逻辑和规则适用，而不是只看表面数字。"),
      gap("compliance_discipline", "规范执行", "是否能在高重复、高要求场景下保持准确稳定。"),
    ],
    successCases: [
      successCase(
        "案例 1：采购流程控制点识别",
        "一个采购流程看似完整，但对账差异反复出现，业务部门认为只是偶发疏漏。",
        "沿着申请、审批、入库、付款全链路梳理控制点，最终定位到职责分离和凭证留存不充分的问题。",
        "审计的价值不在“找到一个错”，而在于说清楚这类问题为什么会重复发生。",
      ),
      successCase(
        "案例 2：收入异常波动核查",
        "季度收入出现异常上升，但资料表面上没有明显问题。",
        "把合同条款、确认时点和回款记录交叉核对，最终发现收入确认节奏存在提前倾向。",
        "当你能把核查逻辑说清楚，严谨性才会真正变成岗位说服力。",
      ),
    ],
  },
  finance: {
    name: "财务",
    coreCompetencies: ["报表分析", "业财联动", "成本管理", "财务表达"],
    topCompanies: ["华为", "字节跳动", "阿里巴巴", "宝洁"],
    avgSalary: "10k-22k / 月",
    careerPath: "财务分析实习生 → 财务分析师 → FP&A → 财务经理",
    gapDimensions: [
      gap("report_analysis", "报表分析", "是否能从收入、成本、利润变化读出经营信号。"),
      gap("business_finance_linking", "业财联动", "是否能把财务指标和业务动作建立联系。"),
      gap("cost_management", "成本管理", "是否理解预算、费用、资源配置和投入产出判断。"),
      gap("financial_communication", "财务表达", "是否能把数字结论转成业务团队能接受的说明。"),
    ],
    successCases: [
      successCase(
        "案例 1：利润变化经营解释",
        "某业务利润率持续下滑，团队最初只盯着销售额，没意识到成本结构变化才是关键。",
        "拆开收入、折扣、履约和营销成本，重新解释利润变化路径，并提出预算侧的优化建议。",
        "财务真正的价值不只是记录数字，而是把数字变成经营判断语言。",
      ),
      successCase(
        "案例 2：预算执行偏差复盘",
        "预算执行结果与年初计划偏差较大，但各业务部门都认为“是外部环境变化”。",
        "把偏差拆成量、价、结构和节奏四类，再和业务对齐哪些是判断问题，哪些是执行问题。",
        "财务岗位的成熟度，体现在你能否把复杂偏差讲成各方都能行动的结论。",
      ),
    ],
  },
  "data-analyst": {
    name: "数据分析",
    coreCompetencies: ["问题定义", "口径校准", "量化分析", "洞察表达"],
    topCompanies: ["字节跳动", "美团", "阿里巴巴", "京东"],
    avgSalary: "15k-30k / 月",
    careerPath: "数据分析实习生 → 数据分析师 → 商业分析 → 数据负责人",
    gapDimensions: [
      gap("problem_definition", "问题定义", "是否能在取数前先说清楚要回答的业务问题。"),
      gap("metric_calibration", "指标口径", "是否能确认指标定义、分层方式和统计口径。"),
      gap("quantitative_analysis", "量化分析", "是否能完成清洗、验证和多假设分析。"),
      gap("insight_communication", "洞察表达", "是否能把分析结果讲成业务可理解的建议。"),
    ],
    successCases: [
      successCase(
        "案例 1：用户留存下降诊断",
        "业务发现留存掉了，但团队最初只想直接加促活活动，缺少问题拆解。",
        "先确认口径，再按新老用户、渠道和关键行为分层分析，最后定位到新用户首周转化异常。",
        "数据分析的核心不是图表多，而是你能不能把问题定义清楚，再把原因找准。",
      ),
      successCase(
        "案例 2：看板口径统一项目",
        "不同团队对同一指标口径理解不一，导致复盘会上经常各说各话。",
        "重新梳理指标定义、分层规则和统计口径，并把看板说明文档化，减少错误解读。",
        "很多数据岗面试看重的不只是分析能力，还有你是否有足够强的口径意识。",
      ),
    ],
  },
};

export function getRoleProfile(roleId) {
  return ROLE_PROFILES[roleId] ?? null;
}

export function getRoleProfileName(roleId) {
  return ROLE_PROFILES[roleId]?.name ?? roleId;
}
