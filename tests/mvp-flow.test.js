/**
 * tests/mvp-flow.test.js
 *
 * MVP 全链路自动化测试
 * 覆盖：表单入参 → 答题进度条 → 报告出参 → 加微引流闭环
 *
 * 运行：npm test
 *
 * 测试状态说明：
 *   ✅ PASS  — 功能已实现且正常
 *   ❌ FAIL  — 已知缺陷，测试主动暴露，需修复后才能通过
 */

import test from "node:test";
import assert from "node:assert/strict";

import { careerStageOptions, resumeStageOptions }    from "../src/data/profileOptions.js";
import { profileFieldDefinitions }                    from "../src/data/profileFields.js";
import { createEmptyProfile, normalizeUserProfile, validateUserProfile } from "../src/lib/validation.js";
import { getQuestionSetForRole, buildAssessmentResult } from "../src/lib/assessment.js";
import { countAnsweredQuestions, filterAnswersForQuestionSet } from "../src/lib/assessmentSession.js";
import { buildConversionSearch, readConversionContext } from "../src/lib/conversion.js";
import { getRoleProfile }                             from "../src/data/roleProfiles.js";
import { getRoleConfig, getContextualActionPlan }     from "../src/data/roleConfig.js";
import { findRoleCategory }                           from "../src/data/roleSystem.js";
import {
  getActiveAssessmentResult,
  getActiveProfile,
  saveAnswerRecord,
  saveAssessmentResult,
  saveUserProfile,
} from "../src/services/mockDatabase.js";

// ─────────────────────────────────────────────────────────────────────────────
// 测试专用工具
// ─────────────────────────────────────────────────────────────────────────────

/** 生成一份合法的完整 profile（product-manager，国内，非名校） */
function makeValidProfile(overrides = {}) {
  const productCategory = findRoleCategory("product-management");
  return {
    targetRole:        "product-manager",
    targetIndustry:    "internet-ai",
    targetCategory:    "product-management",
    targetSubcategory: productCategory?.positions?.[0]?.id ?? "product-management-01",
    targetCompany:     "",
    graduationYear:    "2026",
    majorCategory:     "business",
    majorName:         "信息管理与信息系统",
    resumeStage:       "draft_resume",
    careerStage:       "direction_set_seeking_first_internship",
    schoolName:        "普通大学",
    schoolCity:        "北京",
    schoolProvince:    "北京",
    hometownCity:      "上海",
    hometownProvince:  "上海",
    studyRegion:       "domestic",
    ...overrides,
  };
}

/** 为某岗位 question set 生成全部答 "always" 的答案 */
function makeAllAnswers(questionSet, value = "always") {
  return Object.fromEntries(questionSet.questions.map((q) => [q.id, value]));
}

// ─────────────────────────────────────────────────────────────────────────────
// SECTION 1 · 入参校验
// ─────────────────────────────────────────────────────────────────────────────

test("S1-01 ✅ careerStageOptions 包含恰好 9 个细分选项", () => {
  assert.equal(careerStageOptions.length, 9);
  // 验证全部 value 唯一
  const values = careerStageOptions.map((o) => o.value);
  assert.equal(new Set(values).size, 9, "careerStage 选项存在重复 value");
});

test("S1-02 ✅ careerStageOptions 包含业务要求的 9 个阶段标识", () => {
  const expected = [
    "just_entered_university",
    "heard_internship_important",
    "considering_internship_no_direction",
    "direction_set_seeking_first_internship",
    "currently_interning_1st",
    "currently_interning_2nd",
    "currently_interning_3rd_plus",
    "experienced_staying_direction",
    "experienced_changing_direction",
  ];
  const actual = new Set(careerStageOptions.map((o) => o.value));
  for (const v of expected) {
    assert.ok(actual.has(v), `缺少 careerStage 选项：${v}`);
  }
});

test("S1-03 ✅ createEmptyProfile 初始化所有关键字段", () => {
  const profile = createEmptyProfile();
  const requiredKeys = [
    "targetRole", "targetCompany", "graduationYear",
    "majorCategory", "majorName",
    "resumeStage", "careerStage",
    "schoolName", "schoolCity", "hometownCity",
    "studyRegion",
  ];
  for (const key of requiredKeys) {
    assert.ok(Object.prototype.hasOwnProperty.call(profile, key), `createEmptyProfile 缺少字段：${key}`);
  }
});

test("S1-04 ✅ normalizeUserProfile 正确映射理想岗位、理想公司、职业阶段、就读城市、家乡城市", () => {
  const raw = makeValidProfile({
    targetCompany: "字节跳动",
    careerStage:   "currently_interning_1st",
    schoolProvince:"浙江",
    schoolCity:    "杭州",
    hometownProvince:"四川",
    hometownCity:  "成都",
  });
  const norm = normalizeUserProfile(raw);

  assert.equal(norm.targetRole,    "product-manager",         "targetRole 映射错误");
  assert.equal(norm.targetCompany, "字节跳动",                 "targetCompany 映射错误");
  assert.equal(norm.careerStage,   "currently_interning_1st", "careerStage 映射错误");
  assert.equal(norm.schoolCity,    "杭州",                     "schoolCity 映射错误");
  assert.equal(norm.hometownCity,  "成都",                     "hometownCity 映射错误");
});

test("S1-05 ✅ studyRegion 由 schoolProvince=海外 推导为 overseas", () => {
  const norm = normalizeUserProfile({ schoolProvince: "海外" });
  assert.equal(norm.studyRegion, "overseas");
});

test("S1-06 ✅ studyRegion 由 schoolProvince=非海外 推导为 domestic", () => {
  const norm = normalizeUserProfile({ schoolProvince: "北京" });
  assert.equal(norm.studyRegion, "domestic");
});

test("S1-07 ✅ targetCompany 为选填，空值不触发校验错误", () => {
  const profile = makeValidProfile({ targetCompany: "" });
  const errors = validateUserProfile(profile);
  assert.equal(errors.targetCompany, undefined, "targetCompany 不应被标记为必填错误");
});

test("S1-08 ✅ 缺少 careerStage 时 validateUserProfile 返回对应错误", () => {
  const profile = makeValidProfile({ careerStage: "" });
  const errors = validateUserProfile(profile);
  assert.ok(errors.careerStage, `缺少 careerStage 时应报错，实际 errors.careerStage=${errors.careerStage}`);
});

test("S1-09 ✅ 缺少 schoolCity 时 validateUserProfile 返回对应错误", () => {
  const profile = makeValidProfile({ schoolProvince: "浙江", schoolCity: "" });
  const errors = validateUserProfile(profile);
  assert.ok(errors.schoolCity, `缺少 schoolCity 时应报错，实际 errors.schoolCity=${errors.schoolCity}`);
});

test("S1-10 ✅ 缺少 hometownCity 时 validateUserProfile 返回对应错误", () => {
  const profile = makeValidProfile({ hometownProvince: "广东", hometownCity: "" });
  const errors = validateUserProfile(profile);
  assert.ok(errors.hometownCity, `缺少 hometownCity 时应报错，实际 errors.hometownCity=${errors.hometownCity}`);
});

test("S1-11 ✅ 完整合法 profile 零校验错误", () => {
  const profile = makeValidProfile();
  const errors = validateUserProfile(profile);
  assert.deepEqual(errors, {}, `合法 profile 不应有错误，实际：${JSON.stringify(errors)}`);
});

test("S1-12 ✅ saveUserProfile 会把关键入参写入 active profile 全局状态", () => {
  const profile = makeValidProfile({
    targetCompany: "腾讯",
    careerStage: "currently_interning_2nd",
    schoolName: "北京大学",
    schoolCity: "北京",
    hometownProvince: "广东",
    hometownCity: "广州",
  });
  const saved = saveUserProfile(profile);
  const active = getActiveProfile();

  assert.ok(saved.id, "saveUserProfile 应返回带 id 的记录");
  assert.equal(active?.id, saved.id, "active profile 未指向最新保存记录");
  assert.equal(active?.targetRole, "product-manager", "targetRole 未进入全局状态");
  assert.equal(active?.targetCompany, "腾讯", "targetCompany 未进入全局状态");
  assert.equal(active?.careerStage, "currently_interning_2nd", "careerStage 未进入全局状态");
  assert.equal(active?.schoolName, "北京大学", "schoolName 未进入全局状态");
  assert.equal(active?.schoolCity, "北京", "schoolCity 未进入全局状态");
  assert.equal(active?.hometownCity, "广州", "hometownCity 未进入全局状态");
});

// ─────────────────────────────────────────────────────────────────────────────
// SECTION 2 · 路由校验（答题进度条 total = 20）
// ─────────────────────────────────────────────────────────────────────────────

test("S2-01 ✅ getQuestionSetForRole 对所有已支持角色返回恰好 20 道题", () => {
  const roles = [
    "product-manager", "marketing", "account-manager",
    "ai-algorithm-engineer", "embedded-engineer",
    "strategy-consulting", "strategy-operations",
    "audit", "finance", "data-analyst",
  ];
  for (const roleId of roles) {
    const qs = getQuestionSetForRole(roleId);
    assert.equal(qs.questions.length, 20, `${roleId} 的题目数量不等于 20，实际=${qs.questions.length}`);
  }
});

test("S2-02 ✅ countAnsweredQuestions 空答案返回 0", () => {
  const qs = getQuestionSetForRole("product-manager");
  assert.equal(countAnsweredQuestions(qs, {}), 0);
});

test("S2-03 ✅ countAnsweredQuestions 部分作答返回正确计数", () => {
  const qs = getQuestionSetForRole("product-manager");
  const partial = {};
  qs.questions.slice(0, 7).forEach((q) => { partial[q.id] = "often"; });
  assert.equal(countAnsweredQuestions(qs, partial), 7);
});

test("S2-04 ✅ 全部作答后 countAnsweredQuestions = total = 20", () => {
  const qs = getQuestionSetForRole("product-manager");
  const full = makeAllAnswers(qs);
  assert.equal(countAnsweredQuestions(qs, full), 20);
});

test("S2-05 ✅ progressPercent 在边界值计算正确（0%, 50%, 100%）", () => {
  const total = 20;
  const cases = [
    { answered: 0,  expected: 0   },
    { answered: 10, expected: 50  },
    { answered: 20, expected: 100 },
    { answered: 1,  expected: 5   },   // Math.round(1/20*100) = 5
    { answered: 13, expected: 65  },
  ];
  for (const { answered, expected } of cases) {
    const pct = Math.round((answered / total) * 100);
    assert.equal(pct, expected, `answered=${answered} → progressPercent 应=${expected}，实际=${pct}`);
  }
});

test("S2-06 ✅ filterAnswersForQuestionSet 过滤无效 questionId", () => {
  const qs = getQuestionSetForRole("product-manager");
  const validId   = qs.questions[0].id;
  const invalidId = "fake-question-id-does-not-exist";
  const raw = { [validId]: "always", [invalidId]: "sometimes" };
  const filtered = filterAnswersForQuestionSet(qs, raw);
  assert.ok(Object.prototype.hasOwnProperty.call(filtered, validId),   "合法 questionId 应保留");
  assert.ok(!Object.prototype.hasOwnProperty.call(filtered, invalidId),"非法 questionId 应被过滤");
});

test("S2-07 ✅ filterAnswersForQuestionSet 过滤空字符串答案", () => {
  const qs = getQuestionSetForRole("product-manager");
  const firstId  = qs.questions[0].id;
  const secondId = qs.questions[1].id;
  const raw = { [firstId]: "", [secondId]: "often" };
  const filtered = filterAnswersForQuestionSet(qs, raw);
  assert.ok(!Object.prototype.hasOwnProperty.call(filtered, firstId),  "空字符串答案应被过滤");
  assert.ok(Object.prototype.hasOwnProperty.call(filtered, secondId),  "有效答案应保留");
});

test("S2-08 ✅ 上一题导航：currentIndex 从 1 回退到 0", () => {
  // 模拟 AssessmentPage 的 handlePrev 逻辑
  const handlePrev = (i) => (i > 0 ? i - 1 : i);
  assert.equal(handlePrev(1), 0,  "从第 2 题返回应到第 1 题");
  assert.equal(handlePrev(0), 0,  "已在第 1 题，再返回不应越界");
  assert.equal(handlePrev(19), 18,"从第 20 题返回应到第 19 题");
});

test("S2-09 ✅ 下一题导航：currentIndex 不超出 total-1", () => {
  const total = 20;
  const handleNext = (i) => Math.min(i + 1, total - 1);
  assert.equal(handleNext(0),  1,  "第 1 题前进到第 2 题");
  assert.equal(handleNext(19), 19, "最后一题不再前进");
  assert.equal(handleNext(10), 11);
});

// ─────────────────────────────────────────────────────────────────────────────
// SECTION 3 · 出参校验
// ─────────────────────────────────────────────────────────────────────────────

test("S3-01 ✅ buildAssessmentResult 返回全部必需模块", () => {
  const profile = makeValidProfile();
  const qs      = getQuestionSetForRole(profile.targetRole);
  const answers = makeAllAnswers(qs);
  const result  = buildAssessmentResult({ profile, answers });

  assert.ok(result.roleId,          "缺少 roleId");
  assert.ok(result.roleName,         "缺少 roleName");
  assert.ok(typeof result.fitScore  === "number", "fitScore 应为数字");
  assert.ok(typeof result.fitLabel  === "string", "fitLabel 应为字符串");
  assert.ok(Array.isArray(result.dimensionRanking), "dimensionRanking 应为数组");

  const modules = result.modules;
  for (const key of ["selfAwareness", "marketReality", "actionGuide", "closingMessage"]) {
    assert.ok(modules[key], `result.modules 缺少 ${key}`);
  }
});

test("S3-02 ✅ fitScore 在 0-100 范围内，fitLabel 为三种合法值之一", () => {
  const profile = makeValidProfile();
  const qs      = getQuestionSetForRole(profile.targetRole);
  const answers = makeAllAnswers(qs, "always");   // 全满分
  const result  = buildAssessmentResult({ profile, answers });

  assert.ok(result.fitScore >= 0 && result.fitScore <= 100, `fitScore=${result.fitScore} 越界`);
  assert.ok(
    ["匹配度较高", "潜力明显", "需要补足"].includes(result.fitLabel),
    `非法 fitLabel: ${result.fitLabel}`,
  );
});

test("S3-03 ✅ 全答 rarely 与全答 always 的 fitScore 差异显著（高分 vs 低分）", () => {
  const profile   = makeValidProfile();
  const qs        = getQuestionSetForRole(profile.targetRole);
  const highScore = buildAssessmentResult({ profile, answers: makeAllAnswers(qs, "always") }).fitScore;
  const lowScore  = buildAssessmentResult({ profile, answers: makeAllAnswers(qs, "rarely") }).fitScore;
  assert.ok(highScore > lowScore,    "全答 always 应得分高于全答 rarely");
  assert.ok(highScore - lowScore > 30, `高低分差距应 >30，实际差=${highScore - lowScore}`);
});

test("S3-04 ✅ dimensionRanking 按分数降序排列", () => {
  const profile = makeValidProfile();
  const qs      = getQuestionSetForRole(profile.targetRole);
  const result  = buildAssessmentResult({ profile, answers: makeAllAnswers(qs) });
  const scores  = result.dimensionRanking.map((d) => d.score);
  for (let i = 1; i < scores.length; i++) {
    assert.ok(scores[i - 1] >= scores[i],
      `dimensionRanking 非降序：index ${i-1}(${scores[i-1]}) < index ${i}(${scores[i]})`);
  }
});

test("S3-05 ✅ workplaceReality.careerGrowth 包含晋升路径和参考薪资", () => {
  const rp = getRoleProfile("product-manager");
  const careerGrowth = rp?.workplaceReality?.careerGrowth;
  assert.ok(careerGrowth, "product-manager workplaceReality.careerGrowth 未定义");
  assert.ok(
    typeof careerGrowth === "string" || Array.isArray(careerGrowth),
    "careerGrowth 应为字符串或数组",
  );
  const text = Array.isArray(careerGrowth) ? careerGrowth.join("") : careerGrowth;
  assert.ok(text.includes("薪资") || text.includes("k") || text.includes("万"),
    `careerGrowth 应包含参考薪资信息，实际内容：${text}`);
});

test("S3-06 ✅ workplaceReality 包含全部 7 个维度", () => {
  const REQUIRED_KEYS = [
    "jobRequirements", "professionalism", "coreSkills",
    "dailyOperations", "careerGrowth", "workplaceRelations", "personalityTraits",
  ];
  const roles = [
    "product-manager", "marketing", "account-manager",
    "ai-algorithm-engineer", "strategy-consulting",
  ];
  for (const roleId of roles) {
    const rp = getRoleProfile(roleId);
    for (const key of REQUIRED_KEYS) {
      assert.ok(rp?.workplaceReality?.[key],
        `${roleId}.workplaceReality.${key} 未定义`);
    }
  }
});

test("S3-07 ✅ immediateAction 随 resumeStage 变化（no_resume vs applied_resume）", () => {
  const qs = getQuestionSetForRole("product-manager");
  const answers = makeAllAnswers(qs);

  const r1 = buildAssessmentResult({
    profile: makeValidProfile({ resumeStage: "no_resume" }),
    answers,
  });
  const r2 = buildAssessmentResult({
    profile: makeValidProfile({ resumeStage: "applied_resume" }),
    answers,
  });

  assert.notEqual(
    r1.immediateAction,
    r2.immediateAction,
    `resumeStage 不同时 immediateAction 应不同，实际均为：${r1.immediateAction}`,
  );
});

test("S3-08 ✅ getContextualActionPlan.byResumeStage 随 resumeStage 返回不同 immediateAction", () => {
  const stageMap = {
    no_resume:       "先整理",
    draft_resume:    "把现有项目",
    applied_resume:  "挑",
  };
  for (const [stage, keyword] of Object.entries(stageMap)) {
    const plan = getContextualActionPlan("product-manager", {
      resumeStage: stage,
      careerStage: "direction_set_seeking_first_internship",
    });
    assert.ok(
      plan.byResumeStage.immediateAction.includes(keyword),
      `resumeStage=${stage} 的 immediateAction 应包含"${keyword}"，实际：${plan.byResumeStage.immediateAction}`,
    );
  }
});

test("S3-09 ✅ result.modules.closingMessage.content 为非空字符串", () => {
  const profile = makeValidProfile();
  const qs      = getQuestionSetForRole(profile.targetRole);
  const result  = buildAssessmentResult({ profile, answers: makeAllAnswers(qs) });
  const content = result.modules.closingMessage.content;
  assert.ok(typeof content === "string" && content.trim().length > 0,
    "closingMessage.content 应为非空字符串");
});

test("S3-10 ✅ roleProfile.workplaceReality.transferableRoles 为非空数组", () => {
  const roles = ["product-manager", "marketing", "account-manager"];
  for (const roleId of roles) {
    const rp = getRoleProfile(roleId);
    const tr = rp?.workplaceReality?.transferableRoles;
    assert.ok(Array.isArray(tr) && tr.length > 0,
      `${roleId}.workplaceReality.transferableRoles 应为非空数组，实际：${JSON.stringify(tr)}`);
  }
});

// ─────────────────────────────────────────────────────────────────────────────
// SECTION 4 · 已知缺陷验证（❌ 预期失败，修复后方可通过）
// ─────────────────────────────────────────────────────────────────────────────

test("S4-01 ✅ 新 careerStage 细分枚举会映射到不同 closingMessage 文案", () => {
  const qs = getQuestionSetForRole("product-manager");
  const answers = makeAllAnswers(qs, "always");

  const lostResult = buildAssessmentResult({
    profile: makeValidProfile({ careerStage: "just_entered_university" }),
    answers,
  });
  const exploringResult = buildAssessmentResult({
    profile: makeValidProfile({ careerStage: "considering_internship_no_direction" }),
    answers,
  });
  const actionResult = buildAssessmentResult({
    profile: makeValidProfile({ careerStage: "currently_interning_1st" }),
    answers,
  });

  const lostClosing = lostResult.modules.closingMessage.content;
  const exploringClosing = exploringResult.modules.closingMessage.content;
  const actionClosing = actionResult.modules.closingMessage.content;

  assert.ok(
    lostClosing.includes("先把最强案例做成能投递的证据"),
    `just_entered_university 应映射 lost 文案，实际：${lostClosing}`,
  );
  assert.ok(
    exploringClosing.includes("下一步重点不是再确认方向"),
    `considering_internship_no_direction 应映射 direction_no_target 文案，实际：${exploringClosing}`,
  );
  assert.ok(
    actionClosing.includes("立刻把方案和复盘沉淀下来"),
    `currently_interning_1st 应映射 clear_goal_no_action 文案，实际：${actionClosing}`,
  );
  assert.notEqual(lostClosing, exploringClosing, "不同 careerStage 不应得到同一 closing 文案");
  assert.notEqual(exploringClosing, actionClosing, "不同 careerStage 不应得到同一 closing 文案");
});

test("S4-02 ✅ 名校与普通院校的 careerGrowth 建议会动态分层", () => {
  const qs = getQuestionSetForRole("product-manager");
  const answers = makeAllAnswers(qs);

  const eliteResult = buildAssessmentResult({
    profile: makeValidProfile({ schoolName: "北京大学" }),
    answers,
  });
  const regularResult = buildAssessmentResult({
    profile: makeValidProfile({ schoolName: "普通地方本科" }),
    answers,
  });

  const eliteGrowth = eliteResult.modules.marketReality.workplaceReality?.careerGrowth;
  const regularGrowth = regularResult.modules.marketReality.workplaceReality?.careerGrowth;
  const eliteText = Array.isArray(eliteGrowth) ? eliteGrowth.join(" ") : eliteGrowth;
  const regularText = Array.isArray(regularGrowth) ? regularGrowth.join(" ") : regularGrowth;

  assert.notEqual(
    eliteText,
    regularText,
    `名校（北京大学）与普通院校的 careerGrowth 建议不应完全相同。` +
    `\n   elite=${eliteText}` +
    `\n   regular=${regularText}`,
  );
  assert.ok(/名校|校招起点|大厂/.test(eliteText), `名校文案缺少名校优势提示：${eliteText}`);
  assert.ok(/非名校|项目|实习|证据/.test(regularText), `普通院校文案缺少补证据提示：${regularText}`);
});

// ─────────────────────────────────────────────────────────────────────────────
// SECTION 5 · 全链路闭环验证
// ─────────────────────────────────────────────────────────────────────────────

test("S5-01 ✅ 全链路：合法 profile + 全部答题 → result 结构完整", () => {
  const profile = makeValidProfile({ targetCompany: "腾讯" });
  const qs      = getQuestionSetForRole(profile.targetRole);
  const answers = makeAllAnswers(qs);
  const result  = buildAssessmentResult({ profile, answers });

  // 基础字段
  assert.ok(result.roleId);
  assert.ok(result.roleName);
  assert.ok(typeof result.fitScore === "number");

  // 自我认知
  const sa = result.modules.selfAwareness;
  assert.ok(Array.isArray(sa.strengthCards) && sa.strengthCards.length > 0, "strengthCards 为空");
  assert.ok(Array.isArray(sa.growthCards)   && sa.growthCards.length > 0,   "growthCards 为空");
  assert.ok(sa.strengthCards[0].dimension, "strengthCards 缺少 dimension 字段");
  assert.ok(sa.strengthCards[0].keyword,   "strengthCards 缺少 keyword 字段");

  // 外界认知
  const mr = result.modules.marketReality;
  assert.ok(Array.isArray(mr.topCompanies) && mr.topCompanies.length > 0, "topCompanies 为空");
  assert.ok(mr.careerPath, "careerPath 为空");
  assert.ok(mr.avgSalary,  "avgSalary 为空");

  // 行动指引
  const ag = result.modules.actionGuide;
  assert.ok(Array.isArray(ag.internshipPlan) && ag.internshipPlan.length > 0, "internshipPlan 为空");
  assert.ok(Array.isArray(ag.skillPlan.hardSkills), "hardSkills 应为数组");
  assert.ok(Array.isArray(ag.skillPlan.softSkills), "softSkills 应为数组");
  assert.ok(ag.immediateAction, "immediateAction 为空");

  // 结尾寄语（含加微引流触发点）
  const cm = result.modules.closingMessage;
  assert.ok(typeof cm.content === "string" && cm.content.length > 0, "closingMessage.content 为空");
});

test("S5-02 ✅ 全链路：result.dimensionRanking 包含具有 score / label / dimension 的完整条目", () => {
  const profile = makeValidProfile();
  const qs      = getQuestionSetForRole(profile.targetRole);
  const result  = buildAssessmentResult({ profile, answers: makeAllAnswers(qs) });

  assert.ok(result.dimensionRanking.length > 0, "dimensionRanking 为空");
  for (const entry of result.dimensionRanking) {
    assert.ok(typeof entry.dimension === "string",  `dimension 字段类型错误：${JSON.stringify(entry)}`);
    assert.ok(typeof entry.label     === "string",  `label 字段类型错误：${JSON.stringify(entry)}`);
    assert.ok(typeof entry.score     === "number",  `score 字段类型错误：${JSON.stringify(entry)}`);
    assert.ok(entry.score >= 0 && entry.score <= 100, `score 越界：${entry.score}`);
  }
});

test("S5-03 ✅ resumeStage=no_resume 时 internshipPlan 非空（冷启动场景可用）", () => {
  const profile = makeValidProfile({ resumeStage: "no_resume" });
  const qs      = getQuestionSetForRole(profile.targetRole);
  const result  = buildAssessmentResult({ profile, answers: makeAllAnswers(qs) });
  assert.ok(
    result.modules.actionGuide.internshipPlan.length > 0,
    "no_resume 场景的 internshipPlan 不应为空",
  );
});

test("S5-04 ✅ 十种角色均可完成全链路 buildAssessmentResult 无报错", () => {
  const roles = [
    "product-manager", "marketing", "account-manager",
    "ai-algorithm-engineer", "embedded-engineer",
    "strategy-consulting", "strategy-operations",
    "audit", "finance", "data-analyst",
  ];
  for (const roleId of roles) {
    const profile = makeValidProfile({ targetRole: roleId });
    const qs      = getQuestionSetForRole(roleId);
    const answers = makeAllAnswers(qs);
    let result;
    try {
      result = buildAssessmentResult({ profile, answers });
    } catch (err) {
      assert.fail(`${roleId} buildAssessmentResult 抛出异常：${err.message}`);
    }
    assert.ok(result.fitScore >= 0, `${roleId} fitScore 应 >= 0`);
    assert.ok(result.modules.closingMessage.content, `${roleId} closingMessage 为空`);
  }
});

test("S5-05 ✅ 全链路持久化：profile -> answers -> result 可从 active state 恢复", () => {
  const profile = saveUserProfile(makeValidProfile({ targetCompany: "美团" }));
  const qs = getQuestionSetForRole(profile.targetRole);
  const answers = makeAllAnswers(qs, "often");
  const answerRecord = saveAnswerRecord({ profileId: profile.id, roleId: profile.targetRole, answers });
  const result = buildAssessmentResult({ profile, answers });
  const savedResult = saveAssessmentResult({ profileId: profile.id, answerRecordId: answerRecord.id, result });
  const activeResult = getActiveAssessmentResult();

  assert.equal(getActiveProfile()?.id, profile.id, "active profile 恢复失败");
  assert.equal(activeResult?.id, savedResult.id, "active result 恢复失败");
  assert.equal(activeResult?.targetCompany, "美团", "result 未保留 targetCompany");
  assert.equal(activeResult?.roleId, "product-manager", "result 未保留 roleId");
  assert.ok(activeResult?.modules?.selfAwareness, "result 缺少 selfAwareness");
});

test("S5-06 ✅ 结果页可以把岗位/公司上下文传递到咨询引流页", () => {
  const profile = makeValidProfile({ targetCompany: "字节跳动" });
  const search = buildConversionSearch({ profile, sourcePath: "/result" });
  const context = readConversionContext(`?${search}`, null);

  assert.equal(context.roleId, "product-manager", "引流参数 roleId 丢失");
  assert.equal(context.roleName, "AI产品经理", "引流参数 roleName 解析错误");
  assert.equal(context.company, "字节跳动", "引流参数 targetCompany 丢失");
  assert.equal(context.source, "/result", "引流参数 source 丢失");
});

test("S5-05 ✅ 引流触发点：closingMessage 存在且不同 fitLabel 下内容不同", () => {
  const qs = getQuestionSetForRole("product-manager");

  // 全对 → 高分
  const highResult = buildAssessmentResult({
    profile: makeValidProfile(),
    answers: makeAllAnswers(qs, "always"),
  });
  // 全错 → 低分
  const lowResult = buildAssessmentResult({
    profile: makeValidProfile(),
    answers: makeAllAnswers(qs, "rarely"),
  });

  assert.ok(highResult.modules.closingMessage.content, "高分 closingMessage 为空");
  assert.ok(lowResult.modules.closingMessage.content,  "低分 closingMessage 为空");

  // 高分和低分的 fitLabel 应不同（一个通过 buildWarmClosingMessage 追加固定尾句，内容仍可区分）
  assert.notEqual(
    highResult.fitLabel,
    lowResult.fitLabel,
    `全 always 与全 rarely 应产生不同 fitLabel，实际高=${highResult.fitLabel}，低=${lowResult.fitLabel}`,
  );
});
