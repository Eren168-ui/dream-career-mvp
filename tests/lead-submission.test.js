import test from "node:test";
import assert from "node:assert/strict";

import { buildLeadSubmissionPayload, getLeadSubmissionMode, submitLeadForm } from "../src/services/leadSubmission.js";

test("buildLeadSubmissionPayload follows the unified real webhook schema", () => {
  const payload = buildLeadSubmissionPayload({
    formType: "consultation",
    sourcePage: "/result",
    sourceLabel: "岗位匹配度分析结果页",
    profile: {
      id: "profile-demo",
      targetRole: "data-analyst",
      targetCompany: "字节跳动",
    },
    assessment: {
      id: "assessment-demo",
      fitScore: 78,
      fitLabel: "潜力明显",
    },
    form: {
      name: "王同学",
      contact: "wechat-demo",
      currentYear: "junior",
      targetRole: "data-analyst",
      overseasIntent: "maybe",
      resumeStatus: "draft_resume",
      question: "想知道下一步是先补实习还是先改简历。",
      timePreference: "weekday_evening",
      consultTopic: "岗位准备优先级",
    },
  }, {
    currentUrl: "https://demo.example.com/result?role=data-analyst",
  });

  assert.equal(payload.type, "consultation");
  assert.equal(payload.name, "王同学");
  assert.equal(payload.wechat, "wechat-demo");
  assert.equal(payload.role_id, "data-analyst");
  assert.equal(payload.role_name, "数据分析");
  assert.equal(payload.grade, "junior");
  assert.equal(payload.overseas_intent, "maybe");
  assert.equal(payload.assessment_score, 78);
  assert.equal(payload.assessment_label, "潜力明显");
  assert.equal(payload.note, "想知道下一步是先补实习还是先改简历。");
  assert.equal(payload.source_url, "https://demo.example.com/result?role=data-analyst");
  assert.equal(payload.extra.time_preference, "weekday_evening");
  assert.equal(payload.extra.consult_topic, "岗位准备优先级");
});

test("getLeadSubmissionMode returns mock when webhook is missing", () => {
  assert.equal(getLeadSubmissionMode({ webhookUrl: "" }), "mock");
  assert.equal(getLeadSubmissionMode({ webhookUrl: "https://example.com/hook" }), "webhook");
});

test("submitLeadForm falls back to local lead pool when webhook is not configured", async () => {
  let fetchCalled = false;

  const result = await submitLeadForm({
    formType: "case",
    sourcePage: "/resume-cases",
    sourceLabel: "差距分析报告页",
    profile: {
      id: "profile-demo",
      targetRole: "product-manager",
    },
    assessment: {
      id: "assessment-demo",
      fitScore: 66,
      fitLabel: "潜力明显",
    },
    form: {
      name: "李同学",
      contact: "wechat-pm",
      currentYear: "senior",
      targetRole: "product-manager",
      overseasIntent: "no",
      question: "想看产品经理案例。",
      caseMatched: "same-role",
    },
  }, {
    config: {
      webhookUrl: "",
      notificationWebhookUrl: "",
    },
    fetchImpl: async () => {
      fetchCalled = true;
      throw new Error("fetch should not be called in mock mode");
    },
  });

  assert.equal(result.mode, "mock");
  assert.equal(fetchCalled, false);
  assert.equal(result.localRecord.contact, "wechat-pm");
  assert.equal(result.localRecord.profileId, "profile-demo");
  assert.equal(result.payload.type, "case");
  assert.equal(result.payload.extra.case_matched, "same-role");
});

test("submitLeadForm posts payload to webhook when external collection is configured", async () => {
  const requests = [];

  const result = await submitLeadForm({
    formType: "diagnosis",
    sourcePage: "/report",
    sourceLabel: "职业准备度评估结果页",
    profile: {
      id: "profile-demo",
      targetRole: "strategy-consulting",
    },
    assessment: {
      id: "assessment-demo",
      fitScore: 54,
      fitLabel: "需要补足",
    },
    form: {
      name: "周同学",
      contact: "wechat-sc",
      currentYear: "graduate",
      targetRole: "strategy-consulting",
      overseasIntent: "yes",
      resumeStatus: "applied_resume",
      question: "想知道简历里咨询案例应该怎么讲。",
      companyType: "咨询公司 / 战略项目组",
      diagnosisFocus: "项目经历改写",
      resumeFileUrl: "",
    },
  }, {
    config: {
      webhookUrl: "https://example.com/lead-webhook",
      notificationWebhookUrl: "https://example.com/notify-webhook",
    },
    fetchImpl: async (url, options) => {
      requests.push({ url, options });
      return {
        ok: true,
        status: 200,
      };
    },
  });

  assert.equal(result.mode, "webhook");
  assert.equal(requests.length, 2);
  assert.equal(requests[0].url, "https://example.com/lead-webhook");
  assert.equal(requests[1].url, "https://example.com/notify-webhook");

  const firstPayload = JSON.parse(requests[0].options.body);
  assert.equal(firstPayload.type, "diagnosis");
  assert.equal(firstPayload.wechat, "wechat-sc");
  assert.equal(firstPayload.assessment_label, "需要补足");
  assert.equal(firstPayload.extra.resume_stage, "applied_resume");
  assert.equal(firstPayload.extra.company_type, "咨询公司 / 战略项目组");

  const notificationPayload = JSON.parse(requests[1].options.body);
  assert.equal(notificationPayload.type, "diagnosis");
  assert.match(notificationPayload.extra_summary, /项目经历改写/);
});
