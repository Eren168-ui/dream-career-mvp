import test from "node:test";
import assert from "node:assert/strict";

import { studyAbroadProfileFieldDefinitions } from "../src/data/profileFields.js";
import { getRoleProfile } from "../src/data/roleProfiles.js";
import { buildStudyAbroadReport } from "../src/lib/studyAbroadReporting.js";
import { validateUserProfile } from "../src/lib/validation.js";

test("study abroad profile fields append dedicated planning inputs without removing base fields", () => {
  const fieldKeys = studyAbroadProfileFieldDefinitions.map((field) => field.key);

  for (const key of [
    "targetRole",
    "targetCompany",
    "graduationYear",
    "majorName",
    "resumeStage",
    "careerStage",
    "intent",
    "overseasIntent",
    "targetCountry",
    "currentGPA",
    "languageScore",
    "applicationTimeline",
  ]) {
    assert.ok(fieldKeys.includes(key), `missing field: ${key}`);
  }
});

test("study abroad profile validation requires additional planning fields", () => {
  const errors = validateUserProfile({
    intent: "study_abroad_resume",
    targetRole: "product-manager",
    graduationYear: "2027",
    majorName: "信息管理与信息系统",
    resumeStage: "draft_resume",
    careerStage: "clear_goal_no_action",
    educationLevel: "bachelor",
    studyRegion: "overseas",
  }, studyAbroadProfileFieldDefinitions);

  assert.equal(errors.overseasIntent, "请选择留学/升学目标");
  assert.equal(errors.targetCountry, "请选择目标国家/地区");
  assert.equal(errors.currentGPA, "请选择当前 GPA / 均分区间");
  assert.equal(errors.languageScore, "请选择语言成绩情况");
  assert.equal(errors.applicationTimeline, "请选择申请时间线");
});

test("role profiles expose dedicated study abroad success cases", () => {
  const profile = getRoleProfile("product-manager");

  assert.ok(Array.isArray(profile.studyAbroadSuccessCases));
  assert.ok(profile.studyAbroadSuccessCases.length > 0);
  assert.equal(typeof profile.studyAbroadSuccessCases[0].targetProgram, "string");
});

test("buildStudyAbroadReport returns dedicated planning modules", () => {
  const report = buildStudyAbroadReport({
    profile: {
      intent: "study_abroad_resume",
      overseasIntent: "abroad_master",
      targetCountry: "hk_sg",
      currentGPA: "3_5_plus",
      languageScore: "ielts_7_plus",
      applicationTimeline: "junior_fall",
      targetRole: "product-manager",
      targetCompany: "字节跳动",
      graduationYear: "2027",
      majorName: "信息管理与信息系统",
      resumeStage: "draft_resume",
      careerStage: "clear_goal_no_action",
      educationLevel: "bachelor",
      studyRegion: "overseas",
    },
    assessmentResult: {
      id: "assessment-study-abroad",
      roleId: "product-manager",
      roleName: "产品经理",
      score: 82,
      fitLabel: "优势明显",
      dimensionRanking: [
        { dimension: "user_insight", label: "理解用户", average: 3.5 },
        { dimension: "requirement_structuring", label: "拆清需求", average: 3.25 },
        { dimension: "stakeholder_alignment", label: "协同推进", average: 2.75 },
        { dimension: "data_iteration", label: "数据复盘", average: 2.5 },
      ],
      modules: {
        actionGuide: {
          overseas: [
            {
              path: "香港 / 新加坡 路径",
              focus: "Information Systems / Business Analytics / Innovation Management",
              suitableFor: "希望兼顾转专业与就业落地的人",
              nextStep: "补数据分析、产品项目和相关实习。",
            },
          ],
        },
      },
    },
  });

  assert.equal(report.entryLabel, "留学/升学定向简历规划");
  assert.equal(report.roleName, "产品经理");
  assert.ok(report.backgroundSummary.length >= 3);
  assert.ok(report.reversePathways.length > 0);
  assert.ok(report.countryRecommendations.length > 0);
  assert.ok(report.timelinePlan.length >= 3);
  assert.ok(report.studyAbroadCaseAnalysis.length > 0);
  assert.ok(report.nextSteps.length > 0);
  assert.match(report.reversePathways[0].title, /产品经理/);
});
