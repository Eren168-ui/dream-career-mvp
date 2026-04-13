import test from "node:test";
import assert from "node:assert/strict";

import { demoSessions } from "../src/data/demoSessions.js";
import { questionSets } from "../src/data/questionSets.js";
import { buildAssessmentResult } from "../src/lib/assessment.js";
import { buildResumeDiagnosisReport } from "../src/lib/reporting.js";
import { roleSubcategories, roles } from "../src/data/roles.js";

test("demo sessions cover all active roles for MVP presentation", () => {
  const roleIds = new Set(roles.map((item) => item.id));
  const demoRoleIds = new Set(demoSessions.map((item) => item.profile.targetRole));

  assert.equal(demoSessions.length, roles.length);
  assert.deepEqual(demoRoleIds, roleIds);
});

test("role subcategories keep explicit role references", () => {
  const validRoleIds = new Set(roles.map((item) => item.id));

  assert.ok(roleSubcategories.length >= roles.length);

  roleSubcategories.forEach((item) => {
    assert.equal(typeof item.id, "string");
    assert.ok(item.id.length > 0);
    assert.equal(typeof item.roleId, "string");
    assert.ok(validRoleIds.has(item.roleId), `invalid roleId for subcategory: ${item.id}`);
    assert.equal(typeof item.name, "string");
    assert.ok(item.name.length > 0);
  });
});

test("every demo can generate a complete result and report without crashing", () => {
  demoSessions.forEach((demo) => {
    const questionSet = questionSets.find((item) => item.roleId === demo.profile.targetRole);

    assert.ok(questionSet, `missing question set for demo ${demo.id}`);

    const result = buildAssessmentResult({
      profile: demo.profile,
      answers: demo.answers,
    });
    const report = buildResumeDiagnosisReport({
      profile: demo.profile,
      assessmentResult: result,
    });

    assert.equal(result.roleId, demo.profile.targetRole);
    assert.ok(result.dimensionRanking.length > 0);
    assert.ok(result.modules.actionGuide.nextSteps.length > 0);
    assert.equal(report.roleId, demo.profile.targetRole);
    assert.ok(report.currentResumeIssues.length > 0);
    assert.ok(report.targetRoleRequirements.length > 0);
    assert.ok(report.nextActions.length > 0);
  });
});
