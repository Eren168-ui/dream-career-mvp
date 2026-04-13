import test from "node:test";
import assert from "node:assert/strict";

import { saveLeadCapture } from "../src/services/mockDatabase.js";

test("saveLeadCapture persists local mock lead records for follow-up", () => {
  const record = saveLeadCapture({
    profileId: "profile-demo",
    assessmentId: "assessment-demo",
    sourcePage: "/resume-upgrade",
    contact: "wechat: eren-demo",
  });

  assert.equal(record.profileId, "profile-demo");
  assert.equal(record.assessmentId, "assessment-demo");
  assert.equal(record.sourcePage, "/resume-upgrade");
  assert.equal(record.contact, "wechat: eren-demo");
  assert.ok(record.id.startsWith("lead-"));
});
