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

test("content-operations template has exactly 20 questions with correct format", () => {
  const questionSet = getQuestionSetForRole("content-operations");

  assert.equal(questionSet.questions.length, 20, `content-operations 题量应为 20，实际：${questionSet.questions.length}`);

  // 全部以「场景：」开头
  questionSet.questions.forEach((item) => {
    assert.match(item.prompt, /^场景：/u, `content-operations:${item.id} 缺少场景前缀`);
  });

  // 5 个维度各恰好 4 道题
  const dimCounts = {};
  questionSet.questions.forEach((item) => {
    dimCounts[item.dimension] = (dimCounts[item.dimension] ?? 0) + 1;
  });
  const expectedDimensions = [
    "content_judgment",
    "content_expression",
    "content_execution",
    "feedback_iteration",
    "output_responsibility",
  ];
  expectedDimensions.forEach((dim) => {
    assert.equal(dimCounts[dim], 4, `维度 ${dim} 题目数应为 4，实际：${dimCounts[dim] ?? 0}`);
  });
});

test("content-operations dimensions 1/2/3 are scenario-choice and 4/5 are scale", () => {
  const questionSet = getQuestionSetForRole("content-operations");

  const choiceDims = new Set(["content_judgment", "content_expression", "content_execution"]);
  const scaleDims = new Set(["feedback_iteration", "output_responsibility"]);

  questionSet.questions.forEach((item) => {
    if (choiceDims.has(item.dimension)) {
      assert.equal(item.type, "scenario-choice", `content-operations:${item.id} 应为选择题`);
      assert.match(item.options[0].label, /^[A-D]\./u, `content-operations:${item.id} 选择题文案不对`);
    } else if (scaleDims.has(item.dimension)) {
      assert.equal(item.type, "scale", `content-operations:${item.id} 应为程度题`);
      assert.equal(item.options[0].label, "很少符合", `content-operations:${item.id} 程度题选项不对`);
    }
  });
});

// ── 2. Category 映射验收 ──────────────────────────────────────────────────────

test("content-media maps to content-operations", () => {
  const stats = getRoleSystemStats();
  const stat = stats.categories.find((item) => item.categoryId === "content-media");
  assert.ok(stat, "stats 中缺少 content-media");
  assert.equal(
    stat.questionSetRoleId,
    "content-operations",
    `content-media 应映射到 content-operations，实际：${stat.questionSetRoleId}`,
  );
  assert.notEqual(stat.questionSetRoleId, "marketing", "content-media 不应再使用 marketing");
});

test("marketing categories brand-retail and marketing-growth remain on marketing", () => {
  const stats = getRoleSystemStats();

  ["brand-retail", "marketing-growth"].forEach((catId) => {
    const stat = stats.categories.find((item) => item.categoryId === catId);
    assert.ok(stat, `stats 中缺少 ${catId}`);
    assert.equal(
      stat.questionSetRoleId,
      "marketing",
      `${catId} 应保留在 marketing，实际：${stat.questionSetRoleId}`,
    );
  });
});

test("positions under content-media resolve to content-operations template", () => {
  const eduIndustry = roleSystemConfig.find((i) => i.id === "education-content-media");
  const contentCat = eduIndustry?.categories.find((c) => c.id === "content-media");
  assert.ok(contentCat, "缺少 content-media 大类");
  const contentPos = contentCat.positions[0];

  const r = resolveRoleSelection({
    targetIndustry: "education-content-media",
    targetCategory: "content-media",
    targetSubcategory: contentPos.id,
  });
  assert.equal(r.templateRoleId, "content-operations", `content-media 第一个岗位应路由到 content-operations，实际：${r.templateRoleId}`);
});

// ── 3. Demo 验收 ─────────────────────────────────────────────────────────────

test("demo sessions count matches roles count after adding content-operations", () => {
  assert.equal(
    demoSessions.length,
    roles.length,
    `demo 数量 (${demoSessions.length}) 应等于 roles 数量 (${roles.length})`,
  );
  const demoRoleIds = new Set(demoSessions.map((item) => item.profile.targetRole));
  const roleIds = new Set(roles.map((item) => item.id));
  assert.deepEqual(demoRoleIds, roleIds, "demo 未覆盖全部 roles");
});

test("content-operations demo exists and has 20 answers", () => {
  const demo = demoSessions.find((item) => item.profile.targetRole === "content-operations");
  assert.ok(demo, "缺少 content-operations demo");
  assert.equal(demo.id, "demo-junior-content-operations");
  assert.equal(Object.keys(demo.answers).length, 20, `demo 作答数量应为 20，实际：${Object.keys(demo.answers).length}`);
});
