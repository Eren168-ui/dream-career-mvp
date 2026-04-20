import {
  getCategoriesByIndustry,
  getIndustries,
  getRecommendedCompaniesForProfile,
  findRoleCategory,
} from "../data/roleSystem.js";

function FieldError({ message }) {
  if (!message) return null;
  return <p className="field-error">{message}</p>;
}

export default function RoleCascadeField({ form, errors, updateField }) {
  const selectedIndustry = form.targetIndustry ?? "";
  const selectedCategory = form.targetCategory ?? "";
  const selectedSubcategory = form.targetSubcategory ?? "";

  const industries = getIndustries();
  const categoriesInIndustry = selectedIndustry ? getCategoriesByIndustry(selectedIndustry) : [];
  const activeCategory = selectedCategory ? findRoleCategory(selectedCategory) : null;
  const companyOptions = getRecommendedCompaniesForProfile(form);

  function resetRoleFields(next = {}) {
    updateField("targetIndustry", next.targetIndustry ?? "");
    updateField("targetCategory", next.targetCategory ?? "");
    updateField("targetSubcategory", next.targetSubcategory ?? "");
    updateField("targetRole", next.targetRole ?? "");
    updateField("targetCompany", next.targetCompany ?? "");
  }

  function handleIndustryChange(industryId) {
    resetRoleFields({
      targetIndustry: industryId,
      targetCategory: "",
      targetSubcategory: "",
      targetRole: "",
      targetCompany: "",
    });
  }

  function handleCategoryChange(categoryId) {
    const category = findRoleCategory(categoryId);
    resetRoleFields({
      targetIndustry: selectedIndustry,
      targetCategory: categoryId,
      targetSubcategory: "",
      targetRole: category?.questionSetRoleId ?? "",
      targetCompany: "",
    });
  }

  function handlePositionChange(positionId) {
    updateField("targetSubcategory", positionId);
    updateField("targetRole", activeCategory?.questionSetRoleId ?? "");
    updateField("targetCompany", "");
  }

  return (
    <div className="profile-goal-grid">
      <div className="field profile-goal-card profile-goal-card--role">
        <div className="profile-goal-card__intro">
          <span>理想岗位 *</span>
        </div>

        <div className="cascade-selector">
          <div className="cascade-level">
            <label className="cascade-label">行业</label>
            <select
              className="cascade-select"
              value={selectedIndustry}
              onChange={(event) => handleIndustryChange(event.target.value)}
            >
              <option value="">请选择行业</option>
              {industries.map((industry) => (
                <option key={industry.id} value={industry.id}>
                  {industry.emoji} {industry.name}
                </option>
              ))}
            </select>
          </div>

          <div className="cascade-level">
            <label className="cascade-label">岗位大类</label>
            <select
              className="cascade-select"
              value={selectedCategory}
              onChange={(event) => handleCategoryChange(event.target.value)}
              disabled={!selectedIndustry}
            >
              <option value="">{selectedIndustry ? "请选择岗位大类" : "请先选择行业"}</option>
              {categoriesInIndustry.map((category) => (
                <option key={category.id} value={category.id}>
                  {category.emoji} {category.name}
                </option>
              ))}
            </select>
          </div>

          <div className="cascade-level">
            <label className="cascade-label">细分岗位</label>
            <select
              className="cascade-select"
              value={selectedSubcategory}
              onChange={(event) => handlePositionChange(event.target.value)}
              disabled={!selectedCategory}
            >
              <option value="">{selectedCategory ? "请选择细分岗位" : "请先选择岗位大类"}</option>
              {(activeCategory?.positions ?? []).map((position) => (
                <option key={position.id} value={position.id}>
                  {position.name}
                </option>
              ))}
            </select>
          </div>
        </div>

        <FieldError message={errors.targetIndustry ?? errors.targetCategory ?? errors.targetRole ?? errors.targetSubcategory} />
      </div>

      <div className="field profile-goal-card profile-goal-card--company">
        <div className="profile-goal-card__intro profile-goal-card__intro--inline">
          <span>理想公司</span>
          <span className="profile-goal-card__meta">选填</span>
        </div>

        {companyOptions.length > 0 ? (
          <select
            className="cascade-select"
            value={form.targetCompany ?? ""}
            onChange={(event) => updateField("targetCompany", event.target.value)}
          >
            <option value="">请选择（可不填）</option>
            {companyOptions.map((item) => (
              <option key={item} value={item}>
                {item}
              </option>
            ))}
          </select>
        ) : (
          <select className="cascade-select" disabled>
            <option value="">请先选择岗位方向后查看推荐公司</option>
          </select>
        )}
        <p className="field-hint profile-goal-card__hint">可选填写，方便结果页更贴近你的目标方向。</p>
      </div>
    </div>
  );
}
