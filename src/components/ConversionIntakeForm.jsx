import { useMemo, useState } from "react";
import { Link } from "react-router-dom";
import SectionCard from "./SectionCard.jsx";
import { roles } from "../data/roles.js";
import { getActiveAssessmentResult, getActiveProfile } from "../services/mockDatabase.js";
import { getLeadDestinationLabel, getLeadStatusCopy, submitLeadForm } from "../services/leadSubmission.js";

const gradeOptions = [
  { value: "freshman", label: "大一" },
  { value: "sophomore", label: "大二" },
  { value: "junior", label: "大三" },
  { value: "senior", label: "大四" },
  { value: "graduate", label: "研究生" },
  { value: "graduated", label: "已毕业" },
];

const overseasIntentOptions = [
  { value: "yes", label: "有明确留学意向" },
  { value: "maybe", label: "在考虑中" },
  { value: "no", label: "暂时没有" },
];

const resumeStatusOptions = [
  { value: "no_resume", label: "还没有简历" },
  { value: "draft_resume", label: "已有简历初稿" },
  { value: "applied_resume", label: "已经投递过" },
];

function Field({ label, required = false, children, hint, error }) {
  return (
    <div className="form-group">
      <label className="form-label">
        {label}
        {required ? " *" : ""}
      </label>
      {children}
      {hint ? <div className="field-hint">{hint}</div> : null}
      {error ? <div className="form-error">{error}</div> : null}
    </div>
  );
}

export default function ConversionIntakeForm({
  title,
  kicker = "提交信息",
  formType,
  submitLabel,
  successTitle,
  successDescription,
  successNextSteps = [],
  sourcePage,
  sourceLabel,
  defaultRoleId = "",
  questionLabel = "当前最想解决的问题",
  questionPlaceholder = "例如：我最想知道自己下一步该先补课程、实习还是留学路径。",
  showOverseasIntent = false,
  showResumeStatus = false,
  showTimePreference = false,
  showCompanyType = false,
}) {
  const activeProfile = getActiveProfile();
  const activeAssessment = getActiveAssessmentResult();
  const [submitted, setSubmitted] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errors, setErrors] = useState({});
  const [submitError, setSubmitError] = useState("");
  const [form, setForm] = useState({
    name: "",
    contact: "",
    currentYear: "",
    targetRole: defaultRoleId || activeProfile?.targetRole || "",
    overseasIntent: showOverseasIntent ? "maybe" : "maybe",
    resumeStatus: showResumeStatus ? activeProfile?.resumeStage || "draft_resume" : "",
    question: "",
    timePreference: showTimePreference ? "weekday_evening" : "",
    companyType: showCompanyType ? "互联网 / 平台型公司" : "",
  });

  const selectedRoleName = useMemo(
    () => roles.find((item) => item.id === form.targetRole)?.name ?? "该岗位",
    [form.targetRole],
  );

  function updateField(key, value) {
    setForm((current) => ({ ...current, [key]: value }));
    setErrors((current) => ({ ...current, [key]: undefined }));
  }

  async function handleSubmit(event) {
    event.preventDefault();
    const nextErrors = {};

    if (!form.name.trim()) nextErrors.name = "请填写称呼";
    if (!form.contact.trim()) nextErrors.contact = "请填写联系方式";
    if (!form.currentYear) nextErrors.currentYear = "请选择当前年级";
    if (!form.targetRole) nextErrors.targetRole = "请选择目标岗位";
    if (!form.question.trim()) nextErrors.question = "请补充当前最想解决的问题";

    if (Object.keys(nextErrors).length > 0) {
      setErrors(nextErrors);
      return;
    }

    setIsSubmitting(true);
    setSubmitError("");

    try {
      const result = await submitLeadForm({
        formType,
        sourcePage,
        sourceUrl: sourcePage,
        profile: activeProfile,
        assessment: activeAssessment,
        form,
      });

      setSubmitted({
        result,
        form,
      });
    } catch (error) {
      setSubmitError(error instanceof Error ? error.message : "提交失败，请稍后再试。");
    } finally {
      setIsSubmitting(false);
    }
  }

  if (submitted) {
    return (
      <SectionCard title={successTitle} kicker="已提交">
        <p className="muted-text" style={{ lineHeight: 1.9 }}>
          {successDescription}
        </p>
        <p className="muted-text" style={{ lineHeight: 1.8, marginTop: 10 }}>
          {getLeadStatusCopy(submitted.result)}
        </p>
        <div style={{ display: "grid", gap: 12, marginTop: 12 }}>
          <div className="inline-panel">
            <span>目标岗位</span>
            <strong>{roles.find((item) => item.id === submitted.form.targetRole)?.name ?? submitted.form.targetRole}</strong>
          </div>
          <div className="inline-panel">
            <span>联系方式</span>
            <strong>{submitted.form.contact}</strong>
          </div>
          <div className="inline-panel">
            <span>来源页面</span>
            <strong>{sourceLabel}</strong>
          </div>
          <div className="inline-panel">
            <span>数据去向</span>
            <strong>{getLeadDestinationLabel(submitted.result)}</strong>
          </div>
        </div>
        {successNextSteps.length > 0 ? (
          <>
            <h3 style={{ marginTop: 18 }}>接下来会发生什么</h3>
            <ul className="plain-list">
              {successNextSteps.map((item) => (
                <li key={item}>{item}</li>
              ))}
            </ul>
          </>
        ) : null}
        <div className="button-row" style={{ marginTop: 16 }}>
          <Link className="primary-button" to="/">
            返回 Demo 入口
          </Link>
          <Link className="ghost-button ghost-link-button" to="/start">
            回到正式流程
          </Link>
        </div>
      </SectionCard>
    );
  }

  return (
    <SectionCard title={title} kicker={kicker}>
      <form onSubmit={handleSubmit}>
        <Field label="姓名 / 称呼" required error={errors.name}>
          <input
            className="form-control"
            type="text"
            placeholder="例如：王同学"
            value={form.name}
            onChange={(event) => updateField("name", event.target.value)}
          />
        </Field>

        <Field label="微信 / 联系方式" required hint="仅用于后续对接与发送资料。" error={errors.contact}>
          <input
            className="form-control"
            type="text"
            placeholder="例如：微信号 / 手机号"
            value={form.contact}
            onChange={(event) => updateField("contact", event.target.value)}
          />
        </Field>

        <Field label="当前年级" required error={errors.currentYear}>
          <select
            className="form-control"
            value={form.currentYear}
            onChange={(event) => updateField("currentYear", event.target.value)}
          >
            <option value="">请选择</option>
            {gradeOptions.map((item) => (
              <option key={item.value} value={item.value}>
                {item.label}
              </option>
            ))}
          </select>
        </Field>

        <Field label="目标岗位" required error={errors.targetRole}>
          <select
            className="form-control"
            value={form.targetRole}
            onChange={(event) => updateField("targetRole", event.target.value)}
          >
            <option value="">请选择</option>
            {roles.map((item) => (
              <option key={item.id} value={item.id}>
                {item.name}
              </option>
            ))}
          </select>
        </Field>

        {showOverseasIntent ? (
          <Field label="是否有留学意向">
            <select
              className="form-control"
              value={form.overseasIntent}
              onChange={(event) => updateField("overseasIntent", event.target.value)}
            >
              {overseasIntentOptions.map((item) => (
                <option key={item.value} value={item.value}>
                  {item.label}
                </option>
              ))}
            </select>
          </Field>
        ) : null}

        {showResumeStatus ? (
          <Field label="当前简历状态">
            <select
              className="form-control"
              value={form.resumeStatus}
              onChange={(event) => updateField("resumeStatus", event.target.value)}
            >
              {resumeStatusOptions.map((item) => (
                <option key={item.value} value={item.value}>
                  {item.label}
                </option>
              ))}
            </select>
          </Field>
        ) : null}

        {showTimePreference ? (
          <Field label="更方便沟通的时间">
            <select
              className="form-control"
              value={form.timePreference}
              onChange={(event) => updateField("timePreference", event.target.value)}
            >
              <option value="weekday_evening">工作日晚上</option>
              <option value="weekday_daytime">工作日白天</option>
              <option value="weekend">周末</option>
              <option value="flexible">都可以</option>
            </select>
          </Field>
        ) : null}

        {showCompanyType ? (
          <Field label="更想对标的公司类型">
            <select
              className="form-control"
              value={form.companyType}
              onChange={(event) => updateField("companyType", event.target.value)}
            >
              <option value="互联网 / 平台型公司">互联网 / 平台型公司</option>
              <option value="咨询公司 / 战略项目组">咨询公司 / 战略项目组</option>
              <option value="消费 / 品牌公司">消费 / 品牌公司</option>
              <option value="国企 / 金融 / 专业服务">国企 / 金融 / 专业服务</option>
              <option value="暂未确定">暂未确定</option>
            </select>
          </Field>
        ) : null}

        <Field label={questionLabel} required error={errors.question}>
          <textarea
            className="form-control"
            rows="5"
            placeholder={questionPlaceholder}
            value={form.question}
            onChange={(event) => updateField("question", event.target.value)}
          />
        </Field>

        <div style={{ padding: 14, borderRadius: 14, background: "var(--surface-2)", marginBottom: 16 }}>
          <div className="form-label" style={{ marginBottom: 6 }}>当前对接信息</div>
          <div style={{ fontSize: 14, color: "var(--text-2)", lineHeight: 1.8 }}>
            当前将按 <strong>{selectedRoleName}</strong> 方向承接。
            {sourceLabel ? ` 你是从「${sourceLabel}」进入本页。` : ""}
          </div>
        </div>

        {submitError ? (
          <div className="form-error" style={{ marginBottom: 16 }}>
            {submitError}
          </div>
        ) : null}

        <div className="button-row">
          <button className="primary-button" type="submit" disabled={isSubmitting}>
            {isSubmitting ? "提交中..." : submitLabel}
          </button>
          <Link className="ghost-button ghost-link-button" to="/">
            稍后再说
          </Link>
        </div>
      </form>
    </SectionCard>
  );
}
