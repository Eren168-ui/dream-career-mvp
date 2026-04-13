import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { profileFieldDefinitions } from "../data/profileFields.js";
import { createEmptyProfile, validateUserProfile } from "../lib/validation.js";
import { saveUserProfile } from "../services/mockDatabase.js";
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
    if (Object.keys(nextErrors).length > 0) return;
    saveUserProfile(form);
    navigate("/assessment", { state: { profile: form } });
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
              <option key={role.id} value={role.id}>{role.name}</option>
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
          <p>
            这一步只收和职业准备度判断直接相关的信息。你的专业、目标岗位、当前阶段和期望去向，会决定后面题目表达和结果页的行动指引。
          </p>
        </div>

        <div className="card" style={{ padding: 28 }}>
          <div className="surface-note" style={{ marginBottom: 18 }}>
            信息越准确，结果页里的岗位判断、实习建议和留学路径参考就越接近你的真实情况。
          </div>
          <form id="setup-form" className="form-grid" onSubmit={handleSubmit}>
            {profileFieldDefinitions.map((field) => renderField(field))}
          </form>
        </div>

        <div style={{ display: "flex", justifyContent: "flex-end", marginTop: 22 }}>
          <button className="btn btn-primary" form="setup-form" type="submit" style={{ minWidth: 160 }}>
            开始测评 →
          </button>
        </div>
      </div>
    </div>
  );
}
