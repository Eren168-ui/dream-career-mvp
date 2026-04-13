import test from "node:test";
import assert from "node:assert/strict";

import { questionSets } from "../src/data/questionSets.js";
import { resultTemplates } from "../src/data/resultTemplates.js";
import { buildResumeDiagnosisReport } from "../src/lib/reporting.js";

const targetRoles = [
  "product-manager",
  "ai-algorithm-engineer",
  "strategy-consulting",
  "audit",
  "data-analyst",
];

test("targeted five roles use different question sets and result templates", () => {
  const promptSignatures = new Set(
    targetRoles.map((roleId) => {
      const questionSet = questionSets.find((item) => item.roleId === roleId);
      assert.ok(questionSet, `missing question set for ${roleId}`);
      return questionSet.questions.map((item) => item.prompt).join("|");
    }),
  );

  const templateSignatures = new Set(
    targetRoles.map((roleId) => {
      const template = resultTemplates[roleId];
      assert.ok(template, `missing result template for ${roleId}`);
      return [template.reality[0], template.studyPlan[0], template.hardSkills[0], template.closing].join("|");
    }),
  );

  assert.equal(promptSignatures.size, targetRoles.length);
  assert.equal(templateSignatures.size, targetRoles.length);
});

test("targeted five roles produce differentiated diagnosis reports", () => {
  const signatures = new Set();

  targetRoles.forEach((roleId) => {
    const report = buildResumeDiagnosisReport({
      profile: {
        targetRole: roleId,
        targetCompany: "目标公司",
        graduationYear: "2027",
        majorName: "测试专业",
        resumeStage: "draft_resume",
        careerStage: "clear_goal_no_action",
        educationLevel: "bachelor",
        studyRegion: "domestic",
      },
      assessmentResult: {
        roleId,
        roleName: roleId,
        score: 76,
        fitLabel: "潜力明显",
        dimensionRanking: [
          { dimension: "analysis", label: "分析判断", average: 3.5 },
          { dimension: "communication", label: "沟通协同", average: 3.0 },
          { dimension: "ownership", label: "主动推进", average: 2.0 },
          { dimension: "resilience", label: "抗压韧性", average: 2.25 },
        ],
      },
    });

    signatures.add([
      report.roleName,
      report.targetRoleRequirements[0].requirement,
      report.phasePlan.sophomore[0].action,
      report.currentSemesterActions[0].action,
      report.nextActions[0].action,
    ].join("|"));
  });

  assert.equal(signatures.size, targetRoles.length);
});
