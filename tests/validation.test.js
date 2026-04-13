import test from "node:test";
import assert from "node:assert/strict";

import { createEmptyProfile, validateUserProfile } from "../src/lib/validation.js";

test("validateUserProfile reports missing required fields", () => {
  const errors = validateUserProfile(createEmptyProfile());

  assert.equal(errors.targetRole, "请选择理想岗位");
  assert.equal(errors.graduationYear, "请选择毕业年份");
  assert.equal(errors.majorName, "请输入专业名称");
  assert.equal(errors.resumeStage, "请选择简历阶段");
  assert.equal(errors.careerStage, "请选择职业阶段");
  assert.equal(errors.educationLevel, "请选择学历");
  assert.equal(errors.studyRegion, "请选择就读区域");
});

test("validateUserProfile accepts a valid profile", () => {
  const errors = validateUserProfile({
    targetRole: "product-manager",
    targetCompany: "字节跳动",
    graduationYear: "2028",
    majorName: "信息管理与信息系统",
    resumeStage: "draft_resume",
    careerStage: "clear_goal_no_action",
    educationLevel: "bachelor",
    studyRegion: "domestic",
  });

  assert.deepEqual(errors, {});
});

test("validateUserProfile rejects invalid enum values", () => {
  const errors = validateUserProfile({
    targetRole: "unknown-role",
    targetCompany: "字节跳动",
    graduationYear: "3025",
    majorName: "信息管理与信息系统",
    resumeStage: "wrong_resume_stage",
    careerStage: "not-a-stage",
    educationLevel: "not-a-degree",
    studyRegion: "mars",
  });

  assert.equal(errors.targetRole, "请选择有效的理想岗位");
  assert.equal(errors.graduationYear, "请选择有效的毕业年份");
  assert.equal(errors.resumeStage, "请选择有效的简历阶段");
  assert.equal(errors.careerStage, "请选择有效的职业阶段");
  assert.equal(errors.educationLevel, "请选择有效的学历");
  assert.equal(errors.studyRegion, "请选择有效的就读区域");
});
