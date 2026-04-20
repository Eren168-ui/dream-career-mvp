import { getRoleById } from "../data/roles.js";
import { getResultTemplate } from "../data/resultTemplates.js";
import { getRoleProfile } from "../data/roleProfiles.js";
import { resolveRoleSelection } from "../data/roleSystem.js";

function resolvePlanByResumeStage(plan, resumeStage) {
  if (Array.isArray(plan)) {
    return plan;
  }

  if (plan && typeof plan === "object") {
    return plan[resumeStage] ?? plan.default ?? [];
  }

  return [];
}

const YEAR_CONTEXT = {
  "2029": { window: "充裕", phase: "探索期" },
  "2028": { window: "适中", phase: "积累期" },
  "2027": { window: "紧凑", phase: "冲刺期" },
  "2026": { window: "紧迫", phase: "决战期" },
  graduated: { window: "转型", phase: "转型期" },
  other: { window: "待定", phase: "探索期" },
};

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

function buildTimelineContext(role, profile, bridgeSummary, template) {
  const yearContext = YEAR_CONTEXT[profile.graduationYear] ?? YEAR_CONTEXT.other;
  const primaryGap = bridgeSummary.keyGaps[0] ?? "关键短板";
  const studyLead = template.studyPlan[0] ?? `先围绕 ${role.name} 补方法论和基础判断。`;
  const internshipLead = resolvePlanByResumeStage(template.internshipPlan, profile.resumeStage)[0]
    ?? `优先补一段更贴近 ${role.name} 的真实项目或实习证据。`;

  return {
    yearContext,
    summary: `你当前处于${yearContext.phase}（时间窗口${yearContext.window}）。这意味着你现在最重要的，不是同时铺很多低质量尝试，而是先把「${primaryGap}」补成岗位证据，再把课程、项目和实习整理成一条清晰主线。`,
    currentFocus: `本学期优先做两件事：第一，${studyLead} 第二，${internshipLead}`,
  };
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
    careerLinkage: `为什么 ${role.name} 这个职业目标会影响留学方向选择：${role.name} 岗位在国内校招里越来越看重系统方法论和真实项目证据，而留学读到对口方向的硕士，既能把薄弱的方法论基础补扎实，又能在当地实习中积累国际化案例。`,
    hook: profile.targetCompany
      ? `留学结束后回国求职，如果目标还是 ${profile.targetCompany} 及同类公司的 ${role.name} 方向，重点不是学历背书，而是留学期间是否补齐了「岗位方法论 + 可讲案例 + 对口实习」三件事。`
      : `留学不是为了提升学历光环，而是为了系统补上 ${role.name} 所需要的方法论训练和真实项目证据。回国后能不能讲清楚"我在哪里学的、学到了什么、怎么用在这个岗位上"，才是留学真正的价值。`,
  }));
}

function buildStageAccumulationTargets(role, profile, bridgeSummary, template) {
  const primaryGap = bridgeSummary.keyGaps[0] ?? "岗位核心能力";
  const secondaryGap = bridgeSummary.keyGaps[1] ?? "实战证据";
  const stageInternshipPlan = resolvePlanByResumeStage(template.internshipPlan, profile.resumeStage);
  const internshipLead = stageInternshipPlan[0] ?? `争取 1 段 ${role.name} 方向的真实实习机会`;

  if (profile.graduationYear === "2029") {
    return {
      currentStageName: "大一",
      currentStageGoal: "方向探索 + 基础认知",
      currentPriority: [
        `把 ${role.name} 的真实工作内容和招聘门槛摸清楚——读 5 条以上真实 JD，整理出高频硬技能关键词和软能力要求各 3 条。`,
        "在课程里找 1 个能练习「问题分析 → 方案设计 → 结果复盘」完整链路的项目，哪怕是课程作业，做完后整理成三段式记录。",
        `${template.studyPlan[0] ?? `先补 ${role.name} 最基础的方法论课程，不要只看视频，要动手输出。`}`,
      ],
      nextStageName: "大二",
      nextStageGoal: "补第一段有岗位相关性的经历",
      nextStagePriority: [
        `用校园项目或研究机会，产出 1 个能体现「${primaryGap}」的具体成果，用"做了什么 + 产生了什么变化"来表达。`,
        "把所有经历都建立「经历台账」，格式：项目名称 / 时间 / 背景 / 我做了什么 / 结果是什么。",
        internshipLead,
      ],
      longTermGoal: `大三前手上要有至少 1 段可以讲 3 分钟的「${role.name} 相关经历」，包含清晰背景、具体动作和可验证结果。`,
    };
  }

  if (profile.graduationYear === "2028") {
    return {
      currentStageName: "大二",
      currentStageGoal: "补第一段岗位相关经历 + 进入实习前的积累期",
      currentPriority: [
        `这学期最重要的一件事：把「${primaryGap}」从"有了解"变成"有经历"——找 1 个校园项目、研究或实践机会，产出可讲述的结果。`,
        internshipLead,
        `${template.studyPlan[0] ?? `补 ${role.name} 最核心的方法论课程或工具使用能力，学完后能用这个工具解决一个真实问题。`}`,
      ],
      nextStageName: "大三",
      nextStageGoal: "实习突破 + 主线案例成型",
      nextStagePriority: [
        `拿到 1 段 ${role.name} 方向或强相关方向的真实公司实习，在实习中产出 1 个有具体数据或结果的项目复盘。`,
        `把「${primaryGap}」和「${secondaryGap}」都从"有接触"变成"有完整案例可讲"。`,
        `把大二的零散经历整理成一条主线简历，检查每条经历是否都有「为什么做 + 做了什么 + 产生了什么」。`,
      ],
      longTermGoal: `大三结束前手上要有至少 2 段完整经历，覆盖「${primaryGap}」，且至少 1 段来自真实公司或真实业务场景。`,
    };
  }

  if (profile.graduationYear === "2027") {
    return {
      currentStageName: "大三",
      currentStageGoal: "实习冲刺 + 主线案例打磨",
      currentPriority: [
        `当前最紧迫的两件事：补 1 段以上实习，并把「${primaryGap}」写成至少 1 条有数字、有结果、能撑住 2 分钟追问的完整简历经历。`,
        profile.targetCompany
          ? `研究 ${profile.targetCompany} 近期 ${role.name} 方向的 JD，把简历里最强的 2 段经历改成能精准对上 JD 关键词的表达。`
          : `把手上最强的 2 段经历改成「背景 + 动作 + 量化结果」的格式，去掉所有只说"做了什么"但没说"为什么重要"的表述。`,
        internshipLead,
      ],
      nextStageName: "大四 / 秋招冲刺",
      nextStageGoal: "最终版简历 + 面试全流程准备",
      nextStagePriority: [
        profile.targetCompany
          ? `投递前把所有材料对齐 ${profile.targetCompany} 招聘要求，最强经历必须出现在简历前 1/3。`
          : `投递前完成简历最终版：最强经历前置、关键词覆盖、所有结果都有量化表达。`,
        `把「${primaryGap}」补到可以支撑 2-3 个不同场景的案例回答，而不是只背一个故事应付所有问题。`,
        "把简历表达、面试故事和自我介绍整合成一条主线，每次讲出来逻辑一致不打架。",
      ],
      longTermGoal: `秋招前手上要有 3-5 段可互相配合的经历，覆盖「${primaryGap}」和「${secondaryGap}」，至少 1 段来自真实公司。`,
    };
  }

  if (profile.graduationYear === "2026") {
    return {
      currentStageName: "大四 / 求职冲刺",
      currentStageGoal: "投递转化率最大化",
      currentPriority: [
        "当前不是继续积累新经历的时机，而是把已有经历改成招聘方能快速看懂并记住的表达方式。",
        profile.targetCompany
          ? `专门优化 ${profile.targetCompany} 的投递版本：按 JD 关键词顺序重排经历，确保前 30 秒扫完就能判断相关性。`
          : `重写简历里最弱的 2 段经历，用「背景 + 问题 + 我做了什么 + 结果」结构替换所有只列职责的内容。`,
        `只补 4-6 周内能落纸成证据的东西，不要投入周期超过 1 个月的新积累。`,
      ],
      nextStageName: "入职过渡期",
      nextStageGoal: "从候选人状态快速切换到从业者状态",
      nextStagePriority: [
        `入职前系统了解目标公司的业务逻辑、核心 KPI 和 ${role.name} 在公司内部的定位。`,
        `补足 ${role.name} 入门所需的工具和流程使用能力，确保第一周能快速上手不问太多基础问题。`,
        "找 1-2 位已在相关岗位工作的前辈做一次信息访谈，了解真实日常状态和入职后的成长节点。",
      ],
      longTermGoal: "入职后第一个月，专注建立信任和理解业务，不急着证明自己——先理解再行动，比急于表现更重要。",
    };
  }

  return {
    currentStageName: "求职中",
    currentStageGoal: "提升投递转化率",
    currentPriority: [
      "把已有经历改成招聘方能快速理解的表达，优先于继续积累新东西。",
      `研究 10 条以上目标岗位 JD，拆出关键词，逐一对比自己哪些有证据、哪些是空话。`,
      "重写简历里最弱的 2 段，用结果导向的表达替换所有职责描述。",
    ],
    nextStageName: "入职后",
    nextStageGoal: "从求职者切换到从业者",
    nextStagePriority: [
      "入职第一个月：每周用「问题-动作-结果」记录工作内容，这些是下一份简历的原材料。",
      "3 个月内：争取 1 个可量化的小型改善项目，让自己的贡献变得可见。",
      "6 个月内：整理出 2-3 个可以直接讲给下一家公司听的完整案例。",
    ],
    longTermGoal: "每 6 个月做一次自检：我现在能讲什么新案例？不要等到下次求职时才发现什么都讲不出来。",
  };
}

function buildDetailedActionPlan(role, profile, bridgeSummary, template) {
  const primaryGap = bridgeSummary.keyGaps[0] ?? "岗位核心能力";
  const secondaryGap = bridgeSummary.keyGaps[1] ?? "实战证据";
  const stageInternshipPlan = resolvePlanByResumeStage(template.internshipPlan, profile.resumeStage);
  const internshipAction = stageInternshipPlan[0] ?? `找 1 段 ${role.name} 方向实习机会并投递`;

  return {
    thirtyDays: [
      {
        action: "整理现有所有经历，每一条用「背景 + 我做了什么 + 产生了什么结果」三段式写下来，先不管写得好不好，把台账建起来。",
        why: "不清楚自己有什么，是简历写不好的第一大原因。台账建好之后，才能判断缺什么。",
      },
      {
        action: profile.targetCompany
          ? `找 5 条 ${profile.targetCompany} 近期 ${role.name} 方向的 JD，标出高频关键词，和台账里的经历逐条对比缺口在哪。`
          : `找 5 条 ${role.name} 方向的 JD，整理出 10 个高频关键词，和台账经历做对比，找出最大的 2-3 个缺口。`,
        why: "知道差在哪，才能补对地方。很多人补了半年，补的都不是招聘方真正缺的。",
      },
      {
        action: `找 1 位 ${role.name} 从业者（校友、前辈或 LinkedIn 陌生人）做 1 次 30 分钟的信息访谈，重点问：入行门槛是什么，哪类经历被看重，简历里什么话你们其实不信。`,
        why: "信息差是最贵的成本。一次信息访谈，能省掉半年走错方向的时间。",
      },
    ],
    oneSemester: [
      {
        action: `产出 1 个能直接体现「${primaryGap}」的项目/实习/研究，用三段式整理成简历条目和面试故事。`,
        milestone: `完成后，简历里要新增至少 1 条有具体场景、有实际动作、有可验证结果的「${primaryGap}」经历。`,
      },
      {
        action: internshipAction,
        milestone: "至少提交 3 次以上的实习申请，建立主动找机会的节奏，不管结果，先让自己进入投递-反馈-调整的循环。",
      },
      {
        action: template.studyPlan[0] ?? `系统学完 1 门和「${primaryGap}」最相关的课程或技能训练，学完后用实际案例验证是否真的学进去了。`,
        milestone: `学完之后能用这门课的方法论分析 1 个 ${role.name} 方向的真实业务场景，不只是复述知识点。`,
      },
    ],
    oneYear: [
      {
        action: `形成 2-3 段可互相配合的完整经历，覆盖「${primaryGap}」和「${secondaryGap}」，至少 1 段来自真实公司或真实业务场景。`,
        milestone: profile.targetCompany
          ? `投递 ${profile.targetCompany} 时，不再有"简历没东西可写"的感觉。`
          : `投递 ${role.name} 方向时，简历里每一段经历都能找到对应的 JD 关键词支撑。`,
      },
      {
        action: "把简历、面试表达和自我介绍整合成一条一致的主线，每次讲出来逻辑相同，细节可以调整但核心不打架。",
        milestone: "能在 3 分钟内讲清楚「我是谁 → 我能做什么 → 为什么适合这个岗位」，不靠背稿，能随场景调整。",
      },
      {
        action: profile.targetCompany
          ? `完成至少 1 次 ${profile.targetCompany} 或同类公司的正式投递，拿到真实面试反馈。`
          : `完成至少 3-5 次正式的 ${role.name} 方向面试投递，用真实反馈来修正简历和表达。`,
        milestone: "面试反馈会告诉你还差什么，比自己猜要准确 10 倍。一次真实面试，顶 3 个月自己摸索。",
      },
    ],
  };
}

export function buildResumeDiagnosisReport({ profile, assessmentResult }) {
  const selection = resolveRoleSelection(profile);
  const templateRoleId = selection.templateRoleId || profile.targetRole;
  const role = getRoleById(templateRoleId);
  const template = getResultTemplate(templateRoleId);
  const roleProfile = getRoleProfile(templateRoleId);
  const roleDisplayName = selection.displayName || role?.name || templateRoleId;

  if (!role || !template || !roleProfile) {
    throw new Error(`Cannot build report for role: ${templateRoleId}`);
  }

  const gapAnalysis = buildGapAnalysis(roleProfile, assessmentResult);
  const displayRole = { ...role, name: roleDisplayName };
  const bridgeSummaryData = buildBridgeSummary(displayRole, assessmentResult, gapAnalysis, profile, template);
  const stageInternshipPlan = resolvePlanByResumeStage(template.internshipPlan, profile.resumeStage);

  return {
    roleId: role.id,
    roleName: roleDisplayName,
    fitLabel: assessmentResult.fitLabel,
    bridgeSummary: bridgeSummaryData,
    timelineContext: buildTimelineContext(displayRole, profile, bridgeSummaryData, template),
    currentResumeIssues: buildResumeIssues(profile),
    targetRoleRequirements: template.requirements.map((item) => ({
      category: item.category,
      requirement: item.requirement,
    })),
    gapAnalysis,
    phasePlan: buildPhasePlan(displayRole, template, bridgeSummaryData, profile),
    currentSemesterActions: buildCurrentSemesterActions(displayRole, template, bridgeSummaryData, profile),
    stageAccumulationTargets: buildStageAccumulationTargets(displayRole, profile, bridgeSummaryData, template),
    detailedActionPlan: buildDetailedActionPlan(displayRole, profile, bridgeSummaryData, template),
    threeDimensionRoadmap: {
      academics: template.studyPlan.map((item) => ({ item, detail: "优先补岗位判断框架和方法论基础。" })),
      internships: stageInternshipPlan.map((item) => ({ item, detail: "优先补真实业务场景和招聘方可验证的经历证据。" })),
      skills: [
        ...template.hardSkills.map((item) => ({ item, detail: "这是招聘方快速判断你是否具备基本上手能力的硬门槛。" })),
        ...template.softSkills.map((item) => ({ item, detail: "这是决定你能否把事情推进下去、讲清楚、做稳定的关键能力。" })),
      ],
    },
    overseasPathSuggestions: buildOverseasPathSuggestions(template, displayRole, profile),
    caseAnalysis: roleProfile.successCases,
    nextActions: buildNextActions(displayRole, bridgeSummaryData, profile, template),
  };
}
