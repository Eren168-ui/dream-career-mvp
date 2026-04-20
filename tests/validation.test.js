import test from "node:test";
import assert from "node:assert/strict";

import { createEmptyProfile, normalizeUserProfile, validateUserProfile } from "../src/lib/validation.js";

test("validateUserProfile reports missing required fields", () => {
  const errors = validateUserProfile(createEmptyProfile());

  assert.equal(errors.targetRole, "请选择理想岗位");
  assert.equal(errors.graduationYear, "请选择毕业年份");
  assert.equal(errors.majorName, "请选择专业名称");
  assert.equal(errors.resumeStage, "请选择简历阶段");
  assert.equal(errors.careerStage, "请选择职业阶段");
  assert.equal(errors.schoolName, "请输入学校名称");
});

test("validateUserProfile accepts a valid profile", () => {
  const errors = validateUserProfile({
    targetRole: "product-manager",
    targetIndustry: "internet-ai",
    targetCategory: "product-management",
    targetSubcategory: "product-management-02",
    targetCompany: "字节跳动",
    graduationYear: "2028",
    majorCategory: "business",
    majorName: "信息管理与信息系统",
    resumeStage: "draft_resume",
    careerStage: "direction_set_seeking_first_internship",
    schoolName: "普通大学",
    schoolCity: "北京",
    hometownCity: "上海",
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
    schoolName: "普通大学",
    schoolCity: "北京",
    hometownCity: "上海",
  });

  assert.equal(errors.targetRole, "请选择有效的理想岗位");
  assert.equal(errors.graduationYear, "请选择有效的毕业年份");
  assert.equal(errors.resumeStage, "请选择有效的简历阶段");
  assert.equal(errors.careerStage, "请选择有效的职业阶段");
});

test("normalizeUserProfile auto-fills single-level regions into city fields", () => {
  const normalized = normalizeUserProfile({
    schoolProvince: "北京",
    hometownProvince: "香港",
    schoolCity: "",
    hometownCity: "",
  });

  assert.equal(normalized.schoolCity, "北京");
  assert.equal(normalized.hometownCity, "香港");
});

test("validateUserProfile accepts single-level region selections without explicit city choice", () => {
  const errors = validateUserProfile({
    targetRole: "product-manager",
    targetIndustry: "internet-ai",
    targetCategory: "product-management",
    targetSubcategory: "product-management-02",
    targetCompany: "字节跳动",
    graduationYear: "2028",
    majorCategory: "business",
    majorName: "信息管理与信息系统",
    resumeStage: "draft_resume",
    careerStage: "direction_set_seeking_first_internship",
    schoolName: "普通大学",
    schoolProvince: "北京",
    hometownProvince: "上海",
    schoolCity: "",
    hometownCity: "",
  });

  assert.deepEqual(errors, {});
});
