import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { profileFieldDefinitions } from "../data/profileFields.js";
import { MajorCascadeField, CityCascadeField } from "../components/ProfileCascades.jsx";
import RoleCascadeField from "../components/RoleCascadeField.jsx";
import { createEmptyProfile, validateUserProfile } from "../lib/validation.js";
import { saveUserProfile } from "../services/mockDatabase.js";

function FieldError({ message }) {
  if (!message) return null;
  return <p className="field-error">{message}</p>;
}

function renderGenericField(field, form, errors, updateField) {
  const value = form[field.key];
  if (field.type === "select") {
    return (
      <label key={field.key} className="field">
        <span>{field.label}{field.required ? " *" : ""}</span>
        <select value={value} onChange={(e) => updateField(field.key, e.target.value)}>
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
        onChange={(e) => updateField(field.key, e.target.value)}
      />
      {field.description ? <p className="field-hint">{field.description}</p> : null}
      <FieldError message={errors[field.key]} />
    </label>
  );
}

export default function ProfilePage() {
  const navigate = useNavigate();
  const [form, setForm] = useState(createEmptyProfile());
  const [errors, setErrors] = useState({});

  function updateField(field, value) {
    setForm((cur) => ({ ...cur, [field]: value }));
    setErrors((cur) => ({ ...cur, [field]: undefined }));
  }

  /** 学校省份变化时，同步推导 studyRegion（兼容结果页逻辑） */
  function handleSchoolProvinceChange(province) {
    updateField("studyRegion", province === "海外" ? "overseas" : "domestic");
  }

  function handleSubmit(event) {
    event.preventDefault();
    const extendedErrors = validateUserProfile(form);
    setErrors(extendedErrors);
    if (Object.keys(extendedErrors).length > 0) return;
    saveUserProfile(form);
    navigate("/assessment", { state: { profile: form } });
  }

  // 通用字段（跳过级联类型和已单独处理的字段）
  const SPECIAL_TYPES = new Set(["role-select", "major-cascade", "major-sub", "city-cascade"]);
  const genericFields = profileFieldDefinitions.filter(
    (f) => !SPECIAL_TYPES.has(f.type) && f.key !== "targetCompany"
  );

  return (
    <div>
      <nav className="nav">
        <span className="nav-brand">职业测评</span>
        <div className="nav-steps">
          <span className="nav-step active">① 基本信息</span>
          <span className="nav-step">② 题目作答</span>
          <span className="nav-step">③ 查看结果</span>
        </div>
      </nav>

      <div className="page-container" style={{ maxWidth: 760 }}>
        <div className="page-title-block">
          <div className="page-kicker">步骤 1 / 3</div>
          <h1>先完成信息建档</h1>
          <p>这一步只收和职业准备度判断直接相关的信息。你的专业、目标岗位、当前阶段和期望去向，会决定后面题目表达和结果页的行动指引。</p>
        </div>

        <div className="card profile-form-card" style={{ padding: 28 }}>
          <div className="surface-note" style={{ marginBottom: 18 }}>
            信息越准确，结果页里的岗位判断、实习建议和留学路径参考就越接近你的真实情况。
          </div>
          <form id="setup-form" className="form-grid" onSubmit={handleSubmit}>
            <RoleCascadeField form={form} errors={errors} updateField={updateField} />

            {/* ── 毕业年份 ── */}
            {genericFields
              .filter((f) => f.key === "graduationYear")
              .map((field) => renderGenericField(field, form, errors, updateField))}

            {/* ── 专业名称：二级联动 ── */}
            <MajorCascadeField form={form} errors={errors} updateField={updateField} />

            {/* ── 简历阶段 / 职业阶段 ── */}
            {genericFields
              .filter((f) => f.key === "resumeStage" || f.key === "careerStage")
              .map((field) => renderGenericField(field, form, errors, updateField))}

            <div className="profile-school-row">
              {/* ── 学校名称（文本输入） ── */}
              {genericFields
                .filter((f) => f.key === "schoolName")
                .map((field) => renderGenericField(field, form, errors, updateField))}

              {/* ── 学校所在城市 ── */}
              <CityCascadeField
                fieldKey="schoolCity"
                label="学校所在城市"
                provinceKey="schoolProvince"
                form={form}
                errors={errors}
                updateField={updateField}
                onProvinceChange={handleSchoolProvinceChange}
              />
            </div>

            {/* ── 家乡所在城市 ── */}
            <CityCascadeField
              fieldKey="hometownCity"
              label="家乡所在城市"
              provinceKey="hometownProvince"
              form={form}
              errors={errors}
              updateField={updateField}
            />

          </form>
        </div>

        <div className="profile-form-actions" style={{ display: "flex", justifyContent: "flex-end", marginTop: 22 }}>
          <button className="btn btn-primary profile-submit-btn" form="setup-form" type="submit" style={{ minWidth: 160 }}>
            开始测评 →
          </button>
        </div>
      </div>
    </div>
  );
}
