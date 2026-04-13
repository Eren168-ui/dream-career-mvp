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
  problem_solving: "问题拆解",
  communication: "沟通协同",
  ownership: "主动推进",
  analysis: "分析判断",
  market_sense: "市场敏感度",
  execution: "执行力",
  relationship: "关系经营",
  resilience: "抗压韧性",
  learning: "学习迁移",
  detail: "细节意识",
  structure: "结构化思考",
  discipline: "规范意识",
  user_insight: "用户洞察",
  requirement_structuring: "需求结构化",
  stakeholder_alignment: "协同推进",
  data_iteration: "数据迭代",
  audience_insight: "受众洞察",
  content_strategy: "内容策略",
  channel_execution: "渠道执行",
  conversion_review: "结果复盘",
  trust_building: "信任建立",
  needs_discovery: "需求发现",
  solution_alignment: "方案对齐",
  relationship_followthrough: "长期跟进",
  mathematical_modeling: "建模理解",
  experiment_design: "实验设计",
  reproduction_iteration: "复现迭代",
  engineering_deployment: "工程落地",
  hardware_foundation: "底层基础",
  debugging_trace: "排障定位",
  stability_verification: "稳定性验证",
  documentation_absorption: "文档吸收",
  structured_problem_solving: "结构化拆解",
  industry_research: "行业研究",
  business_synthesis: "商业综合",
  executive_communication: "高层表达",
  metric_decomposition: "指标拆解",
  business_diagnosis: "业务诊断",
  cross_function_push: "协同推进",
  strategy_iteration: "策略沉淀",
  evidence_tracing: "证据追踪",
  control_risk_sense: "风险识别",
  accounting_judgment: "会计判断",
  compliance_discipline: "规范执行",
  report_analysis: "报表分析",
  business_finance_linking: "业财联动",
  cost_management: "成本管理",
  financial_communication: "财务表达",
  problem_definition: "问题定义",
  metric_calibration: "指标口径",
  quantitative_analysis: "量化分析",
  insight_communication: "洞察表达",
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

  const positiveHighlights =
    roleConfig?.resultTemplate?.selfAwareness?.positiveHighlights
    ?? roleProfile?.coreCompetencies?.slice(0, 3).map((item) => `你更容易在「${item}」上建立岗位优势。`)
    ?? [];

  const growthHints =
    roleConfig?.resultTemplate?.selfAwareness?.growthHints
    ?? roleProfile?.gapDimensions?.slice(0, 2).map((item) => `优先补「${item.label ?? item.dimension}」：${item.description}`)
    ?? [];

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

  const closingContent = getClosingContent(roleConfig, fitLabel, profile.careerStage, template.closing);
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
