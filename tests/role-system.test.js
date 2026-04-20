import test from "node:test";
import assert from "node:assert/strict";

import { buildAssessmentResult } from "../src/lib/assessment.js";
import { buildLeadSubmissionPayload } from "../src/services/leadSubmission.js";
import { demoSessions } from "../src/data/demoSessions.js";
import {
  getRoleSystemStats,
  resolveRoleSelection,
  roleSystemConfig,
} from "../src/data/roleSystem.js";

function pickCrossBorderSelection() {
  const industry = roleSystemConfig.find((item) => item.name.includes("跨境电商"));
  assert.ok(industry, "缺少跨境电商行业");

  const category = industry.categories.find(
    (item) => item.name.includes("海外市场") || item.name.includes("国际业务"),
  );
  assert.ok(category, "缺少海外市场/国际业务大类");

  const position =
    category.positions.find((item) => item.name.includes("海外"))
    ?? category.positions.find((item) => item.name.includes("外贸"))
    ?? category.positions[0];

  assert.ok(position, "缺少海外市场/外贸细分岗位");

  return { industry, category, position };
}

test("role system meets minimum scale and keeps category position counts manageable", () => {
  const stats = getRoleSystemStats();

  assert.ok(stats.industryCount >= 8, `行业数不足：${stats.industryCount}`);
  assert.ok(stats.categoryCount >= 20, `大类岗位数不足：${stats.categoryCount}`);
  assert.ok(stats.positionCount >= 100, `细分岗位数不足：${stats.positionCount}`);

  stats.categories.forEach((item) => {
    assert.ok(
      item.positionCount >= 5,
      `岗位大类 ${item.categoryName} 的细分岗位少于 5 个：${item.positionCount}`,
    );
    assert.ok(
      item.positionCount <= 20,
      `岗位大类 ${item.categoryName} 的细分岗位多于 20 个：${item.positionCount}`,
    );
  });
});

test("role selection resolves display name and category-driven company recommendations", () => {
  const { industry, category, position } = pickCrossBorderSelection();
  const selection = resolveRoleSelection({
    targetIndustry: industry.id,
    targetCategory: category.id,
    targetSubcategory: position.id,
    targetRole: category.questionSetRoleId,
  });

  assert.equal(selection.industry?.id, industry.id);
  assert.equal(selection.category?.id, category.id);
  assert.equal(selection.position?.id, position.id);
  assert.equal(selection.displayName, position.name);
  assert.ok(selection.recommendedCompanies.length >= 4, "动态推荐公司数量不足");
  assert.ok(
    selection.recommendedCompanies.some((item) => /SHEIN|TEMU|字节跳动|Anker|米哈游/.test(item)),
    `跨境岗位推荐公司不符合预期：${selection.recommendedCompanies.join("、")}`,
  );
});

test("assessment result and lead payload use selected fine-grained role instead of legacy template name", () => {
  const marketingDemo = demoSessions.find((item) => item.profile.targetRole === "marketing");
  assert.ok(marketingDemo, "缺少 marketing demo");

  const { industry, category, position } = pickCrossBorderSelection();
  const profile = {
    ...marketingDemo.profile,
    targetIndustry: industry.id,
    targetCategory: category.id,
    targetSubcategory: position.id,
    targetRole: category.questionSetRoleId,
    targetCompany: "SHEIN",
    schoolName: "复旦大学",
  };

  const result = buildAssessmentResult({
    profile,
    answers: marketingDemo.answers,
  });

  assert.equal(result.roleId, category.questionSetRoleId);
  assert.equal(result.roleName, position.name);
  assert.ok(
    result.modules.marketReality.topCompanies.includes("SHEIN"),
    `结果页公司推荐未联动到细分岗位：${result.modules.marketReality.topCompanies.join("、")}`,
  );

  const payload = buildLeadSubmissionPayload({
    formType: "diagnosis",
    sourcePage: "/result",
    sourceUrl: "https://example.com/result",
    profile,
    assessment: result,
    form: {
      name: "测试同学",
      contact: "weixin-test",
      currentYear: "junior",
      question: "我想补强海外市场案例",
    },
  });

  assert.equal(payload.role_id, category.questionSetRoleId);
  assert.equal(payload.role_name, position.name);
});

test("biopharma-rd and mechanical-quality categories both map to general-rd-quality, not embedded-engineer", () => {
  const stats = getRoleSystemStats();

  const biopharmaStat = stats.categories.find((item) => item.categoryId === "biopharma-rd");
  assert.ok(biopharmaStat, "stats 中缺少 biopharma-rd");
  assert.equal(
    biopharmaStat.questionSetRoleId,
    "general-rd-quality",
    `biopharma-rd 应映射到 general-rd-quality，实际：${biopharmaStat.questionSetRoleId}`,
  );
  assert.notEqual(biopharmaStat.questionSetRoleId, "embedded-engineer", "biopharma-rd 不应再使用 embedded-engineer");

  const mechanicalStat = stats.categories.find((item) => item.categoryId === "mechanical-quality");
  assert.ok(mechanicalStat, "stats 中缺少 mechanical-quality");
  assert.equal(
    mechanicalStat.questionSetRoleId,
    "general-rd-quality",
    `mechanical-quality 应映射到 general-rd-quality，实际：${mechanicalStat.questionSetRoleId}`,
  );
  assert.notEqual(mechanicalStat.questionSetRoleId, "embedded-engineer", "mechanical-quality 不应再使用 embedded-engineer");
});

test("positions under biopharma-rd and mechanical-quality resolve to general-rd-quality template", () => {
  // 取两个大类各自第一个细分岗位，验证 resolveRoleSelection 返回正确 templateRoleId
  const biopharmaProfile = {
    targetIndustry: "medical-health",
    targetCategory: "biopharma-rd",
    targetSubcategory: "biopharma-rd-01",
  };
  const biopharmaResolved = resolveRoleSelection(biopharmaProfile);
  assert.equal(
    biopharmaResolved.templateRoleId,
    "general-rd-quality",
    `biopharma-rd-01 应路由到 general-rd-quality，实际：${biopharmaResolved.templateRoleId}`,
  );

  const mechanicalProfile = {
    targetIndustry: "manufacturing-automation",
    targetCategory: "mechanical-quality",
    targetSubcategory: "mechanical-quality-01",
  };
  const mechanicalResolved = resolveRoleSelection(mechanicalProfile);
  assert.equal(
    mechanicalResolved.templateRoleId,
    "general-rd-quality",
    `mechanical-quality-01 应路由到 general-rd-quality，实际：${mechanicalResolved.templateRoleId}`,
  );
});
