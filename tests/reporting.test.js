import test from "node:test";
import assert from "node:assert/strict";

import { buildResumeDiagnosisReport } from "../src/lib/reporting.js";

test("buildResumeDiagnosisReport contains all MVP sections", () => {
  const report = buildResumeDiagnosisReport({
    profile: {
      targetRole: "strategy-consulting",
      targetCompany: "贝恩咨询",
      graduationYear: "2027",
      majorName: "经济学",
      resumeStage: "applied_resume",
      careerStage: "direction_no_target",
      educationLevel: "bachelor",
      studyRegion: "domestic",
    },
    assessmentResult: {
      roleId: "strategy-consulting",
      roleName: "战略咨询",
      score: 74,
      fitLabel: "潜力明显",
      dimensionRanking: [
        { dimension: "structure", label: "结构化思考", average: 3.5 },
        { dimension: "analysis", label: "分析判断", average: 3.25 },
        { dimension: "communication", label: "沟通协同", average: 2.5 },
        { dimension: "resilience", label: "抗压韧性", average: 2.25 },
      ],
    },
  });

  assert.ok(report.currentResumeIssues.length > 0);
  assert.ok(report.targetRoleRequirements.length > 0);
  assert.ok(report.gapAnalysis.length > 0);
  assert.ok(report.phasePlan.sophomore.length > 0);
  assert.ok(report.phasePlan.junior.length > 0);
  assert.ok(report.phasePlan.beforeGraduation.length > 0);
  assert.ok(report.currentSemesterActions.length > 0);
  assert.ok(report.threeDimensionRoadmap.academics.length > 0);
  assert.ok(report.threeDimensionRoadmap.internships.length > 0);
  assert.ok(report.threeDimensionRoadmap.skills.length > 0);
  assert.ok(report.overseasPathSuggestions.length > 0);
  assert.ok(report.caseAnalysis.length > 0);
  assert.ok(report.nextActions.length > 0);
  assert.equal(typeof report.currentResumeIssues[0].issue, "string");
  assert.match(report.currentResumeIssues[0].severity, /high|medium|low/);
  assert.equal(typeof report.targetRoleRequirements[0].requirement, "string");
  assert.equal(typeof report.gapAnalysis[0].dimension, "string");
  assert.match(report.gapAnalysis[0].currentStatus, /已具备|部分具备|待积累/);
  assert.equal(typeof report.currentSemesterActions[0].action, "string");
  assert.match(report.currentSemesterActions[0].priority, /P0|P1|P2/);
  assert.equal(typeof report.nextActions[0].action, "string");
  assert.ok(report.nextActions[0].timeframe);
  assert.ok(report.bridgeSummary.summary.includes("战略咨询"));
  assert.equal(report.bridgeSummary.fitLabel, "潜力明显");
  assert.ok(report.bridgeSummary.keyGaps.length > 0);
});

test("buildResumeDiagnosisReport differentiates targeted role outputs", () => {
  const commonAssessment = {
    score: 78,
    fitLabel: "潜力明显",
    dimensionRanking: [
      { dimension: "analysis", label: "分析判断", average: 3.5 },
      { dimension: "communication", label: "沟通协同", average: 3.0 },
      { dimension: "ownership", label: "主动推进", average: 2.0 },
      { dimension: "resilience", label: "抗压韧性", average: 2.25 },
    ],
  };

  const productManager = buildResumeDiagnosisReport({
    profile: {
      targetRole: "product-manager",
      targetCompany: "腾讯",
      graduationYear: "2028",
      majorName: "信息管理与信息系统",
      resumeStage: "draft_resume",
      careerStage: "clear_goal_no_action",
      educationLevel: "bachelor",
      studyRegion: "domestic",
    },
    assessmentResult: {
      ...commonAssessment,
      roleId: "product-manager",
      roleName: "产品经理",
    },
  });

  const aiEngineer = buildResumeDiagnosisReport({
    profile: {
      targetRole: "ai-algorithm-engineer",
      targetCompany: "百度",
      graduationYear: "2027",
      majorName: "人工智能",
      resumeStage: "draft_resume",
      careerStage: "clear_goal_no_action",
      educationLevel: "master",
      studyRegion: "domestic",
    },
    assessmentResult: {
      ...commonAssessment,
      roleId: "ai-algorithm-engineer",
      roleName: "AI算法工程师",
    },
  });

  assert.notDeepEqual(productManager.targetRoleRequirements, aiEngineer.targetRoleRequirements);
  assert.notDeepEqual(productManager.phasePlan.sophomore, aiEngineer.phasePlan.sophomore);
  assert.notDeepEqual(productManager.currentSemesterActions, aiEngineer.currentSemesterActions);
  assert.notDeepEqual(productManager.nextActions, aiEngineer.nextActions);
});
