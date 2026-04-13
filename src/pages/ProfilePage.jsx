import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import AppShell from "../components/AppShell.jsx";
import SectionCard from "../components/SectionCard.jsx";
import { demoSessions } from "../data/demoSessions.js";
import { profileFieldDefinitions } from "../data/profileFields.js";
import { createEmptyProfile, validateUserProfile } from "../lib/validation.js";
import {
  createDemoSession,
  getAllUserProfiles,
  saveUserProfile,
  setActiveProfile,
} from "../services/mockDatabase.js";
import { createRoleProvider } from "../services/roleProvider.js";

function FieldError({ message }) {
  if (!message) return null;
  return <p className="field-error">{message}</p>;
}

export default function ProfilePage() {
  const navigate = useNavigate();
  const [roles, setRoles] = useState([]);
  const [form, setForm] = useState(createEmptyProfile());
  const [errors, setErrors] = useState({});
  const [savedProfiles, setSavedProfiles] = useState(getAllUserProfiles());

  useEffect(() => {
    const provider = createRoleProvider();
    provider.listRoles().then(setRoles);
  }, []);

  function updateField(field, value) {
    setForm((current) => ({ ...current, [field]: value }));
    setErrors((current) => ({ ...current, [field]: undefined }));
  }

  function handleSubmit(event) {
    event.preventDefault();
    const nextErrors = validateUserProfile(form);
    setErrors(nextErrors);

    if (Object.keys(nextErrors).length > 0) {
      return;
    }

    saveUserProfile(form);
    setSavedProfiles(getAllUserProfiles());
    navigate("/assessment");
  }

  function loadProfile(profile) {
    setForm(profile);
    setErrors({});
    setActiveProfile(profile.id);
  }

  function loadDemoProfile(demo) {
    setForm(demo.profile);
    setErrors({});
  }

  function renderField(field) {
    const value = form[field.key];

    if (field.type === "role-select") {
      return (
        <label key={field.key} className="field">
          <span>{field.label}{field.required ? " *" : ""}</span>
          <select value={value} onChange={(event) => updateField(field.key, event.target.value)}>
            <option value="">{field.placeholder}</option>
            {roles.map((role) => (
              <option key={role.id} value={role.id}>
                {role.name}
              </option>
            ))}
          </select>
          {field.description ? <p className="field-hint">{field.description}</p> : null}
          <FieldError message={errors[field.key]} />
        </label>
      );
    }

    if (field.type === "select") {
      return (
        <label key={field.key} className="field">
          <span>{field.label}{field.required ? " *" : ""}</span>
          <select value={value} onChange={(event) => updateField(field.key, event.target.value)}>
            <option value="">{field.placeholder}</option>
            {field.options.map((item) => (
              <option key={item.value} value={item.value}>
                {item.label}
              </option>
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

  return (
    <AppShell
      title="信息建档"
      subtitle="职业准备度评估 · 题目作答前信息建档。当前只做单岗位评估，输出岗位匹配度分析、行动建议和差距分析。"
      actions={<button className="primary-button" form="setup-form" type="submit">保存并进入题目页</button>}
    >
      <div className="page-grid">
        <SectionCard title="基础信息建档" kicker="配置驱动表单">
          <form id="setup-form" className="form-grid" onSubmit={handleSubmit}>
            {profileFieldDefinitions.map((field) => renderField(field))}
          </form>
        </SectionCard>

        <SectionCard title="本地 profile 复用" kicker="继续上次流程">
          <div className="stack-list">
            {savedProfiles.length === 0 ? <p className="muted-text">还没有保存任何 profile。</p> : null}
            {savedProfiles.slice().reverse().map((profile) => (
              <button key={profile.id} className="list-button" onClick={() => loadProfile(profile)}>
                <strong>{profile.majorName}</strong>
                <span>{profile.targetCompany || "未填写目标公司"} / {profile.graduationYear}</span>
              </button>
            ))}
          </div>
        </SectionCard>
      </div>

      <SectionCard title="岗位 Demo 快捷入口" kicker="用于演示">
        <div className="demo-list">
          {demoSessions.map((demo) => (
            <article key={demo.id} className="demo-card">
              <div>
                <h3>{demo.name}</h3>
                <p>{demo.description}</p>
              </div>
              <div className="button-row">
                <button className="ghost-button" onClick={() => loadDemoProfile(demo)}>
                  仅填入表单
                </button>
                <button
                  className="primary-button"
                  onClick={() => {
                    createDemoSession(demo.id);
                    navigate("/result");
                  }}
                >
                  直接查看结果
                </button>
              </div>
            </article>
          ))}
        </div>
      </SectionCard>
    </AppShell>
  );
}
