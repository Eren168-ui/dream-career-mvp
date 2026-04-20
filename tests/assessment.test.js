import test from "node:test";
import assert from "node:assert/strict";

import { buildAssessmentResult, buildDynamicResultSummary, getQuestionSetForRole } from "../src/lib/assessment.js";
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
    ["岗位要求", "职业素养", "基本技能", "日常事务", "晋升空间", "职场关系", "性格特征"],
  );

  result.modules.selfAwareness.strengthCards.forEach((item) => {
    assert.ok(typeof item.explanation === "string" && item.explanation.trim().length > 0);
  });

  result.modules.selfAwareness.growthCards.forEach((item) => {
    assert.ok(typeof item.explanation === "string" && item.explanation.trim().length > 0);
  });
});

test("self-awareness cards expose diagnostic guidance instead of business scenario copy", () => {
  const profile = {
    targetRole: "embedded-engineer",
    targetCompany: "大疆",
    graduationYear: "2027",
    majorName: "电子信息工程",
    resumeStage: "draft_resume",
    careerStage: "direction_set_seeking_first_internship",
    educationLevel: "bachelor",
    studyRegion: "domestic",
  };

  const answers = Object.fromEntries(
    getQuestionSetForRole("embedded-engineer").questions.map((item) => [
      item.id,
      item.dimension === "hardware_foundation" ? "often" : "sometimes",
    ]),
  );

  const result = buildAssessmentResult({ profile, answers });
  const cards = [
    ...result.modules.selfAwareness.strengthCards,
    ...result.modules.selfAwareness.growthCards,
  ];

  assert.ok(cards.length > 0);

  cards.forEach((item) => {
    assert.equal(typeof item.currentDiagnosis, "string");
    assert.ok(item.currentDiagnosis.trim().length > 15, `${item.dimension} currentDiagnosis 过短`);
    assert.equal(typeof item.improvementAdvice, "string");
    assert.ok(item.improvementAdvice.includes("先"), `${item.dimension} improvementAdvice 缺少先后顺序`);
    assert.ok(item.actionPlan && typeof item.actionPlan === "object", `${item.dimension} actionPlan 缺失`);
    assert.ok(Array.isArray(item.actionPlan.howToDo) && item.actionPlan.howToDo.length >= 2, `${item.dimension} howToDo 不完整`);
    assert.ok(Array.isArray(item.actionPlan.howToPlan) && item.actionPlan.howToPlan.length >= 2, `${item.dimension} howToPlan 不完整`);
    assert.ok(Array.isArray(item.actionPlan.whatToLearn) && item.actionPlan.whatToLearn.length >= 2, `${item.dimension} whatToLearn 不完整`);
    assert.equal("scenario" in item, false, `${item.dimension} 不应再暴露业务场景字段`);
  });
});

test("dynamic result summary points out strongest and weakest dimensions with concrete impact", () => {
  const profile = {
    targetRole: "product-manager",
    targetCompany: "字节跳动",
    graduationYear: "2027",
    majorName: "信息管理与信息系统",
    resumeStage: "draft_resume",
    careerStage: "clear_goal_no_action",
    educationLevel: "bachelor",
    studyRegion: "domestic",
  };

  const questionSet = getQuestionSetForRole("product-manager");
  const answers = Object.fromEntries(
    questionSet.questions.map((item) => [
      item.id,
      item.dimension === "job_requirements"
        ? "always"
        : item.dimension === "personality_traits"
        ? "rarely"
        : "sometimes",
    ]),
  );

  const result = buildAssessmentResult({ profile, answers });
  const summary = buildDynamicResultSummary({
    roleName: result.roleName,
    dimensionRanking: result.dimensionRanking,
    strengthCards: result.modules.selfAwareness.strengthCards,
    growthCards: result.modules.selfAwareness.growthCards,
  });

  assert.equal(result.dimensionRanking[0].label, "岗位要求");
  assert.equal(result.dimensionRanking.at(-1).label, "性格特征");
  assert.match(summary, /【岗位要求】/);
  assert.match(summary, /【性格特征】/);
  assert.match(summary, /岗位适配|案例表达|成长速度/);
  assert.equal(result.modules.selfAwareness.summary, summary);
});

test("dynamic result summary avoids calling out a shortcoming when every dimension is already high", () => {
  const profile = {
    targetRole: "product-manager",
    targetCompany: "字节跳动",
    graduationYear: "2027",
    majorName: "信息管理与信息系统",
    resumeStage: "applied_resume",
    careerStage: "clear_goal_no_action",
    educationLevel: "bachelor",
    studyRegion: "domestic",
  };

  const answers = Object.fromEntries(
    getQuestionSetForRole("product-manager").questions.map((item) => [item.id, "always"]),
  );

  const result = buildAssessmentResult({ profile, answers });
  const summary = result.modules.selfAwareness.summary;

  assert.equal(result.fitScore, 100);
  assert.doesNotMatch(summary, /短板|优先补足/);
  assert.match(summary, /表现很稳|整体很强|没有明显短板|均衡/);
});

test("market reality requirements include detailed explanations instead of single-line labels", () => {
  const profile = {
    targetRole: "product-manager",
    targetCompany: "字节跳动",
    graduationYear: "2027",
    majorName: "信息管理与信息系统",
    resumeStage: "draft_resume",
    careerStage: "clear_goal_no_action",
    educationLevel: "bachelor",
    studyRegion: "domestic",
  };

  const answers = Object.fromEntries(
    getQuestionSetForRole("product-manager").questions.map((item) => [item.id, "often"]),
  );

  const result = buildAssessmentResult({ profile, answers });
  const requirements = result.modules.marketReality.requirements;

  assert.ok(requirements.length > 0);
  requirements.forEach((item) => {
    assert.equal(typeof item.requirement, "string");
    assert.ok(item.requirement.trim().length > 0);
    assert.equal(typeof item.detail, "string");
    assert.ok(item.detail.trim().length > 20);
  });
  assert.match(requirements[0].detail, /面试|场景|招聘方|追问/);
});

test("action guide builds stage-based internship roadmap with concrete outputs", () => {
  const profile = {
    targetRole: "product-manager",
    targetCompany: "字节跳动",
    graduationYear: "2027",
    majorName: "信息管理与信息系统",
    resumeStage: "draft_resume",
    careerStage: "currently_interning_1st",
    educationLevel: "bachelor",
    studyRegion: "domestic",
  };

  const answers = Object.fromEntries(
    getQuestionSetForRole("product-manager").questions.map((item) => [item.id, "often"]),
  );

  const result = buildAssessmentResult({ profile, answers });
  const roadmap = result.modules.actionGuide.internshipRoadmap;

  assert.ok(roadmap, "internshipRoadmap 为空");
  assert.match(roadmap.stageLabel, /第1段|实习中/);
  assert.equal(typeof roadmap.stageDiagnosis, "string");
  assert.ok(roadmap.stageDiagnosis.length > 20);
  assert.ok(Array.isArray(roadmap.priorityRoles) && roadmap.priorityRoles.length > 0);
  assert.ok(Array.isArray(roadmap.resumeKeywords) && roadmap.resumeKeywords.length > 0);
  assert.ok(Array.isArray(roadmap.nextTwoWeeks) && roadmap.nextTwoWeeks.length >= 2);
  assert.ok(Array.isArray(roadmap.nextFourWeeks) && roadmap.nextFourWeeks.length >= 2);
  assert.ok(Array.isArray(roadmap.deliverables) && roadmap.deliverables.length >= 2);
  assert.match(roadmap.deliverables.join(" "), /案例|复盘|简历|作品/);
});

test("action guide includes academic planning and semester roadmap", () => {
  const profile = {
    targetRole: "product-manager",
    targetCompany: "字节跳动",
    graduationYear: "2028",
    majorName: "信息管理与信息系统",
    resumeStage: "draft_resume",
    careerStage: "direction_set_seeking_first_internship",
    educationLevel: "bachelor",
    studyRegion: "overseas",
  };

  const answers = Object.fromEntries(
    getQuestionSetForRole("product-manager").questions.map((item) => [item.id, "often"]),
  );

  const result = buildAssessmentResult({ profile, answers });
  const academicPlan = result.modules.actionGuide.academicPlan;

  assert.ok(academicPlan, "academicPlan 为空");
  assert.equal(typeof academicPlan.contextSummary, "string");
  assert.equal(typeof academicPlan.educationEdge, "string");
  assert.equal(typeof academicPlan.educationTarget, "string");
  assert.equal(typeof academicPlan.regionTip, "string");
  assert.ok(Array.isArray(academicPlan.studyPlan) && academicPlan.studyPlan.length > 0);
  assert.ok(academicPlan.yearContext?.phase, "academicPlan.yearContext.phase 为空");
  assert.ok(academicPlan.threeSemesterRoadmap?.now?.tasks?.length > 0, "当前学期路线为空");
  assert.ok(academicPlan.threeSemesterRoadmap?.next?.tasks?.length > 0, "下一阶段路线为空");
  assert.ok(academicPlan.threeSemesterRoadmap?.final?.tasks?.length > 0, "求职阶段路线为空");
});

test("action guide skill plan exposes concrete practice path for each skill", () => {
  const profile = {
    targetRole: "product-manager",
    targetCompany: "字节跳动",
    graduationYear: "2027",
    majorName: "信息管理与信息系统",
    resumeStage: "draft_resume",
    careerStage: "direction_set_seeking_first_internship",
    educationLevel: "bachelor",
    studyRegion: "domestic",
  };

  const answers = Object.fromEntries(
    getQuestionSetForRole("product-manager").questions.map((item) => [item.id, "often"]),
  );

  const result = buildAssessmentResult({ profile, answers });
  const skillPlan = result.modules.actionGuide.skillPlan;

  assert.ok(Array.isArray(skillPlan.hardSkillDetails) && skillPlan.hardSkillDetails.length > 0);
  assert.ok(Array.isArray(skillPlan.softSkillDetails) && skillPlan.softSkillDetails.length > 0);

  skillPlan.hardSkillDetails.forEach((item) => {
    assert.equal(typeof item.skill, "string");
    assert.equal(typeof item.reason, "string");
    assert.equal(typeof item.practicePath, "string");
    assert.equal(typeof item.output, "string");
    assert.ok(item.reason.length > 12);
    assert.ok(item.practicePath.length > 20);
    assert.ok(item.output.length > 10);
  });

  skillPlan.softSkillDetails.forEach((item) => {
    assert.equal(typeof item.skill, "string");
    assert.equal(typeof item.scenario, "string");
    assert.equal(typeof item.practiceAction, "string");
    assert.equal(typeof item.reviewQuestion, "string");
    assert.ok(item.scenario.length > 12);
    assert.ok(item.practiceAction.length > 12);
    assert.ok(item.reviewQuestion.length > 8);
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
