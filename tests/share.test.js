import test from "node:test";
import assert from "node:assert/strict";

import { buildResultShareSvg } from "../src/lib/share.js";

test("buildResultShareSvg outputs result image markup without per-question details", () => {
  const svg = buildResultShareSvg({
    profile: {
      majorName: "信息管理与信息系统",
      targetCompany: "字节跳动",
    },
    result: {
      roleName: "产品经理",
      fitLabel: "潜力明显",
      score: 72,
      dimensionRanking: [
        { label: "问题拆解", score: 88, level: "优势项" },
        { label: "沟通协同", score: 75, level: "可发展" },
      ],
    },
  });

  assert.match(svg, /产品经理/);
  assert.match(svg, /潜力明显/);
  assert.match(svg, /问题拆解/);
  assert.match(svg, /优势项/);
  assert.doesNotMatch(svg, /Q1|逐题|correct/i);
});
