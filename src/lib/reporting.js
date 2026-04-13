import { getRoleById } from "../data/roles.js";
import { getResultTemplate } from "../data/resultTemplates.js";
import { getRoleProfile } from "../data/roleProfiles.js";

function resolvePlanByResumeStage(plan, resumeStage) {
  if (Array.isArray(plan)) {
    return plan;
  }

  if (plan && typeof plan === "object") {
    return plan[resumeStage] ?? plan.default ?? [];
  }

  return [];
}

function buildResumeIssues(profile) {
  if (profile.resumeStage === "no_resume") {
    return [
      { issue: "当前还没有正式简历，已有课程、项目和实践经历没有被整理成岗位叙事。", severity: "high" },
      { issue: "你手上的经历证据比较分散，招聘方很难快速判断你和目标岗位的相关性。", severity: "high" },
      { issue: "如果现在开始投递，最可能的问题不是能力没有，而是材料组织方式还不够职业化。", severity: "medium" },
    ];
  }

  if (profile.resumeStage === "draft_resume") {
    return [
      { issue: "简历已经有雏形，但很多表达可能仍停留在“做了什么”，没有写出岗位为什么会在意。", severity: "medium" },
      { issue: "项目亮点、岗位关键词和结果表达之间的对应关系还不够明确。", severity: "medium" },
      { issue: "主线案例数量可能够了，但案例层次和排序还没有完全贴近目标岗位。", severity: "low" },
    ];
  }

  return [
    { issue: "你已经开始投递，但简历内容还没有针对目标岗位做更深度的定制。", severity: "medium" },
    { issue: "经历并不少，真正短板往往在于核心证据没有被前置，导致亮点被淹没。", severity: "medium" },
    { issue: "简历表达和面试表达主线可能还不够一致，容易让招聘方记不住你。", severity: "low" },
  ];
}

function buildGapAnalysis(roleProfile, assessmentResult) {
  const rankingMap = new Map(
    (assessmentResult.dimensionRanking ?? []).map((item) => [item.dimension, item]),
  );

  return roleProfile.gapDimensions.map((item) => {
    const matchedDimension = rankingMap.get(item.dimension);
    const average = matchedDimension?.average ?? 0;
    let currentStatus = "待积累";

    if (average >= 3.25) currentStatus = "已具备";
    else if (average >= 2.5) currentStatus = "部分具备";

    return {
      dimension: item.label ?? item.dimension,
      dimensionKey: item.dimension,
      description: item.description,
      currentStatus,
      average,
    };
  });
}

function buildBridgeSummary(role, assessmentResult, gapAnalysis, profile, template) {
  const keyStrengths = (assessmentResult.dimensionRanking ?? [])
    .slice(0, 2)
    .map((item) => item.label);
  const keyGaps = gapAnalysis
    .filter((item) => item.currentStatus !== "已具备")
    .slice(0, 2)
    .map((item) => item.dimension);
  const overseasHook = template.overseas?.[0]?.focus ?? "";

  return {
    fitLabel: assessmentResult.fitLabel,
    fitScore: assessmentResult.score,
    keyStrengths,
    keyGaps,
    summary: profile.targetCompany
      ? `这份报告承接刚完成的 ${role.name} 职业准备度评估。你当前目标是 ${profile.targetCompany} 的 ${role.name} 方向，现阶段判断为「${assessmentResult.fitLabel}」。已有优势主要集中在 ${keyStrengths.join("、") || "基础能力"}，下一步最该补的是 ${keyGaps.join("、") || "关键短板"}。这份报告会把“当前判断”进一步翻译成岗位要求拆解、差距分析、阶段规划以及更接近真实求职节奏的行动建议。`
      : `这份报告承接刚完成的 ${role.name} 职业准备度评估。你当前的岗位匹配判断为「${assessmentResult.fitLabel}」，已有优势主要集中在 ${keyStrengths.join("、") || "基础能力"}，下一步最该补的是 ${keyGaps.join("、") || "关键短板"}。接下来重点不是继续泛看信息，而是把这些差距补成能被招聘方看见的证据。`,
    bridgeNote: overseasHook
      ? `如果你后续考虑留学路径，也可以把 ${role.name} 所需能力映射到 ${overseasHook}`
      : "",
  };
}

function buildPhasePlan(role, template, bridgeSummary, profile) {
  if (template.phasePlan) {
    return template.phasePlan;
  }

  const primaryGap = bridgeSummary.keyGaps[0] ?? "关键短板";
  const secondaryGap = bridgeSummary.keyGaps[1] ?? primaryGap;
  const stageInternshipPlan = resolvePlanByResumeStage(template.internshipPlan, profile.resumeStage);

  return {
    sophomore: [
      { action: template.studyPlan[0] },
      { action: `围绕 ${role.name} 提前积累 1 个能体现「${primaryGap}」的课程项目、校园案例或研究输出。` },
      { action: "把课程、社团、比赛和项目里的经历统一整理成经历台账，为后续简历和面试做准备。" },
    ],
    junior: [
      { action: stageInternshipPlan[0] ?? template.studyPlan[1] },
      { action: `把「${primaryGap}」和「${secondaryGap}」补成至少 2 条可投递的主线案例，而不是只有兴趣表达。` },
      { action: "开始准备 2 到 3 个完整故事，确保简历、面试和目标岗位叙事一致。" },
    ],
    beforeGraduation: [
      {
        action: profile.targetCompany
          ? `围绕 ${profile.targetCompany} 或同类公司的招聘要求，集中打磨最强的 2 到 3 段经历。`
          : `围绕 ${role.name} 的核心招聘要求，集中打磨最强的 2 到 3 段经历。`,
      },
      { action: `在正式投递前，把「${primaryGap}」补到至少能支撑 1 个完整案例回答。` },
      { action: "把简历、案例表达和投递节奏统一成一条主线，减少信息噪音。" },
    ],
  };
}

function buildCurrentSemesterActions(role, template, bridgeSummary, profile) {
  if (template.currentSemesterActions) {
    return template.currentSemesterActions;
  }

  const primaryGap = bridgeSummary.keyGaps[0] ?? "关键短板";
  const secondaryGap = bridgeSummary.keyGaps[1] ?? primaryGap;
  const stageInternshipPlan = resolvePlanByResumeStage(template.internshipPlan, profile.resumeStage);

  return [
    {
      priority: "P0",
      action: `围绕 ${role.name} 补 1 个能直接体现「${primaryGap}」的项目或经历证据，并整理成简历条目。`,
    },
    {
      priority: "P0",
      action: profile.targetCompany
        ? `研究 ${profile.targetCompany} 或同类公司的 5 条 JD，把「${primaryGap}」对应的关键词补进现有材料。`
        : `研究 5 条 ${role.name} 岗位 JD，把「${primaryGap}」和「${secondaryGap}」拆成可执行补足项。`,
    },
    {
      priority: "P1",
      action: template.studyPlan[0],
    },
    {
      priority: "P1",
      action: stageInternshipPlan[0] ?? template.studyPlan[1],
    },
    {
      priority: "P2",
      action: `找 1 位 ${role.name} 从业者或学长学姐做岗位访谈，验证你对「${secondaryGap}」的判断是否准确。`,
    },
  ];
}

function buildNextActions(role, bridgeSummary, profile, template) {
  if (template.nextActions) {
    return template.nextActions;
  }

  const primaryGap = bridgeSummary.keyGaps[0] ?? "关键短板";
  const stageInternshipPlan = resolvePlanByResumeStage(template.internshipPlan, profile.resumeStage);

  return [
    {
      timeframe: "本周",
      action: `先把当前最能代表 ${role.name} 适配度的一段经历改写出来，重点突出「${primaryGap}」。`,
    },
    {
      timeframe: "2 周内",
      action: profile.targetCompany
        ? `补一个更贴近 ${profile.targetCompany} 招聘要求的项目、研究或实习证据。`
        : stageInternshipPlan[0] ?? `补一个最能证明 ${role.name} 适配度的项目或实习证据。`,
    },
    {
      timeframe: "4 周内",
      action: `把报告中的建议拆成执行清单，持续追踪「${primaryGap}」是否真的被补上。`,
    },
  ];
}

function buildOverseasPathSuggestions(template, role, profile) {
  return (template.overseas ?? []).map((item) => ({
    ...item,
    hook: profile.targetCompany
      ? `如果你后续考虑留学，这条路径更适合把能力补到 ${profile.targetCompany} 及同类公司看重的岗位标准。`
      : `如果你后续考虑留学，这条路径更适合把 ${role.name} 所需能力补成更系统的训练路径。`,
  }));
}

export function buildResumeDiagnosisReport({ profile, assessmentResult }) {
  const role = getRoleById(profile.targetRole);
  const template = getResultTemplate(profile.targetRole);
  const roleProfile = getRoleProfile(profile.targetRole);

  if (!role || !template || !roleProfile) {
    throw new Error(`Cannot build report for role: ${profile.targetRole}`);
  }

  const gapAnalysis = buildGapAnalysis(roleProfile, assessmentResult);
  const bridgeSummary = buildBridgeSummary(role, assessmentResult, gapAnalysis, profile, template);
  const stageInternshipPlan = resolvePlanByResumeStage(template.internshipPlan, profile.resumeStage);

  return {
    roleId: role.id,
    roleName: role.name,
    fitLabel: assessmentResult.fitLabel,
    bridgeSummary,
    currentResumeIssues: buildResumeIssues(profile),
    targetRoleRequirements: template.requirements.map((item) => ({
      category: item.category,
      requirement: item.requirement,
    })),
    gapAnalysis,
    phasePlan: buildPhasePlan(role, template, bridgeSummary, profile),
    currentSemesterActions: buildCurrentSemesterActions(role, template, bridgeSummary, profile),
    threeDimensionRoadmap: {
      academics: template.studyPlan.map((item) => ({ item, detail: "优先补岗位判断框架和方法论基础。" })),
      internships: stageInternshipPlan.map((item) => ({ item, detail: "优先补真实业务场景和招聘方可验证的经历证据。" })),
      skills: [
        ...template.hardSkills.map((item) => ({ item, detail: "这是招聘方快速判断你是否具备基本上手能力的硬门槛。" })),
        ...template.softSkills.map((item) => ({ item, detail: "这是决定你能否把事情推进下去、讲清楚、做稳定的关键能力。" })),
      ],
    },
    overseasPathSuggestions: buildOverseasPathSuggestions(template, role, profile),
    caseAnalysis: roleProfile.successCases,
    nextActions: buildNextActions(role, bridgeSummary, profile, template),
  };
}
