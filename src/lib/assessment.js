import { getRoleById } from "../data/roles.js";
import { findQuestionSetByRole } from "../data/questionSets.js";
import { getResultTemplate } from "../data/resultTemplates.js";
import { getRoleProfile } from "../data/roleProfiles.js";
import { getRoleConfig, getContextualActionPlan } from "../data/roleConfig.js";

const answerScoreMap = {
  rarely: 1,
  sometimes: 2,
  often: 3,
  always: 4,
};

const dimensionLabels = {
  problem_solving:           "看懂问题",
  communication:             "讲清想法",
  ownership:                 "主动推进",
  analysis:                  "看懂数据",
  market_sense:              "理解市场",
  execution:                 "把事做完",
  relationship:              "维护关系",
  resilience:                "抗压能力",
  learning:                  "学得够快",
  detail:                    "顾到细节",
  structure:                 "讲得有条理",
  discipline:                "遵守规范",
  user_insight:              "理解用户",
  requirement_structuring:   "拆清需求",
  stakeholder_alignment:     "协同推进",
  data_iteration:            "数据复盘",
  audience_insight:          "理解读者",
  content_strategy:          "内容规划",
  channel_execution:         "跑通渠道",
  conversion_review:         "效果复盘",
  trust_building:            "建立信任",
  needs_discovery:           "看懂需求",
  solution_alignment:        "讲清方案",
  relationship_followthrough:"持续跟进",
  mathematical_modeling:     "数学建模",
  experiment_design:         "设计实验",
  reproduction_iteration:    "复现调试",
  engineering_deployment:    "工程部署",
  hardware_foundation:       "硬件基础",
  debugging_trace:           "排查问题",
  stability_verification:    "稳定验证",
  documentation_absorption:  "读懂文档",
  structured_problem_solving:"拆解问题",
  industry_research:         "研究行业",
  business_synthesis:        "商业判断",
  executive_communication:   "向上汇报",
  metric_decomposition:      "拆解数据",
  business_diagnosis:        "读懂业务",
  cross_function_push:       "跨部门推进",
  strategy_iteration:        "持续优化",
  evidence_tracing:          "找到证据",
  control_risk_sense:        "识别风险",
  accounting_judgment:       "会计判断",
  compliance_discipline:     "合规执行",
  report_analysis:           "看懂报表",
  business_finance_linking:  "业财结合",
  cost_management:           "成本管控",
  financial_communication:   "讲清数字",
  problem_definition:        "定义问题",
  metric_calibration:        "口径对齐",
  quantitative_analysis:     "量化分析",
  insight_communication:     "讲清洞察",
};

const dimensionTraitCopy = {
  problem_solving:           { strength: "你更容易先抓住问题核心，再决定怎么拆。", growth: "先把现象、原因和目标拆开，别急着直接下结论。" },
  communication:             { strength: "你能把自己的判断讲得更清楚，不容易越说越乱。", growth: "先练习一句话讲清重点，减少表达里的绕弯子。" },
  ownership:                 { strength: "你会主动把事情往前推，而不是等别人提醒。", growth: "先把下一步动作说清楚，别让推进停在想法阶段。" },
  analysis:                  { strength: "你更愿意用信息和证据支持判断。", growth: "先补数据和事实依据，别只靠直觉判断。" },
  market_sense:              { strength: "你对市场变化和岗位环境更有感觉。", growth: "多看真实行业案例，先把外部变化和岗位要求连起来。" },
  execution:                 { strength: "你能把计划落到动作上，不容易只停在概念里。", growth: "先把动作拆细并执行到位，别让计划停在纸面上。" },
  relationship:              { strength: "你更懂得在合作里维护关系和推进节奏。", growth: "先练习持续跟进，让合作不只停在一次沟通。" },
  resilience:                { strength: "遇到压力时你更能稳住节奏。", growth: "先建立复盘习惯，别让压力直接打断行动。" },
  learning:                  { strength: "你吸收新方法和新任务的速度更快。", growth: "先固定一套学习节奏，别总是学了又散。" },
  detail:                    { strength: "你对关键细节更敏感，不容易漏掉硬伤。", growth: "先把检查动作做完整，避免小失误拖累整体表现。" },
  structure:                 { strength: "你能把复杂信息讲得更有层次。", growth: "先按背景、问题、动作、结果去组织表达。" },
  discipline:                { strength: "你在规则和流程里执行得更稳。", growth: "先把规范要求记清楚，避免边做边补漏洞。" },
  user_insight:              { strength: "你更容易先抓到用户真正卡住的点。", growth: "先把反馈翻译成真实需求，别只看表面描述。" },
  requirement_structuring:   { strength: "你能把零散信息整理成清楚需求。", growth: "先把目标、约束和优先级拆清楚，再进入方案。" },
  stakeholder_alignment:     { strength: "你能更自然地把不同人的想法拉到同一页。", growth: "先练习在分歧里讲清取舍，而不是只重复各方意见。" },
  data_iteration:            { strength: "你会用数据判断方案该不该继续。", growth: "先补指标意识，别只凭感觉判断效果。" },
  audience_insight:          { strength: "你更容易抓住内容真正要打动的人。", growth: "先把受众画像说清楚，再决定内容怎么写。" },
  content_strategy:          { strength: "你更能把内容方向和目标连起来。", growth: "先明确内容目标，别只追求形式好看。" },
  channel_execution:         { strength: "你对不同渠道的节奏和打法更有感觉。", growth: "先区分平台差异，别用一套方法跑所有渠道。" },
  conversion_review:         { strength: "你会回头看动作有没有真正带来结果。", growth: "先把曝光、互动和转化拆开复盘，别只看热闹数据。" },
  trust_building:            { strength: "你更容易在合作里建立让人放心的感觉。", growth: "先把承诺和跟进做扎实，信任才会慢慢形成。" },
  needs_discovery:           { strength: "你能更快听出对方真正想解决的问题。", growth: "先多追问需求背景，别急着给答案。" },
  solution_alignment:        { strength: "你能把方案讲到对方愿意继续往下聊。", growth: "先把方案和对方目标对齐，再谈你的想法。" },
  relationship_followthrough:{ strength: "你会持续跟进，不容易把合作放丢。", growth: "先把跟进节奏固定下来，别总靠临时想起。" },
  mathematical_modeling:     { strength: "你有把问题抽象成模型的能力。", growth: "先把变量、假设和目标理顺，再开始建模。" },
  experiment_design:         { strength: "你更懂得怎么把实验做得可比较、可解释。", growth: "先补基线和变量控制，别让实验结论站不住。" },
  reproduction_iteration:    { strength: "你愿意反复复现和调参，把问题做实。", growth: "先把每次迭代记录清楚，别只留最后结果。" },
  engineering_deployment:    { strength: "你会把技术方案往可落地的方向推进。", growth: "先补部署和工程约束，别只停在离线效果里。" },
  hardware_foundation:       { strength: "你的底层基础更能支撑后续排障和联调。", growth: "先把底层原理补稳，别只会照着接线和改代码。" },
  debugging_trace:           { strength: "你更擅长沿着链路一步步找到问题。", growth: "先练习按现象、日志、接口顺序排查，别跳步猜测。" },
  stability_verification:    { strength: "你会主动考虑稳定性，而不只追求跑通。", growth: "先把异常场景也测进去，别只验证正常流程。" },
  documentation_absorption:  { strength: "你能更快从文档里抓到关键约束。", growth: "先练习读文档找重点，减少边试边猜。" },
  structured_problem_solving:{ strength: "你能把复杂问题拆成有顺序的步骤。", growth: "先把问题框住，再分层拆解，不要一上来就发散。" },
  industry_research:         { strength: "你更容易把行业信息整理成有用判断。", growth: "先从行业事实出发，别只堆信息不下判断。" },
  business_synthesis:        { strength: "你能把业务信息合成更完整的结论。", growth: "先把市场、财务和竞争关系串起来，再下结论。" },
  executive_communication:   { strength: "你更能把复杂内容压缩成领导听得懂的话。", growth: "先练习短句结论和重点前置，减少铺垫。" },
  metric_decomposition:      { strength: "你能把大目标拆成可跟踪的指标。", growth: "先把核心目标和关键指标对应起来，别只看总结果。" },
  business_diagnosis:        { strength: "你更容易看出业务问题真正卡在哪。", growth: "先分清现象和根因，再决定往哪条线深挖。" },
  cross_function_push:       { strength: "你能把跨团队协作往结果上推进。", growth: "先把责任边界和节点讲明白，减少推进中的反复。" },
  strategy_iteration:        { strength: "你会边做边调，不容易固守第一版方案。", growth: "先建立复盘节点，别等结果不好才回头看。" },
  evidence_tracing:          { strength: "你更擅长从证据里找到可靠判断。", growth: "先把证据链补完整，别急着凭印象下结论。" },
  control_risk_sense:        { strength: "你对风险点更敏感，能提前发现问题。", growth: "先把关键风险列出来，再决定动作顺序。" },
  accounting_judgment:       { strength: "你对数字背后的业务含义更有判断。", growth: "先把会计口径和业务场景对上，避免只背概念。" },
  compliance_discipline:     { strength: "你能在规则要求下把动作做得更稳。", growth: "先把合规边界记牢，别做完才发现踩线。" },
  report_analysis:           { strength: "你能从报表里更快看出重点变化。", growth: "先练习按指标和原因拆读报表，别只看结果高低。" },
  business_finance_linking:  { strength: "你更能把业务动作和财务结果联系起来。", growth: "先把业务变化和财务影响连起来理解。" },
  cost_management:           { strength: "你有控制成本和评估投入产出的意识。", growth: "先建立成本视角，别只看要做什么不看代价。" },
  financial_communication:   { strength: "你能把复杂数字讲成别人听得懂的话。", growth: "先把结论和数字对应起来，避免只堆报表术语。" },
  problem_definition:        { strength: "你能先把题目定义清楚，再开始分析。", growth: "先明确要回答什么问题，别一开始就散着做。" },
  metric_calibration:        { strength: "你更懂得先把指标口径对齐。", growth: "先确认口径一致，再比较数据和得出判断。" },
  quantitative_analysis:     { strength: "你能用量化方式把判断讲得更稳。", growth: "先补数据分析基本功，别只给方向不给依据。" },
  insight_communication:     { strength: "你能把洞察压缩成更有说服力的表达。", growth: "先把洞察讲成一句结论，再补支撑依据。" },
};

function getFitLabel(score) {
  if (score >= 80) return "匹配度较高";
  if (score >= 65) return "潜力明显";
  return "需要补足";
}

function getDimensionLevel(average) {
  if (average >= 3.25) return "优势项";
  if (average >= 2.5) return "可发展";
  return "待补足";
}

function averageByDimension(questionSet, answers) {
  const buckets = new Map();

  questionSet.questions.forEach((item) => {
    const score = answerScoreMap[answers[item.id]] ?? 0;
    const current = buckets.get(item.dimension) ?? { total: 0, count: 0 };
    current.total += score;
    current.count += 1;
    buckets.set(item.dimension, current);
  });

  return Array.from(buckets.entries())
    .map(([dimension, value]) => {
      const average = value.count === 0 ? 0 : Number((value.total / value.count).toFixed(2));
      return {
        dimension,
        label: dimensionLabels[dimension] ?? dimension,
        average,
        score: Math.round((average / 4) * 100),
        level: getDimensionLevel(average),
      };
    })
    .sort((left, right) => right.average - left.average);
}

function getTraitCopy(dimension, label, kind) {
  const scopedCopy = dimensionTraitCopy[dimension]?.[kind];
  if (scopedCopy) {
    return scopedCopy;
  }

  return kind === "strength"
    ? `你在「${label}」上更容易形成稳定发挥。`
    : `先把「${label}」练成稳定动作，别继续靠感觉处理。`;
}

function buildTraitCards(dimensionRanking, kind, limit = 3) {
  const source =
    kind === "strength"
      ? dimensionRanking.slice(0, limit)
      : [...dimensionRanking].slice(-limit).reverse();

  return source.map((item) => ({
    dimension: item.dimension,
    keyword: item.label,
    explanation: getTraitCopy(item.dimension, item.label, kind),
    score: item.score,
  }));
}

function buildWarmClosingMessage(baseContent, roleName) {
  return `${baseContent} 你不用一下子把所有差距都补完，先把最关键的一步走稳，就已经在往 ${roleName} 靠近了。后面的准备过程里，这份结果会更像一张同行地图，帮你一点点把方向看清、把动作落下去。`;
}

function resolvePlanByResumeStage(plan, resumeStage) {
  if (Array.isArray(plan)) {
    return plan;
  }

  if (plan && typeof plan === "object") {
    return plan[resumeStage] ?? plan.default ?? [];
  }

  return [];
}

function buildOverseasHooks(template) {
  return (template.overseas ?? []).map((item) => `${item.path}：${item.focus}`);
}

function buildNextSteps(template, roleName, targetCompany, weakestFocus, internshipPlan) {
  return [
    `先完成 1 个和 ${roleName} 强相关的案例沉淀，确保能讲清楚场景、动作、结果和复盘。`,
    weakestFocus
      ? `把「${weakestFocus}」设成接下来 4 周的专项补足主题，避免继续模糊带过。`
      : template.studyPlan[0],
    targetCompany
      ? `整理 ${targetCompany} 或同类公司的 5 条岗位 JD，对照现有材料补关键词和证据。`
      : internshipPlan[0] ?? template.studyPlan[0],
  ];
}

function getClosingContent(roleConfig, fitLabel, careerStage, fallback) {
  const closingMap = roleConfig?.resultTemplate?.closingMessage?.byFitLabelCareerStage;

  return (
    closingMap?.[fitLabel]?.[careerStage]
    ?? closingMap?.[fitLabel]?.clear_goal_no_action
    ?? fallback
  );
}

export function getQuestionSetForRole(roleId) {
  const questionSet = findQuestionSetByRole(roleId);
  if (!questionSet) {
    throw new Error(`Question set not found for role: ${roleId}`);
  }
  return questionSet;
}

export function buildAssessmentResult({ profile, answers }) {
  const role = getRoleById(profile.targetRole);
  const questionSet = getQuestionSetForRole(profile.targetRole);
  const template = getResultTemplate(profile.targetRole);
  const roleConfig = getRoleConfig(profile.targetRole);
  const roleProfile = getRoleProfile(profile.targetRole);

  if (!role || !template) {
    throw new Error(`Role template not found for role: ${profile.targetRole}`);
  }

  const topCompanies = roleConfig?.topCompanies ?? roleProfile?.topCompanies ?? [];
  const avgSalary = roleConfig?.avgSalary ?? roleProfile?.avgSalary ?? "–";
  const careerPath = roleConfig?.careerPath ?? roleProfile?.careerPath ?? "–";
  const coreCompetencies = roleConfig?.coreCompetencies ?? roleProfile?.coreCompetencies ?? [];

  const studyPlan =
    (roleConfig?.resultTemplate?.actionGuide?.studyPlan?.length > 0
      ? roleConfig.resultTemplate.actionGuide.studyPlan
      : null)
    ?? template.studyPlan;

  const internshipPlan =
    resolvePlanByResumeStage(
      roleConfig?.resultTemplate?.actionGuide?.internshipPlan ?? template.internshipPlan,
      profile.resumeStage,
    );

  const hardSkills =
    (roleConfig?.resultTemplate?.actionGuide?.skillPlan?.hardSkills?.length > 0
      ? roleConfig.resultTemplate.actionGuide.skillPlan.hardSkills
      : null)
    ?? template.hardSkills;

  const softSkills =
    (roleConfig?.resultTemplate?.actionGuide?.skillPlan?.softSkills?.length > 0
      ? roleConfig.resultTemplate.actionGuide.skillPlan.softSkills
      : null)
    ?? template.softSkills;

  const marketContent = roleConfig?.resultTemplate?.marketReality?.content ?? template.reality;
  const requirements = roleProfile?.keyRequirements ?? template.requirements ?? [];

  const totalScore = questionSet.questions.reduce(
    (sum, item) => sum + (answerScoreMap[answers[item.id]] ?? 0),
    0,
  );
  const maxScore = questionSet.questions.length * 4;
  const score = Math.round((totalScore / maxScore) * 100);
  const fitLabel = getFitLabel(score);
  const dimensionRanking = averageByDimension(questionSet, answers);
  const strengths = dimensionRanking.slice(0, 2).map((item) => `${item.label}（${item.level}）`);
  const blindSpots = dimensionRanking.slice(-2).map((item) => `${item.label}（${item.level}）`);
  const strongestFocus = dimensionRanking[0]?.label ?? coreCompetencies[0] ?? "核心能力";
  const weakestFocus = dimensionRanking.at(-1)?.label;

  const strengthCards = buildTraitCards(dimensionRanking, "strength");
  const growthCards = buildTraitCards(dimensionRanking, "growth");
  const positiveHighlights = strengthCards.map((item) => `${item.keyword}，${item.explanation}`);
  const growthHints = growthCards.map((item) => `${item.keyword}，${item.explanation}`);

  const profileHighlights = [
    `你的专业是 ${profile.majorName || "未填写"}，下一步要做的是把课程、项目和实习翻译成 ${role.name} 看得懂的岗位语言。`,
    `当前简历阶段是「${profile.resumeStage}」，这意味着问题不只是能力本身，还包括证据组织方式是否够职业化。`,
    profile.targetCompany
      ? `既然你已经锁定 ${profile.targetCompany}，后续项目、实习和简历表达都应该尽量贴近这类公司的真实招聘要求。`
      : topCompanies.length > 0
      ? `如果还没锁定具体公司，建议优先研究 ${topCompanies.slice(0, 3).join("、")} 这类代表性公司。`
      : `尽快锁定目标公司，用 JD 反推你需要补足的能力缺口。`,
  ];

  const contextualPlan = roleConfig
    ? getContextualActionPlan(profile.targetRole, profile)
    : null;

  const immediateAction =
    contextualPlan?.byResumeStage?.immediateAction
    ?? "把过往经历整理进简历，明确最强的 1 到 2 条主线案例。";

  const firstQuestion =
    contextualPlan?.byCareerStage?.keyQuestion ?? null;

  const closingContent = buildWarmClosingMessage(
    getClosingContent(roleConfig, fitLabel, profile.careerStage, template.closing),
    role.name,
  );
  const overseasHooks = buildOverseasHooks(template);

  return {
    roleId: role.id,
    roleName: role.name,
    questionSetId: questionSet.id,
    score,
    fitScore: score,
    fitLabel,
    dimensionRanking,
    strongestTraits: strengths,
    weakestTraits: blindSpots,
    targetCompany: profile.targetCompany ?? "",
    immediateAction,
    firstQuestion,
    modules: {
      selfAwareness: {
        title: "自我认知",
        fitScore: score,
        fitLabel,
        description: `你当前对 ${role.name} 的整体判断为「${fitLabel}」，优势更集中在 ${strengths.join("、")}。`,
        summary:
          score >= 80
            ? `你和 ${role.name} 的距离已经比较近，重点是尽快把 ${strongestFocus} 变成更硬的投递证据。`
            : score >= 65
            ? `你对 ${role.name} 有明确潜力，但还需要继续放大 ${strongestFocus}，同时补足 ${weakestFocus ?? "关键短板"}。`
            : `你现在不是方向错了，而是证据还弱。先补 ${weakestFocus ?? "关键短板"}，再把 ${strongestFocus} 讲成结果。`,
        highlights: profileHighlights,
        positiveHighlights,
        growthHints,
        strengthCards,
        growthCards,
        coreCompetencies,
        strengths,
        blindSpots,
        dimensionScores: dimensionRanking,
      },
      marketReality: {
        title: "外界认知",
        content: marketContent,
        topCompanies,
        avgSalary,
        careerPath,
        requirements,
      },
      actionGuide: {
        title: "行动指引",
        studyPlan,
        internshipAdvice: internshipPlan[0],
        internshipPlan,
        skillPlan: {
          hardSkills,
          softSkills,
        },
        overseasHooks,
        overseas: template.overseas ?? [],
        immediateAction,
        firstQuestion,
        nextSteps: buildNextSteps(template, role.name, profile.targetCompany, weakestFocus, internshipPlan),
      },
      closingMessage: {
        title: "结尾寄语",
        content: closingContent,
      },
    },
  };
}
