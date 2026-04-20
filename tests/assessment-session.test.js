import test from "node:test";
import assert from "node:assert/strict";

import { filterAnswersForQuestionSet, countAnsweredQuestions } from "../src/lib/assessmentSession.js";
import { getQuestionSetForRole } from "../src/lib/assessment.js";

test("assessment session only keeps answers that belong to the current question set", () => {
  const questionSet = getQuestionSetForRole("product-manager");
  const answers = {
    "pm-jr1": "often",
    "pm-jr2": "always",
    "legacy-x": "always",
    "sc-sp1": "rarely",
  };

  assert.deepEqual(filterAnswersForQuestionSet(questionSet, answers), {
    "pm-jr1": "often",
    "pm-jr2": "always",
  });
});

test("answered count only depends on visible questions in the current set", () => {
  const questionSet = getQuestionSetForRole("product-manager");
  const answers = {
    "pm-jr1": "often",
    "pm-jr2": "always",
    "legacy-x": "always",
    "sc-sp1": "rarely",
  };

  assert.equal(countAnsweredQuestions(questionSet, answers), 2);
});
