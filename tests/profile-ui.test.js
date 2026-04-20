import test from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";

const roleCascadeSource = readFileSync(
  new URL("../src/components/RoleCascadeField.jsx", import.meta.url),
  "utf8",
);

test("role setup cards hide internal recommendation explanations from users", () => {
  const removedCopy = [
    "按行业 → 岗位大类 → 细分岗位逐层锁定目标",
    "先选你主要想进入的赛道",
    "该大类当前收录",
    "结果页会更贴近这个岗位给出行动建议与公司推荐",
    "本次 MVP 每次只支持测 1 个岗位方向",
    "根据你选择的岗位智能推荐公司",
    "先选理想岗位，再看推荐公司",
    "岗位联动后展示",
    "优先名企 / 民企",
    "不填也可继续",
    "结果页个性化展示",
    "选填，仅用于结果页和报告页个性化展示",
  ];

  removedCopy.forEach((snippet) => {
    assert.doesNotMatch(roleCascadeSource, new RegExp(snippet.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")));
  });

  assert.match(roleCascadeSource, /可选填写，方便结果页更贴近你的目标方向/);
});
