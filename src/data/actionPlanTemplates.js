import { getContextualActionPlan, getRoleConfig } from "./roleConfig.js";

const YEAR_CONTEXT = {
  "2029": { window: "充裕", phase: "探索期" },
  "2028": { window: "适中", phase: "积累期" },
  "2027": { window: "紧凑", phase: "冲刺期" },
  "2026": { window: "紧迫", phase: "决战期" },
  graduated: { window: "转型", phase: "转型期" },
  other: { window: "待定", phase: "探索期" },
};

const RESUME_URGENCY = {
  no_resume: { urgencyLabel: "⚡ 高优先级", badge: "简历空白" },
  draft_resume: { urgencyLabel: "📝 中优先级", badge: "需要打磨" },
  applied_resume: { urgencyLabel: "✅ 优化提升", badge: "持续迭代" },
};

export function buildActionPlan(roleId, profile, assessmentScore = 60) {
  const config = getRoleConfig(roleId);
  const contextualPlan = getContextualActionPlan(roleId, profile);

  if (!config || !contextualPlan) {
    return null;
  }

  const template = config.resultTemplate.actionGuide;
  const yearContext = YEAR_CONTEXT[profile.graduationYear] ?? YEAR_CONTEXT.other;
  const resumeMeta = RESUME_URGENCY[profile.resumeStage] ?? RESUME_URGENCY.no_resume;
  const scoreTag = assessmentScore >= 75 ? "匹配度较高" : assessmentScore >= 55 ? "潜力明显" : "需要补足";

  return {
    roleId,
    roleName: config.name,
    urgencyLabel: resumeMeta.urgencyLabel,
    urgencyBadge: resumeMeta.badge,
    contextSummary: `你当前对 ${config.name} 的判断为「${scoreTag}」，所处时间窗口属于${yearContext.phase}（${yearContext.window}）。`,
    educationEdge: "优先把学历背景转成岗位能识别的课程、项目和研究证据。",
    educationTarget: "目标不是堆经历，而是补关键证据并形成清晰主线。",
    regionTip: profile.studyRegion === "overseas" ? "提前对齐国内招聘时间线和回国实习节奏。" : "优先争取一线城市或目标行业聚集地的实习机会。",
    coreTask: contextualPlan.byCareerStage.coreTask ?? "先明确差距，再按优先级补齐。",
    nextStep: contextualPlan.byCareerStage.nextStep ?? contextualPlan.byCareerStage.firstStep,
    studyPlan: [...contextualPlan.byYear.studyPlan, ...template.studyPlan].slice(0, 4),
    internshipPlan: [...contextualPlan.byYear.internshipPlan, ...template.internshipPlan].slice(0, 4),
    hardSkills: template.skillPlan.hardSkills,
    softSkills: template.skillPlan.softSkills,
    immediateAction: contextualPlan.byResumeStage.immediateAction,
    firstQuestion: contextualPlan.byCareerStage.keyQuestion,
    threeSemesterRoadmap: {
      now: {
        label: "当前学期",
        tasks: [contextualPlan.byCareerStage.firstStep, template.studyPlan[0]],
      },
      next: {
        label: "下一阶段",
        tasks: [template.internshipPlan[0], template.studyPlan[1] ?? template.studyPlan[0]],
      },
      final: {
        label: "求职阶段",
        tasks: ["形成岗位主线简历", "完成至少 2 次面试或简历评审复盘"],
      },
    },
    yearContext,
  };
}
