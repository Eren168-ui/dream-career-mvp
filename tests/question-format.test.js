import test from "node:test";
import assert from "node:assert/strict";

import { getQuestionSetForRole } from "../src/lib/assessment.js";

function getDimensionOrder(questions) {
  const order = [];
  questions.forEach((item) => {
    if (!order.includes(item.dimension)) {
      order.push(item.dimension);
    }
  });
  return order;
}

test("product-manager mixes scenario choice questions and scale questions by dimension bucket", () => {
  const questionSet = getQuestionSetForRole("product-manager");

  const jobRequirementQuestion = questionSet.questions.find((item) => item.dimension === "job_requirements");
  const dailyOperationsQuestion = questionSet.questions.find((item) => item.dimension === "daily_operations");
  const workplaceRelationQuestion = questionSet.questions.find((item) => item.dimension === "workplace_relations");

  assert.ok(jobRequirementQuestion, "缺少岗位要求题");
  assert.ok(dailyOperationsQuestion, "缺少日常事务题");
  assert.ok(workplaceRelationQuestion, "缺少职场关系题");

  assert.notEqual(jobRequirementQuestion.options[0].label, "很少符合");
  assert.equal(dailyOperationsQuestion.options[0].label, "很少符合");
  assert.notEqual(workplaceRelationQuestion.options[0].label, "很少符合");
});

test("all active roles keep dimensions 1/2/3/6 as scenario choices and 4/5/7 as scale questions", () => {
  const roleIds = [
    "product-manager",
    "marketing",
    "account-manager",
    "ai-algorithm-engineer",
    "embedded-engineer",
    "strategy-consulting",
    "strategy-operations",
    "audit",
    "finance",
    "data-analyst",
  ];

  for (const roleId of roleIds) {
    const questionSet = getQuestionSetForRole(roleId);
    const order = getDimensionOrder(questionSet.questions);
    const scenarioDimensions = new Set([order[0], order[1], order[2], order[5]].filter(Boolean));

    questionSet.questions.forEach((item) => {
      if (scenarioDimensions.has(item.dimension)) {
        assert.equal(item.type, "scenario-choice", `${roleId}:${item.id} 应为选择题`);
        assert.match(item.options[0].label, /^[A-D]\./u, `${roleId}:${item.id} 选择题文案不对`);
        return;
      }

      assert.equal(item.type, "scale", `${roleId}:${item.id} 应为程度题`);
      assert.equal(item.options[0].label, "很少符合", `${roleId}:${item.id} 程度题选项被错误替换`);
    });
  }
});

test("active question sets prepend explicit scenario framing and explain hard terms inline", () => {
  const roleIds = [
    "product-manager",
    "marketing",
    "account-manager",
    "ai-algorithm-engineer",
    "embedded-engineer",
    "strategy-consulting",
    "strategy-operations",
    "audit",
    "finance",
    "data-analyst",
  ];

  for (const roleId of roleIds) {
    const questionSet = getQuestionSetForRole(roleId);
    questionSet.questions.forEach((item) => {
      assert.match(item.prompt, /^场景：/u, `${roleId}:${item.id} 缺少场景前缀`);
    });
  }

  const productManagerSet = getQuestionSetForRole("product-manager");
  const pmJr1 = productManagerSet.questions.find((item) => item.id === "pm-jr1");
  const pmJr2 = productManagerSet.questions.find((item) => item.id === "pm-jr2");
  const pmWr2 = productManagerSet.questions.find((item) => item.id === "pm-wr2");

  assert.match(pmJr1.prompt, /竞品（/u);
  assert.match(pmJr2.prompt, /边界（/u);
  assert.match(pmWr2.prompt, /优先级（/u);
  assert.match(pmWr2.prompt, /资源问题（/u);
});

test("general-rd-quality template has exactly 20 questions with correct format and no embedded-engineer jargon", () => {
  const questionSet = getQuestionSetForRole("general-rd-quality");

  // 题量恰好为 20
  assert.equal(questionSet.questions.length, 20, `general-rd-quality 题量应为 20，实际：${questionSet.questions.length}`);

  // 全部以「场景：」开头
  questionSet.questions.forEach((item) => {
    assert.match(item.prompt, /^场景：/u, `general-rd-quality:${item.id} 缺少场景前缀`);
  });

  // 5 个维度各恰好 4 道题
  const dimCounts = {};
  questionSet.questions.forEach((item) => {
    dimCounts[item.dimension] = (dimCounts[item.dimension] ?? 0) + 1;
  });
  const expectedDimensions = [
    "experiment_protocol",
    "record_documentation",
    "quality_compliance",
    "cross_role_collab",
    "detail_troubleshooting",
  ];
  expectedDimensions.forEach((dim) => {
    assert.equal(dimCounts[dim], 4, `维度 ${dim} 题目数应为 4，实际：${dimCounts[dim] ?? 0}`);
  });

  // 不含嵌入式专属术语
  const embeddedJargon = /JTAG|MCU|寄存器|固件|firmware|单片机|RTOS|驱动程序/iu;
  questionSet.questions.forEach((item) => {
    assert.doesNotMatch(
      item.prompt,
      embeddedJargon,
      `general-rd-quality:${item.id} 含有嵌入式专属术语`,
    );
  });
});
