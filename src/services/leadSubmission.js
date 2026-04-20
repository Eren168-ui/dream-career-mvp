import { roles } from "../data/roles.js";
import { getRoleDisplayName } from "../data/roleSystem.js";
import { LEAD_CAPTURE_STORAGE_KEY, saveLeadCapture } from "./mockDatabase.js";

function trimValue(value) {
  return String(value ?? "").trim();
}

function resolveRoleName(roleId, profile = null) {
  return getRoleDisplayName(profile ?? {}) || (roles.find((item) => item.id === roleId)?.name ?? roleId ?? "未指定岗位");
}

function normalizeLeadType(formType) {
  if (formType === "resume-cases") return "case";
  if (formType === "resume-diagnosis-bridge") return "diagnosis";
  return trimValue(formType);
}

function normalizeGrade(grade) {
  const value = trimValue(grade);

  switch (value) {
    case "freshman":
    case "sophomore":
    case "junior":
    case "senior":
    case "graduate":
    case "graduated":
      return value;
    case "master":
      return "graduate";
    default:
      return "graduate";
  }
}

function normalizeOverseasIntent(intent) {
  const value = trimValue(intent);

  switch (value) {
    case "yes":
    case "no":
    case "maybe":
      return value;
    case "considering":
      return "maybe";
    default:
      return "maybe";
  }
}

function resolveAssessmentScore(assessment) {
  const score = Number(assessment?.fitScore ?? assessment?.score ?? 0);
  return Number.isFinite(score) ? score : 0;
}

function resolveSourceUrl(sourceUrl, currentUrl) {
  const preferred = trimValue(sourceUrl);
  const runtimeUrl = trimValue(currentUrl)
    || (typeof window !== "undefined" ? trimValue(window.location?.href) : "");

  if (!preferred) {
    return runtimeUrl;
  }

  if (runtimeUrl) {
    try {
      const runtime = new URL(runtimeUrl);
      const resolvedPath = new URL(preferred, runtime.origin).pathname;

      if (runtime.pathname === resolvedPath) {
        return runtime.toString();
      }
    } catch {
      // Ignore runtime URL parsing errors and fall through to standard resolution.
    }
  }

  try {
    return new URL(preferred, runtimeUrl || "https://placeholder.local").toString();
  } catch {
    return preferred;
  }
}

function buildExtraPayload(type, form, roleId) {
  if (type === "consultation") {
    return {
      time_preference: trimValue(form?.timePreference) || "unspecified",
      consult_topic: trimValue(form?.consultTopic) || trimValue(form?.question),
    };
  }

  if (type === "case") {
    return {
      case_matched: trimValue(form?.caseMatched) || `same-role:${roleId}`,
    };
  }

  return {
    company_type: trimValue(form?.companyType) || "未指定",
    resume_stage: trimValue(form?.resumeStatus) || "draft_resume",
    diagnosis_focus: trimValue(form?.diagnosisFocus) || trimValue(form?.question),
    resume_file_url: trimValue(form?.resumeFileUrl),
  };
}

function buildExtraSummary(type, extra) {
  if (type === "consultation") {
    return `咨询主题：${extra.consult_topic || "未填写"}；时间偏好：${extra.time_preference || "未填写"}`;
  }

  if (type === "case") {
    return `案例匹配：${extra.case_matched || "未填写"}`;
  }

  return `公司类型：${extra.company_type || "未填写"}；简历阶段：${extra.resume_stage || "未填写"}；诊断重点：${extra.diagnosis_focus || "未填写"}`;
}

export function normalizeLeadSubmissionConfig(env) {
  const sourceEnv = env ?? (typeof import.meta !== "undefined" ? import.meta.env ?? {} : {});

  return {
    webhookUrl: trimValue(sourceEnv.VITE_LEAD_WEBHOOK_URL),
    notificationWebhookUrl: trimValue(sourceEnv.VITE_LEAD_NOTIFICATION_WEBHOOK_URL),
  };
}

export function getLeadSubmissionMode(config = normalizeLeadSubmissionConfig()) {
  return config.webhookUrl ? "webhook" : "mock";
}

export function buildLeadSubmissionPayload(
  {
    formType,
    sourcePage,
    sourceUrl,
    profile,
    assessment,
    form,
  },
  options = {},
) {
  const type = normalizeLeadType(formType);
  const roleId = trimValue(form?.targetRole) || trimValue(profile?.targetRole);
  const roleName = resolveRoleName(roleId, profile);
  const extra = buildExtraPayload(type, form, roleId);

  return {
    type,
    name: trimValue(form?.name),
    wechat: trimValue(form?.contact),
    role_id: roleId,
    role_name: roleName,
    grade: normalizeGrade(form?.currentYear),
    overseas_intent: normalizeOverseasIntent(form?.overseasIntent),
    assessment_score: resolveAssessmentScore(assessment),
    assessment_label: trimValue(assessment?.fitLabel ?? assessment?.label),
    note: trimValue(form?.question),
    submitted_at: new Date().toISOString(),
    source_url: resolveSourceUrl(sourceUrl ?? sourcePage, options.currentUrl),
    extra,
  };
}

export function buildLeadNotificationPayload(payload) {
  return {
    type: payload.type,
    name: payload.name,
    wechat: payload.wechat,
    role_name: payload.role_name,
    grade: payload.grade,
    overseas_intent: payload.overseas_intent,
    assessment_score: payload.assessment_score,
    assessment_label: payload.assessment_label,
    submitted_at: payload.submitted_at,
    extra_summary: buildExtraSummary(payload.type, payload.extra ?? {}),
  };
}

async function postJson(url, payload, fetchImpl) {
  const response = await fetchImpl(url, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(payload),
  });

  if (!response?.ok) {
    throw new Error(`Webhook request failed with status ${response?.status ?? "unknown"}`);
  }

  return {
    status: response.status,
  };
}

function warnLeadSubmission(message, context = {}) {
  console.warn(`[lead-submission] ${message}`, context);
}

export function getLeadDestinationLabel() {
  return "顾问跟进池";
}

export function getLeadStatusCopy(result) {
  if (result.mode === "webhook") {
    return "信息已提交成功，后续会按你留下的联系方式继续跟进。";
  }

  return "信息已提交成功，后续会按你留下的联系方式继续跟进。";
}

export async function submitLeadForm(params, options = {}) {
  const config = options.config ?? normalizeLeadSubmissionConfig();
  const fetchImpl = options.fetchImpl ?? globalThis.fetch?.bind(globalThis);
  const payload = buildLeadSubmissionPayload(params, options);
  const submissionMode = getLeadSubmissionMode(config);
  const localRecord = saveLeadCapture({
    profileId: params.profile?.id ?? null,
    assessmentId: params.assessment?.id ?? null,
    sourcePage: trimValue(params.sourceUrl ?? params.sourcePage),
    contact: payload.wechat,
    name: payload.name,
    targetRole: payload.role_id,
    currentYear: payload.grade,
    question: payload.note,
    formType: payload.type,
    deliveryMode: submissionMode,
    remoteStatus: submissionMode === "webhook" ? "pending" : "mock",
    notificationStatus: config.notificationWebhookUrl ? "pending" : "disabled",
    payload,
  });

  if (submissionMode === "mock") {
    warnLeadSubmission("Webhook not configured, using local fallback storage.", {
      storageKey: LEAD_CAPTURE_STORAGE_KEY,
      type: payload.type,
    });

    return {
      mode: "mock",
      payload,
      localRecord,
      remoteResult: null,
      notificationResult: null,
    };
  }

  if (!fetchImpl) {
    warnLeadSubmission("Fetch is unavailable, using local fallback storage.", {
      storageKey: LEAD_CAPTURE_STORAGE_KEY,
      type: payload.type,
    });

    return {
      mode: "fallback",
      payload,
      localRecord,
      remoteResult: null,
      notificationResult: null,
      error: new Error("No fetch implementation available"),
    };
  }

  try {
    const remoteResult = await postJson(config.webhookUrl, payload, fetchImpl);
    let notificationResult = null;

    if (config.notificationWebhookUrl) {
      try {
        notificationResult = await postJson(
          config.notificationWebhookUrl,
          buildLeadNotificationPayload(payload),
          fetchImpl,
        );
      } catch (error) {
        warnLeadSubmission("Notification webhook failed but lead submission has been accepted.", {
          type: payload.type,
          error: error instanceof Error ? error.message : String(error),
        });
      }
    }

    return {
      mode: "webhook",
      payload,
      localRecord,
      remoteResult,
      notificationResult,
    };
  } catch (error) {
    warnLeadSubmission("Lead webhook failed, falling back to local storage.", {
      storageKey: LEAD_CAPTURE_STORAGE_KEY,
      type: payload.type,
      error: error instanceof Error ? error.message : String(error),
    });

    return {
      mode: "fallback",
      payload,
      localRecord,
      remoteResult: null,
      notificationResult: null,
      error,
    };
  }
}
