import test from "node:test";
import assert from "node:assert/strict";

import { demoSessions } from "../src/data/demoSessions.js";
import { questionSets } from "../src/data/questionSets.js";
import { resultTemplates } from "../src/data/resultTemplates.js";
import { ROLE_PROFILES } from "../src/data/roleProfiles.js";
import { buildAssessmentResult } from "../src/lib/assessment.js";

test("all role question sets are expanded to 30+ Likert questions with unique ids", () => {
  questionSets.forEach((questionSet) => {
    assert.ok(questionSet.questions.length >= 30, `${questionSet.roleId} should have at least 30 questions`);
    assert.ok(questionSet.questions.length <= 40, `${questionSet.roleId} should have at most 40 questions`);

    const seenIds = new Set();
    questionSet.questions.forEach((item) => {
      assert.equal(typeof item.dimension, "string");
      assert.ok(item.dimension.length > 0);
      assert.ok(item.id.length > 0, `question id should not be empty for ${questionSet.roleId}`);
      assert.ok(!seenIds.has(item.id), `duplicate question id ${item.id} in ${questionSet.roleId}`);
      seenIds.add(item.id);
      assert.equal(item.options.length, 4);
    });
  });
});

test("result templates expose structured requirements and overseas paths for all roles", () => {
  Object.entries(resultTemplates).forEach(([roleId, template]) => {
    assert.ok(template.reality.length >= 3, `${roleId} needs richer reality content`);
    assert.ok(template.requirements.length >= 3, `${roleId} needs structured requirements`);
    assert.ok(template.studyPlan.length >= 3, `${roleId} needs thicker study plan`);
    assert.equal(typeof template.internshipPlan, "object");

    ["no_resume", "draft_resume", "applied_resume"].forEach((resumeStage) => {
      assert.ok(Array.isArray(template.internshipPlan[resumeStage]), `${roleId} missing internship plan for ${resumeStage}`);
      assert.ok(template.internshipPlan[resumeStage].length > 0, `${roleId} empty internship plan for ${resumeStage}`);
    });

    template.requirements.forEach((item) => {
      assert.equal(typeof item.category, "string");
      assert.equal(typeof item.requirement, "string");
      assert.ok(item.category.length > 0);
      assert.ok(item.requirement.length > 0);
    });

    assert.equal(template.overseas.length, 3, `${roleId} should expose three overseas routes`);
    assert.deepEqual(
      template.overseas.map((item) => item.path),
      ["美国", "英国", "香港 / 新加坡"],
      `${roleId} overseas routes should follow 美国/英国/香港 / 新加坡`,
    );
  });
});

test("role profiles align gap dimensions with question dimensions and include richer cases", () => {
  Object.entries(ROLE_PROFILES).forEach(([roleId, profile]) => {
    const questionSet = questionSets.find((item) => item.roleId === roleId);
    assert.ok(questionSet, `missing question set for ${roleId}`);

    const questionDimensions = new Set(questionSet.questions.map((item) => item.dimension));

    assert.ok(profile.gapDimensions.length >= 4, `${roleId} should expose aligned gap dimensions`);
    profile.gapDimensions.forEach((item) => {
      assert.ok(questionDimensions.has(item.dimension), `${roleId} gap dimension not aligned: ${item.dimension}`);
      assert.equal(typeof item.label, "string");
      assert.equal(typeof item.description, "string");
    });

    assert.ok(profile.successCases.length >= 2, `${roleId} should expose 2-3 success cases`);
    profile.successCases.forEach((item) => {
      assert.equal(typeof item.background, "string");
      assert.equal(typeof item.keyMove, "string");
      assert.equal(typeof item.lesson, "string");
      assert.ok(item.background.length > 0);
      assert.ok(item.keyMove.length > 0);
      assert.ok(item.lesson.length > 0);
    });
  });
});

test("demo sessions cover all three fit labels after answer expansion", () => {
  const fitLabels = new Set(
    demoSessions.map((demo) =>
      buildAssessmentResult({
        profile: demo.profile,
        answers: demo.answers,
      }).fitLabel,
    ),
  );

  assert.deepEqual(fitLabels, new Set(["匹配度较高", "潜力明显", "需要补足"]));
});
