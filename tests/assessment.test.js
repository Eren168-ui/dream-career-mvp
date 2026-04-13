import test from "node:test";
import assert from "node:assert/strict";

import { buildAssessmentResult, getQuestionSetForRole } from "../src/lib/assessment.js";
import { getRoleProfile } from "../src/data/roleProfiles.js";

test("getQuestionSetForRole returns role-specific questions", () => {
  const productManagerSet = getQuestionSetForRole("product-manager");
  const strategyConsultingSet = getQuestionSetForRole("strategy-consulting");

  assert.equal(productManagerSet.roleId, "product-manager");
  assert.equal(strategyConsultingSet.roleId, "strategy-consulting");
  assert.notEqual(productManagerSet.id, strategyConsultingSet.id);
  assert.ok(productManagerSet.questions.length >= 4);
  assert.ok(strategyConsultingSet.questions.length >= 4);
});

test("role profiles align with active role ids and expose market metadata", () => {
  const profile = getRoleProfile("ai-algorithm-engineer");

  assert.equal(profile.name, "AI算法工程师");
  assert.ok(profile.topCompanies.length >= 3);
  assert.ok(profile.gapDimensions.length >= 3);
  assert.ok(profile.successCases.length >= 1);
});

test("buildAssessmentResult returns reusable modules and role-specific metadata", () => {
  const result = buildAssessmentResult({
    profile: {
      targetRole: "product-manager",
      targetCompany: "字节跳动",
      graduationYear: "2028",
      majorName: "工商管理",
      resumeStage: "no_resume",
      careerStage: "lost",
      educationLevel: "bachelor",
      studyRegion: "domestic",
    },
    answers: {
      "pm-1": "often",
      "pm-2": "often",
      "pm-3": "sometimes",
      "pm-4": "often",
    },
  });

  assert.equal(result.roleId, "product-manager");
  assert.equal(result.fitScore, result.score);
  assert.equal(result.modules.selfAwareness.title, "自我认知");
  assert.ok(result.modules.selfAwareness.summary.length > 0);
  assert.ok(result.modules.selfAwareness.highlights.length >= 3);
  assert.ok(result.modules.selfAwareness.strengths.length > 0);
  assert.ok(result.modules.selfAwareness.blindSpots.length > 0);
  assert.equal(result.modules.marketReality.title, "外界认知");
  assert.ok(result.modules.marketReality.topCompanies.length > 0);
  assert.ok(result.modules.marketReality.requirements.length > 0);
  assert.equal(result.modules.actionGuide.title, "行动指引");
  assert.ok(result.modules.actionGuide.studyPlan.length > 0);
  assert.ok(result.modules.actionGuide.internshipPlan.length > 0);
  assert.ok(result.modules.actionGuide.skillPlan.hardSkills.length > 0);
  assert.ok(result.modules.actionGuide.skillPlan.softSkills.length > 0);
  assert.ok(result.modules.actionGuide.nextSteps.length > 0);
  assert.equal(result.modules.closingMessage.title, "结尾寄语");
  assert.ok(result.modules.closingMessage.content.length > 0);
});

test("buildAssessmentResult differentiates role outputs beyond the title", () => {
  const commonProfile = {
    graduationYear: "2027",
    majorName: "统计学",
    resumeStage: "draft_resume",
    careerStage: "clear_goal_no_action",
    educationLevel: "master",
    studyRegion: "domestic",
  };

  const productManager = buildAssessmentResult({
    profile: {
      ...commonProfile,
      targetRole: "product-manager",
      targetCompany: "腾讯",
    },
    answers: {
      "pm-1": "often",
      "pm-2": "often",
      "pm-3": "often",
      "pm-4": "sometimes",
    },
  });

  const dataAnalyst = buildAssessmentResult({
    profile: {
      ...commonProfile,
      targetRole: "data-analyst",
      targetCompany: "字节跳动",
    },
    answers: {
      "da-1": "often",
      "da-2": "often",
      "da-3": "often",
      "da-4": "sometimes",
    },
  });

  assert.notDeepEqual(productManager.modules.marketReality.topCompanies, dataAnalyst.modules.marketReality.topCompanies);
  assert.notEqual(productManager.modules.actionGuide.studyPlan[0], dataAnalyst.modules.actionGuide.studyPlan[0]);
  assert.notEqual(productManager.modules.closingMessage.content, dataAnalyst.modules.closingMessage.content);
});
