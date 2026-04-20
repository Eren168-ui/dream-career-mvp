import test from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";

const css = readFileSync(new URL("../src/styles/main.css", import.meta.url), "utf8");

test("mobile profile forms collapse grid layouts into a single-column stack", () => {
  assert.match(css, /@media\s*\(max-width:\s*680px\)/);
  assert.match(css, /\.form-grid\s*\{\s*display:\s*flex;[\s\S]*?flex-direction:\s*column;/);
  assert.match(css, /\.profile-goal-grid,\s*\.profile-school-row\s*\{[\s\S]*?flex-direction:\s*column;/);
  assert.match(css, /\.profile-submit-btn,\s*\.profile-secondary-btn\s*\{[\s\S]*?width:\s*100%/);
});
