/**
 * 共享级联组件：专业选择 + 城市选择
 * 供 ProfilePage 和 StudyAbroadProfilePage 共用
 */

import { majorCategories, getMajorsByCategory } from "../data/majorOptions.js";
import {
  chinaCities,
  getCitiesByProvince,
  isSingleLevelProvince,
  normalizeCityValue,
} from "../data/chinaCities.js";

function FieldError({ message }) {
  if (!message) return null;
  return <p className="field-error">{message}</p>;
}

/**
 * 专业大类 + 具体专业 二级联动
 * form 中存 majorCategory（大类 value）和 majorName（专业名称字符串）
 */
export function MajorCascadeField({ form, errors, updateField }) {
  const categoryValue = form.majorCategory ?? "";
  const majorValue    = form.majorName ?? "";
  const majorOptions  = categoryValue ? getMajorsByCategory(categoryValue) : [];

  function handleCategoryChange(val) {
    updateField("majorCategory", val);
    updateField("majorName", "");
  }

  return (
    <div className="field" style={{ gridColumn: "span 2" }}>
      <span>专业名称 *</span>
      <div className="cascade-selector">
        <div className="cascade-level">
          <label className="cascade-label">专业大类</label>
          <select
            className="cascade-select"
            value={categoryValue}
            onChange={(e) => handleCategoryChange(e.target.value)}
          >
            <option value="">请选择专业大类</option>
            {majorCategories.map((cat) => (
              <option key={cat.value} value={cat.value}>{cat.label}</option>
            ))}
          </select>
        </div>

        {categoryValue && (
          <div className="cascade-level">
            <label className="cascade-label">具体专业</label>
            <select
              className="cascade-select"
              value={majorValue}
              onChange={(e) => updateField("majorName", e.target.value)}
            >
              <option value="">请选择具体专业</option>
              {majorOptions.map((opt) => (
                <option key={opt.value} value={opt.value}>{opt.label}</option>
              ))}
            </select>
          </div>
        )}
      </div>
      <FieldError message={errors.majorCategory ?? errors.majorName} />
    </div>
  );
}

/**
 * 省 + 城市 二级联动
 * @param {string} fieldKey      - 存城市名的 form key（如 "schoolCity"）
 * @param {string} provinceKey   - 存省份的 form key（如 "schoolProvince"，仅 UI 用）
 * @param {string} label         - 字段标签
 * @param {function} [onProvinceChange] - 可选钩子，省份变化时额外触发（用于派生 studyRegion）
 */
export function CityCascadeField({ fieldKey, label, provinceKey, form, errors, updateField, onProvinceChange }) {
  const provinceValue = form[provinceKey] ?? "";
  const cityValue     = form[fieldKey] ?? "";
  const cityOptions   = provinceValue ? getCitiesByProvince(provinceValue) : [];
  const isSingleLevel = isSingleLevelProvince(provinceValue);
  const normalizedCityValue = normalizeCityValue(provinceValue, cityValue);

  function handleProvinceChange(val) {
    const nextCityValue = normalizeCityValue(val, "");
    updateField(provinceKey, val);
    updateField(fieldKey, nextCityValue);
    if (onProvinceChange) onProvinceChange(val);
  }

  return (
    <div className="field">
      <span>{label} *</span>
      <div className="cascade-selector" style={{ flexDirection: "column", gap: 8 }}>
        <select
          className="cascade-select"
          value={provinceValue}
          onChange={(e) => handleProvinceChange(e.target.value)}
        >
          <option value="">请选择省 / 直辖市</option>
          {chinaCities.map((p) => (
            <option key={p.province} value={p.province}>{p.province}</option>
          ))}
        </select>

        {provinceValue && !isSingleLevel && (
          <select
            className="cascade-select"
            value={normalizedCityValue}
            onChange={(e) => updateField(fieldKey, e.target.value)}
          >
            <option value="">请选择城市</option>
            {cityOptions.map((city) => (
              <option key={city} value={city}>{city}</option>
            ))}
          </select>
        )}
      </div>
      <FieldError message={errors[fieldKey]} />
    </div>
  );
}
