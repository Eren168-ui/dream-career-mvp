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

test("sales-bd template has exactly 20 questions with correct format", () => {
  const questionSet = getQuestionSetForRole("sales-bd");

  assert.equal(questionSet.questions.length, 20, `sales-bd 题量应为 20，实际：${questionSet.questions.length}`);

  // 全部以「场景：」开头
  questionSet.questions.forEach((item) => {
    assert.match(item.prompt, /^场景：/u, `sales-bd:${item.id} 缺少场景前缀`);
  });

  // 5 个维度各恰好 4 道题
  const dimCounts = {};
  questionSet.questions.forEach((item) => {
    dimCounts[item.dimension] = (dimCounts[item.dimension] ?? 0) + 1;
  });
  const expectedDimensions = [
    "customer_needs_id",
    "pipeline_followthrough",
    "value_presentation",
    "objection_handling",
    "result_orientation",
  ];
  expectedDimensions.forEach((dim) => {
    assert.equal(dimCounts[dim], 4, `维度 ${dim} 题目数应为 4，实际：${dimCounts[dim] ?? 0}`);
  });
});

test("sales-bd dimensions 1/2/3 are scenario-choice and 4/5 are scale", () => {
  const questionSet = getQuestionSetForRole("sales-bd");

  const choiceDims = new Set(["customer_needs_id", "pipeline_followthrough", "value_presentation"]);
  const scaleDims = new Set(["objection_handling", "result_orientation"]);

  questionSet.questions.forEach((item) => {
    if (choiceDims.has(item.dimension)) {
      assert.equal(item.type, "scenario-choice", `sales-bd:${item.id} 应为选择题`);
      assert.match(item.options[0].label, /^[A-D]\./u, `sales-bd:${item.id} 选择题文案不对`);
    } else if (scaleDims.has(item.dimension)) {
      assert.equal(item.type, "scale", `sales-bd:${item.id} 应为程度题`);
      assert.equal(item.options[0].label, "很少符合", `sales-bd:${item.id} 程度题选项不对`);
    }
  });
});

// ── 2. Category 映射验收 ──────────────────────────────────────────────────────

test("business-development, sales-client-expansion, international-business map to sales-bd", () => {
  const stats = getRoleSystemStats();

  const migratedIds = ["business-development", "sales-client-expansion", "international-business"];
  migratedIds.forEach((catId) => {
    const stat = stats.categories.find((item) => item.categoryId === catId);
    assert.ok(stat, `stats 中缺少 ${catId}`);
    assert.equal(
      stat.questionSetRoleId,
      "sales-bd",
      `${catId} 应映射到 sales-bd，实际：${stat.questionSetRoleId}`,
    );
    assert.notEqual(stat.questionSetRoleId, "account-manager", `${catId} 不应再使用 account-manager`);
  });
});

test("banking-client and medical-devices remain on account-manager", () => {
  const stats = getRoleSystemStats();

  ["banking-client", "medical-devices"].forEach((catId) => {
    const stat = stats.categories.find((item) => item.categoryId === catId);
    assert.ok(stat, `stats 中缺少 ${catId}`);
    assert.equal(
      stat.questionSetRoleId,
      "account-manager",
      `${catId} 应保留在 account-manager，实际：${stat.questionSetRoleId}`,
    );
  });
});

test("positions under migrated categories resolve to sales-bd template", () => {
  // business-development 第一个细分
  const bdIndustry = roleSystemConfig.find((i) => i.id === "cross-border-trade");
  const bdCat = bdIndustry?.categories.find((c) => c.id === "business-development");
  assert.ok(bdCat, "缺少 business-development 大类");
  const bdPos = bdCat.positions[0];

  const r1 = resolveRoleSelection({
    targetIndustry: "cross-border-trade",
    targetCategory: "business-development",
    targetSubcategory: bdPos.id,
  });
  assert.equal(r1.templateRoleId, "sales-bd", `business-development 第一个岗位应路由到 sales-bd，实际：${r1.templateRoleId}`);

  // sales-client-expansion 第一个细分
  const retailIndustry = roleSystemConfig.find((i) => i.id === "consumer-retail");
  const scCat = retailIndustry?.categories.find((c) => c.id === "sales-client-expansion");
  assert.ok(scCat, "缺少 sales-client-expansion 大类");
  const scPos = scCat.positions[0];

  const r2 = resolveRoleSelection({
    targetIndustry: "consumer-retail",
    targetCategory: "sales-client-expansion",
    targetSubcategory: scPos.id,
  });
  assert.equal(r2.templateRoleId, "sales-bd", `sales-client-expansion 第一个岗位应路由到 sales-bd，实际：${r2.templateRoleId}`);
});

test("account-manager template still works for banking-client positions", () => {
  const financeIndustry = roleSystemConfig.find((i) => i.id === "finance");
  const bankCat = financeIndustry?.categories.find((c) => c.id === "banking-client");
  assert.ok(bankCat, "缺少 banking-client 大类");

  const r = resolveRoleSelection({
    targetIndustry: "finance",
    targetCategory: "banking-client",
    targetSubcategory: bankCat.positions[0].id,
  });
  assert.equal(r.templateRoleId, "account-manager", `banking-client 应仍路由到 account-manager，实际：${r.templateRoleId}`);
});

// ── 3. Demo 验收 ─────────────────────────────────────────────────────────────

test("demo sessions count matches roles count after adding sales-bd", () => {
  assert.equal(
    demoSessions.length,
    roles.length,
    `demo 数量 (${demoSessions.length}) 应等于 roles 数量 (${roles.length})`,
  );
  const demoRoleIds = new Set(demoSessions.map((item) => item.profile.targetRole));
  const roleIds = new Set(roles.map((item) => item.id));
  assert.deepEqual(demoRoleIds, roleIds, "demo 未覆盖全部 roles");
});

test("sales-bd demo exists and has 20 answers", () => {
  const demo = demoSessions.find((item) => item.profile.targetRole === "sales-bd");
  assert.ok(demo, "缺少 sales-bd demo");
  assert.equal(demo.id, "demo-senior-sales-bd");
  assert.equal(Object.keys(demo.answers).length, 20, `demo 作答数量应为 20，实际：${Object.keys(demo.answers).length}`);
});
