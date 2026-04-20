import test from "node:test";
import assert from "node:assert/strict";

import { getQuestionSetForRole } from "../src/lib/assessment.js";
import { demoSessions } from "../src/data/demoSessions.js";
import { roles } from "../src/data/roles.js";
import {
  getRoleSystemStats,
  resolveRoleSelection,
  roleSystemConfig,
} from "../src/data/roleSystem.js";

// ── 1. 题库基础验收 ─────────────────────────────────────────────────────────

test("hr-organization template has exactly 20 questions with correct format", () => {
  const questionSet = getQuestionSetForRole("hr-organization");

  assert.equal(questionSet.questions.length, 20, `hr-organization 题量应为 20，实际：${questionSet.questions.length}`);

  // 全部以「场景：」开头
  questionSet.questions.forEach((item) => {
    assert.match(item.prompt, /^场景：/u, `hr-organization:${item.id} 缺少场景前缀`);
  });

  // 5 个维度各恰好 4 道题
  const dimCounts = {};
  questionSet.questions.forEach((item) => {
    dimCounts[item.dimension] = (dimCounts[item.dimension] ?? 0) + 1;
  });
  const expectedDimensions = [
    "candidate_employee_insight",
    "multi_party_communication",
    "process_detail_execution",
    "hr_judgment_problem_solving",
    "organizational_awareness",
  ];
  expectedDimensions.forEach((dim) => {
    assert.equal(dimCounts[dim], 4, `维度 ${dim} 题目数应为 4，实际：${dimCounts[dim] ?? 0}`);
  });
});

test("hr-organization dimensions 1/2/3 are scenario-choice and 4/5 are scale", () => {
  const questionSet = getQuestionSetForRole("hr-organization");

  const choiceDims = new Set(["candidate_employee_insight", "multi_party_communication", "process_detail_execution"]);
  const scaleDims = new Set(["hr_judgment_problem_solving", "organizational_awareness"]);

  questionSet.questions.forEach((item) => {
    if (choiceDims.has(item.dimension)) {
      assert.equal(item.type, "scenario-choice", `hr-organization:${item.id} 应为选择题`);
      assert.match(item.options[0].label, /^[A-D]\./u, `hr-organization:${item.id} 选择题文案不对`);
    } else if (scaleDims.has(item.dimension)) {
      assert.equal(item.type, "scale", `hr-organization:${item.id} 应为程度题`);
      assert.equal(item.options[0].label, "很少符合", `hr-organization:${item.id} 程度题选项不对`);
    }
  });
});

// ── 2. Category 映射验收 ──────────────────────────────────────────────────────

test("human-resources maps to hr-organization", () => {
  const stats = getRoleSystemStats();
  const stat = stats.categories.find((item) => item.categoryId === "human-resources");
  assert.ok(stat, "stats 中缺少 human-resources");
  assert.equal(
    stat.questionSetRoleId,
    "hr-organization",
    `human-resources 应映射到 hr-organization，实际：${stat.questionSetRoleId}`,
  );
  assert.notEqual(stat.questionSetRoleId, "strategy-operations", "human-resources 不应再使用 strategy-operations");
});

test("positions under human-resources resolve to hr-organization template", () => {
  const consultingIndustry = roleSystemConfig.find((i) => i.id === "consulting-professional");
  const hrCat = consultingIndustry?.categories.find((c) => c.id === "human-resources");
  assert.ok(hrCat, "缺少 human-resources 大类");
  const hrPos = hrCat.positions[0];

  const r = resolveRoleSelection({
    targetIndustry: "consulting-professional",
    targetCategory: "human-resources",
    targetSubcategory: hrPos.id,
  });
  assert.equal(r.templateRoleId, "hr-organization", `human-resources 第一个岗位应路由到 hr-organization，实际：${r.templateRoleId}`);
});

// ── 3. Demo 验收 ─────────────────────────────────────────────────────────────

test("demo sessions count matches roles count after adding hr-organization", () => {
  assert.equal(
    demoSessions.length,
    roles.length,
    `demo 数量 (${demoSessions.length}) 应等于 roles 数量 (${roles.length})`,
  );
  const demoRoleIds = new Set(demoSessions.map((item) => item.profile.targetRole));
  const roleIds = new Set(roles.map((item) => item.id));
  assert.deepEqual(demoRoleIds, roleIds, "demo 未覆盖全部 roles");
});

test("hr-organization demo exists and has 20 answers", () => {
  const demo = demoSessions.find((item) => item.profile.targetRole === "hr-organization");
  assert.ok(demo, "缺少 hr-organization demo");
  assert.equal(demo.id, "demo-junior-hr-organization");
  assert.equal(Object.keys(demo.answers).length, 20, `demo 作答数量应为 20，实际：${Object.keys(demo.answers).length}`);
});
