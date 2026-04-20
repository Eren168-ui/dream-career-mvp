import { getRoleById } from "../data/roles.js";
import { getRoleProfile } from "../data/roleProfiles.js";
import { resolveRoleSelection } from "../data/roleSystem.js";
import { getOptionLabel } from "./display.js";
import { buildResumeDiagnosisReport } from "./reporting.js";

function buildBackgroundSummary(profile, roleName, assessmentResult) {
  return [
    {
      label: "当前背景",
      value: `${profile.majorName} / ${getOptionLabel("educationLevel", profile.educationLevel)} / ${getOptionLabel("graduationYear", profile.graduationYear)}`,
    },
    {
      label: "目标方向",
      value: `${roleName} · ${profile.targetCompany ? `${profile.targetCompany} / 同类平台` : "先确定岗位方向后再定投递清单"}`,
    },
    {
      label: "留学路径",
      value: `${getOptionLabel("overseasIntent", profile.overseasIntent)} · ${getOptionLabel("targetCountry", profile.targetCountry)}`,
    },
    {
      label: "当前准备度",
      value: `${getOptionLabel("currentGPA", profile.currentGPA)} · ${getOptionLabel("languageScore", profile.languageScore)}`,
    },
    {
      label: "申请节奏",
      value: getOptionLabel("applicationTimeline", profile.applicationTimeline),
    },
    {
      label: "当前判断",
      value: assessmentResult.fitLabel,
    },
  ];
}

function buildReversePathways(profile, roleName, assessmentResult, baseReport) {
  const keyGaps = baseReport.bridgeSummary.keyGaps;
  const keyStrengths = baseReport.bridgeSummary.keyStrengths;

  return [
    {
      title: `${roleName} 目标如何反推留学路径`,
      summary: profile.targetCompany
        ? `如果你想在毕业后进入 ${profile.targetCompany} 或同类公司的 ${roleName} 方向，留学选校选专业不能只看学校名气，而要优先看是否能补上岗位真正看重的能力证据。`
        : `如果你想通过留学切到 ${roleName} 方向，重点不是先选国家，而是先看哪条路径最能把岗位需要的能力补成可验证的项目、课程和实习经历。`,
      bullets: [
        `优先保留并放大你已经具备的优势：${keyStrengths.join("、") || "基础能力"}`,
        `留学期间最该补齐的能力短板：${keyGaps.join("、") || "岗位证据"}`,
        `专业选择要服务于未来求职叙事，而不是把留学和就业拆成两张皮。`,
      ],
    },
  ];
}

function buildCountryRecommendations(profile, assessmentResult, baseReport, roleName) {
  const overseasPaths =
    assessmentResult?.modules?.actionGuide?.overseas?.length > 0
      ? assessmentResult.modules.actionGuide.overseas
      : baseReport.overseasPathSuggestions;

  if (profile.targetCountry === "domestic") {
    return [
      {
        title: "国内升学路径",
        recommendedMajors: `优先选择与 ${roleName} 目标一致的专业方向，如信息系统、商业分析、管理科学、传播 / 营销、计算机交叉专业等。`,
        targetSchools: "优先看目标院校的课程结构、导师资源、项目实践和校招衔接，而不是只看综合排名。",
        fitFor: "想通过国内研究生阶段补课程深度、项目密度，同时保持更顺畅的国内实习与秋招节奏的人。",
        preWork: "申请前先补专业课成绩、相关项目和一段能支撑职业目标的实习经历。",
        advantage: "与国内实习、校招和行业信息连接更紧，后续转化到求职动作的成本更低。",
      },
      ...overseasPaths.slice(0, 1).map((item) => ({
        title: `对照参考：${item.path}`,
        recommendedMajors: item.focus,
        targetSchools: item.schools,
        fitFor: item.suitableFor,
        preWork: item.nextStep ?? item.condition,
        advantage: item.advantage,
      })),
    ];
  }

  return overseasPaths.map((item) => ({
    title: item.path,
    recommendedMajors: item.focus,
    targetSchools: item.schools,
    fitFor: item.suitableFor,
    preWork: item.nextStep ?? item.condition,
    advantage: item.advantage,
  }));
}

function buildTimelinePlan(profile, roleName, baseReport) {
  const timelineLabel = getOptionLabel("applicationTimeline", profile.applicationTimeline);
  const semesterActions = baseReport.currentSemesterActions.slice(0, 3).map((item) => item.action);
  const nextActions = baseReport.nextActions.slice(0, 3).map((item) => item.action);

  return [
    {
      stage: "当前阶段",
      goal: `${timelineLabel}，先把申请与就业主线统一起来。`,
      actions: [
        `确认 ${roleName} 方向是否仍是主目标，并把专业选择和岗位能力一一对应。`,
        ...semesterActions,
      ],
    },
    {
      stage: "申请前 3-6 个月",
      goal: "补足能支撑申请和未来求职的课程、项目与语言材料。",
      actions: [
        `围绕 ${roleName} 整理 2-3 段最能体现匹配度的项目或实习证据。`,
        `把 GPA、语言成绩和项目证明同步推进，避免只顾标化、不补经历。`,
        ...baseReport.phasePlan.junior.slice(0, 2).map((item) => item.action),
      ],
    },
    {
      stage: "拿到 offer 后到申请季结束",
      goal: "让留学结果和最终求职方向形成闭环。",
      actions: [
        ...nextActions,
        `根据目标国家和项目课程，提前规划读书期间的实习窗口与回国校招节奏。`,
      ],
    },
  ];
}

function buildNextSteps(profile, roleName, baseReport) {
  return [
    {
      title: "先定主线",
      detail: `把“为什么是 ${roleName}”和“为什么选这条留学路径”讲成一条一致叙事。`,
    },
    {
      title: "补关键证据",
      detail: `优先补 ${baseReport.bridgeSummary.keyGaps.join("、") || "岗位关键能力"}，不要只堆课程和证书。`,
    },
    {
      title: "同步准备申请与求职",
      detail: profile.targetCountry === "domestic"
        ? "国内升学也要提前布局项目和实习，不要把读研当成延后就业判断的缓冲区。"
        : "语言、GPA、项目和实习要并行准备，避免只完成申请材料却没有就业竞争力。",
    },
    {
      title: "提前看案例",
      detail: `优先参考与 ${roleName} 方向匹配的留学申请案例和回国求职路径，而不是泛看院校榜单。`,
    },
  ];
}

export function buildStudyAbroadReport({ profile, assessmentResult }) {
  const selection = resolveRoleSelection(profile);
  const templateRoleId = selection.templateRoleId || profile.targetRole;
  const role = getRoleById(templateRoleId);
  const roleProfile = getRoleProfile(templateRoleId);
  const baseReport = buildResumeDiagnosisReport({ profile, assessmentResult });
  const roleDisplayName = selection.displayName || role?.name || templateRoleId;

  if (!role || !roleProfile) {
    throw new Error(`Cannot build study abroad report for role: ${templateRoleId}`);
  }

  return {
    entryLabel: "留学/升学定向简历规划",
    roleId: role.id,
    roleName: roleDisplayName,
    baseReport,
    backgroundSummary: buildBackgroundSummary(profile, roleDisplayName, assessmentResult),
    reversePathways: buildReversePathways(profile, roleDisplayName, assessmentResult, baseReport),
    countryRecommendations: buildCountryRecommendations(profile, assessmentResult, baseReport, roleDisplayName),
    timelinePlan: buildTimelinePlan(profile, roleDisplayName, baseReport),
    studyAbroadCaseAnalysis: roleProfile.studyAbroadSuccessCases,
    nextSteps: buildNextSteps(profile, roleDisplayName, baseReport),
  };
}
