import test from "node:test";
import assert from "node:assert/strict";

import { buildAssessmentResult, getQuestionSetForRole } from "../src/lib/assessment.js";
import { getRoleProfile } from "../src/data/roleProfiles.js";
import { getActiveAssessmentResult } from "../src/services/mockDatabase.js";
import { writeJson, writeText } from "../src/services/storage.js";

const STORAGE_KEYS = {
  userProfiles: "dream-career:user_profiles",
  answerRecords: "dream-career:answer_records",
  assessmentResults: "dream-career:assessment_results",
  activeProfileId: "dream-career:active_profile_id",
  activeAssessmentId: "dream-career:active_assessment_id",
};

function resetAssessmentStorage() {
  writeJson(STORAGE_KEYS.userProfiles, []);
  writeJson(STORAGE_KEYS.answerRecords, []);
  writeJson(STORAGE_KEYS.assessmentResults, []);
  writeText(STORAGE_KEYS.activeProfileId, "");
  writeText(STORAGE_KEYS.activeAssessmentId, "");
}

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

test("product-manager self-awareness labels stay natural and every insight card has explanation", () => {
  const profile = {
    targetRole: "product-manager",
    targetCompany: "字节跳动",
    graduationYear: "2027",
    majorName: "信息管理与信息系统",
    resumeStage: "draft_resume",
    careerStage: "clear_goal_no_action",
    educationLevel: "bachelor",
    studyRegion: "overseas",
  };

  const answers = Object.fromEntries(
    getQuestionSetForRole("product-manager").questions.map((item) => [item.id, "often"]),
  );

  const result = buildAssessmentResult({ profile, answers });

  assert.deepEqual(
    result.dimensionRanking.map((item) => item.label),
    ["理解用户", "拆清需求", "协同推进", "数据复盘"],
  );

  result.modules.selfAwareness.strengthCards.forEach((item) => {
    assert.ok(typeof item.explanation === "string" && item.explanation.trim().length > 0);
  });

  result.modules.selfAwareness.growthCards.forEach((item) => {
    assert.ok(typeof item.explanation === "string" && item.explanation.trim().length > 0);
  });
});

test("getActiveAssessmentResult upgrades legacy cached results with overseas action guide data", () => {
  resetAssessmentStorage();

  const profile = {
    id: "profile-legacy-pm",
    targetRole: "product-manager",
    targetCompany: "字节跳动",
    graduationYear: "2027",
    majorName: "工商管理",
    resumeStage: "draft_resume",
    careerStage: "clear_goal_no_action",
    educationLevel: "bachelor",
    studyRegion: "overseas",
  };

  const answers = {
    "pm-1": "often",
    "pm-2": "often",
    "pm-3": "sometimes",
    "pm-4": "often",
  };

  const freshResult = buildAssessmentResult({ profile, answers });
  const legacyResult = {
    id: "assessment-legacy-pm",
    profileId: profile.id,
    answerRecordId: "answers-legacy-pm",
    createdAt: "2026-04-13T12:00:00.000Z",
    ...freshResult,
    modules: {
      ...freshResult.modules,
      actionGuide: {
        ...freshResult.modules.actionGuide,
      },
    },
  };

  delete legacyResult.modules.actionGuide.overseas;
  delete legacyResult.modules.actionGuide.overseasHooks;

  writeJson(STORAGE_KEYS.userProfiles, [profile]);
  writeJson(STORAGE_KEYS.answerRecords, [{
    id: legacyResult.answerRecordId,
    profileId: profile.id,
    roleId: profile.targetRole,
    answers,
    createdAt: "2026-04-13T12:00:00.000Z",
  }]);
  writeJson(STORAGE_KEYS.assessmentResults, [legacyResult]);
  writeText(STORAGE_KEYS.activeProfileId, profile.id);
  writeText(STORAGE_KEYS.activeAssessmentId, legacyResult.id);

  const activeResult = getActiveAssessmentResult();

  assert.ok(activeResult.modules.actionGuide.overseas?.length > 0);
  assert.equal(activeResult.modules.actionGuide.overseas.length, 3);
  assert.deepEqual(
    activeResult.modules.actionGuide.overseas.map((item) => item.path),
    ["美国", "英国", "香港 / 新加坡"],
  );
  assert.equal(activeResult.modules.actionGuide.overseas[2].focus, "适合 Information Systems、Business Analytics、Innovation / Tech Management 方向。");

  resetAssessmentStorage();
});
