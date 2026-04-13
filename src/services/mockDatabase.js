import { demoSessions } from "../data/demoSessions.js";
import { questionSets } from "../data/questionSets.js";
import { resultTemplates } from "../data/resultTemplates.js";
import { roleSubcategories, roles } from "../data/roles.js";
import { buildAssessmentResult } from "../lib/assessment.js";
import { buildResumeDiagnosisReport } from "../lib/reporting.js";
import { normalizeUserProfile } from "../lib/validation.js";
import { readJson, readText, writeJson, writeText } from "./storage.js";

export const LEAD_CAPTURE_STORAGE_KEY = "dream-career:lead_captures";

const STORAGE_KEYS = {
  userProfiles: "dream-career:user_profiles",
  answerRecords: "dream-career:answer_records",
  assessmentResults: "dream-career:assessment_results",
  resumeReports: "dream-career:resume_diagnosis_reports",
  leadCaptures: LEAD_CAPTURE_STORAGE_KEY,
  activeProfileId: "dream-career:active_profile_id",
  activeAssessmentId: "dream-career:active_assessment_id",
  activeReportId: "dream-career:active_report_id",
};

function createId(prefix) {
  if (globalThis.crypto?.randomUUID) {
    return `${prefix}-${globalThis.crypto.randomUUID()}`;
  }

  return `${prefix}-${Date.now()}-${Math.random().toString(16).slice(2)}`;
}

function appendRecord(key, record) {
  const list = readJson(key, []);
  const nextList = [...list, record];
  writeJson(key, nextList);
  return record;
}

export function initializeMockDatabase() {
  readJson(STORAGE_KEYS.userProfiles, []);
  readJson(STORAGE_KEYS.answerRecords, []);
  readJson(STORAGE_KEYS.assessmentResults, []);
  readJson(STORAGE_KEYS.resumeReports, []);
  readJson(STORAGE_KEYS.leadCaptures, []);
}

export function getCatalogSnapshot() {
  return {
    roles,
    role_subcategories: roleSubcategories,
    question_sets: questionSets,
    result_templates: resultTemplates,
  };
}

export function getAllUserProfiles() {
  return readJson(STORAGE_KEYS.userProfiles, []);
}

export function saveUserProfile(profile) {
  const normalized = normalizeUserProfile(profile);
  const record = {
    id: createId("profile"),
    createdAt: new Date().toISOString(),
    ...normalized,
  };

  appendRecord(STORAGE_KEYS.userProfiles, record);
  writeText(STORAGE_KEYS.activeProfileId, record.id);
  return record;
}

export function setActiveProfile(profileId) {
  writeText(STORAGE_KEYS.activeProfileId, profileId);
}

export function getActiveProfile() {
  const activeId = readText(STORAGE_KEYS.activeProfileId);
  if (!activeId) return null;
  return getAllUserProfiles().find((item) => item.id === activeId) ?? null;
}

export function saveAnswerRecord({ profileId, roleId, answers }) {
  const record = {
    id: createId("answers"),
    profileId,
    roleId,
    answers,
    createdAt: new Date().toISOString(),
  };

  appendRecord(STORAGE_KEYS.answerRecords, record);
  return record;
}

export function getLatestAnswerRecord(profileId) {
  return readJson(STORAGE_KEYS.answerRecords, [])
    .filter((item) => item.profileId === profileId)
    .at(-1) ?? null;
}

export function saveAssessmentResult({ profileId, answerRecordId, result }) {
  const record = {
    id: createId("assessment"),
    profileId,
    answerRecordId,
    createdAt: new Date().toISOString(),
    ...result,
  };

  appendRecord(STORAGE_KEYS.assessmentResults, record);
  writeText(STORAGE_KEYS.activeAssessmentId, record.id);
  return record;
}

export function getActiveAssessmentResult() {
  const activeId = readText(STORAGE_KEYS.activeAssessmentId);
  if (!activeId) return null;
  return readJson(STORAGE_KEYS.assessmentResults, []).find((item) => item.id === activeId) ?? null;
}

export function saveResumeDiagnosisReport({ profileId, assessmentId, report }) {
  const record = {
    id: createId("report"),
    profileId,
    assessmentId,
    createdAt: new Date().toISOString(),
    ...report,
  };

  appendRecord(STORAGE_KEYS.resumeReports, record);
  writeText(STORAGE_KEYS.activeReportId, record.id);
  return record;
}

export function getActiveResumeDiagnosisReport() {
  const activeId = readText(STORAGE_KEYS.activeReportId);
  if (!activeId) return null;
  return readJson(STORAGE_KEYS.resumeReports, []).find((item) => item.id === activeId) ?? null;
}

export function saveLeadCapture({
  profileId,
  assessmentId,
  sourcePage,
  contact,
  name = "",
  targetRole = "",
  currentYear = "",
  question = "",
  formType = "",
  deliveryMode = "mock",
  remoteStatus = "",
  notificationStatus = "",
  payload = null,
}) {
  const record = {
    id: createId("lead"),
    profileId,
    assessmentId,
    sourcePage,
    contact: (contact ?? "").trim(),
    name: (name ?? "").trim(),
    targetRole,
    currentYear,
    question: (question ?? "").trim(),
    formType,
    deliveryMode,
    remoteStatus,
    notificationStatus,
    payload,
    createdAt: new Date().toISOString(),
  };

  appendRecord(STORAGE_KEYS.leadCaptures, record);
  return record;
}

export function createDemoSession(demoId) {
  const demo = demoSessions.find((item) => item.id === demoId);
  if (!demo) {
    throw new Error(`Demo session not found: ${demoId}`);
  }

  const profile = saveUserProfile(demo.profile);
  const answerRecord = saveAnswerRecord({
    profileId: profile.id,
    roleId: profile.targetRole,
    answers: demo.answers,
  });
  const result = saveAssessmentResult({
    profileId: profile.id,
    answerRecordId: answerRecord.id,
    result: buildAssessmentResult({
      profile,
      answers: demo.answers,
    }),
  });
  const report = saveResumeDiagnosisReport({
    profileId: profile.id,
    assessmentId: result.id,
    report: buildResumeDiagnosisReport({
      profile,
      assessmentResult: result,
    }),
  });

  return {
    demo,
    profile,
    answerRecord,
    result,
    report,
  };
}
