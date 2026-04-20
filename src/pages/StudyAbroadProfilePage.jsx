import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { studyAbroadProfileFieldDefinitions } from "../data/profileFields.js";
import { createEmptyProfile, validateUserProfile } from "../lib/validation.js";
import { saveUserProfile } from "../services/mockDatabase.js";
import { MajorCascadeField, CityCascadeField } from "../components/ProfileCascades.jsx";
import RoleCascadeField from "../components/RoleCascadeField.jsx";

function FieldError({ message }) {
  if (!message) return null;
  return <p className="field-error">{message}</p>;
}

export default function StudyAbroadProfilePage() {
  const navigate = useNavigate();
  const [form, setForm] = useState(() => ({
    ...createEmptyProfile(studyAbroadProfileFieldDefinitions),
    intent: "study_abroad_resume",
    studyRegion: "overseas",
  }));
  const [errors, setErrors] = useState({});

  function updateField(field, value) {
    setForm((current) => ({ ...current, [field]: value }));
    setErrors((current) => ({ ...current, [field]: undefined }));
  }

  function handleSubmit(event) {
    event.preventDefault();
    const nextErrors = validateUserProfile(form, studyAbroadProfileFieldDefinitions);

    if (!form.targetIndustry) {
      nextErrors.targetIndustry = "请选择行业";
    }
    if (form.targetIndustry && !form.targetCategory) {
      nextErrors.targetRole = "请选择岗位大类";
    }
    if (form.targetCategory && !form.targetSubcategory) {
      nextErrors.targetSubcategory = "请选择细分岗位";
    }

    setErrors(nextErrors);
    if (Object.keys(nextErrors).length > 0) return;

    const saved = saveUserProfile(form);
    navigate("/assessment", { state: { profile: saved } });
  }

  function renderField(field) {
    const value = form[field.key];

    // 级联类型：由 MajorCascadeField / CityCascadeField 统一渲染
    if (field.type === "major-cascade" || field.type === "major-sub") return null;
    if (field.type === "city-cascade") return null;

    if (field.type === "select") {
      return (
        <label key={field.key} className="field">
          <span>{field.label}{field.required ? " *" : ""}</span>
          <select value={value} onChange={(event) => updateField(field.key, event.target.value)}>
            <option value="">{field.placeholder}</option>
            {field.options.map((item) => (
              <option key={item.value} value={item.value}>{item.label}</option>
            ))}
          </select>
          {field.description ? <p className="field-hint">{field.description}</p> : null}
          <FieldError message={errors[field.key]} />
        </label>
      );
    }

    return (
      <label key={field.key} className="field">
        <span>{field.label}{field.required ? " *" : ""}</span>
        <input
          type="text"
          placeholder={field.placeholder}
          value={value}
          onChange={(event) => updateField(field.key, event.target.value)}
        />
        {field.description ? <p className="field-hint">{field.description}</p> : null}
        <FieldError message={errors[field.key]} />
      </label>
    );
  }

  const baseFields = studyAbroadProfileFieldDefinitions.filter((field) =>
    ["intent", "graduationYear", "resumeStage", "careerStage", "schoolName"].includes(field.key),
  );
  const planningFields = studyAbroadProfileFieldDefinitions.filter((field) =>
    ["overseasIntent", "targetCountry", "currentGPA", "languageScore", "applicationTimeline"].includes(field.key),
  );

  return (
    <div>
      <nav className="nav">
        <span className="nav-brand">职业测评</span>
        <div className="nav-steps">
          <span className="nav-step active">① 定向信息</span>
          <span className="nav-step">② 题目作答</span>
          <span className="nav-step">③ 定向报告</span>
        </div>
      </nav>

      <div className="page-container" style={{ maxWidth: 860 }}>
        <div className="page-title-block">
          <div className="page-kicker">留学/升学定向入口</div>
          <h1>先补充你的留学规划背景</h1>
          <p>
            这个页面在原有基础信息之外，会额外收集留学 / 升学目标、国家、GPA、语言成绩和申请节奏。
            这样题目答完后，报告不只会给岗位判断，还会直接把职业目标反推到院校、专业和阶段规划。
          </p>
        </div>

        <div className="card profile-form-card" style={{ padding: 28, marginBottom: 16 }}>
          <div className="result-module-title">基础信息</div>
          <form id="study-abroad-form" className="form-grid" onSubmit={handleSubmit}>
            {baseFields.map((field) => renderField(field))}
            <RoleCascadeField form={form} errors={errors} updateField={updateField} />

            {/* 专业名称：二级级联 */}
            <MajorCascadeField form={form} errors={errors} updateField={updateField} />

            {/* 学校所在城市 / 家乡所在城市 */}
            <CityCascadeField
              fieldKey="schoolCity"
              label="学校所在城市"
              provinceKey="schoolProvince"
              form={form}
              errors={errors}
              updateField={updateField}
            />
            <CityCascadeField
              fieldKey="hometownCity"
              label="家乡所在城市"
              provinceKey="hometownProvince"
              form={form}
              errors={errors}
              updateField={updateField}
            />

            <div className="field" style={{ gridColumn: "1 / -1", paddingTop: 4 }}>
              <div className="surface-note">
                下方这组字段会决定留学定向报告里的国家 / 院校 / 专业建议与阶段规划。
              </div>
            </div>
            {planningFields.map((field) => renderField(field))}
          </form>
        </div>

        <div className="profile-form-actions profile-form-actions--split" style={{ display: "flex", justifyContent: "space-between", gap: 12, flexWrap: "wrap" }}>
          <button className="btn btn-ghost profile-secondary-btn" type="button" onClick={() => navigate("/study-abroad")}>
            ← 返回入口说明
          </button>
          <button className="btn btn-primary profile-submit-btn" form="study-abroad-form" type="submit" style={{ minWidth: 180 }}>
            开始测评 →
          </button>
        </div>
      </div>
    </div>
  );
}
