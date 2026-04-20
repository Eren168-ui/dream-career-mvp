import { profileFieldDefinitions } from "../data/profileFields.js";
import {
  applicationTimelineOptions,
  careerStageOptions,
  currentGpaOptions,
  graduationYearOptions,
  intentOptions,
  languageScoreOptions,
  overseasIntentOptions,
  resumeStageOptions,
  targetCountryOptions,
} from "../data/profileOptions.js";
import { normalizeCityValue } from "../data/chinaCities.js";
import { roles } from "../data/roles.js";
import { majorCategories } from "../data/majorOptions.js";
import {
  getAllRolePositions,
  getCategoriesByIndustry,
  getIndustries,
} from "../data/roleSystem.js";

export function createEmptyProfile(fieldDefinitions = profileFieldDefinitions) {
  const base = Object.fromEntries(fieldDefinitions.map((field) => [field.key, field.defaultValue ?? ""]));
  // 额外初始化三级岗位字段
  base.targetIndustry    = base.targetIndustry    ?? "";
  base.targetCategory    = base.targetCategory    ?? "";
  base.targetSubcategory = base.targetSubcategory ?? "";
  // 城市级联字段（province 仅用于 UI，存储城市名即可）
  base.schoolProvince    = base.schoolProvince    ?? "";
  base.hometownProvince  = base.hometownProvince  ?? "";
  // studyRegion 由 schoolProvince 推导，但 createEmptyProfile 也需提供默认值
  base.studyRegion       = base.studyRegion       ?? "";
  return base;
}

const allowedValues = {
  intent: new Set(intentOptions.map((item) => item.value)),
  targetRole: new Set(roles.map((item) => item.id)),
  targetIndustry: new Set(getIndustries().map((item) => item.id)),
  targetCategory: new Set(getIndustries().flatMap((industry) => industry.categories.map((item) => item.id))),
  targetSubcategory: new Set(getAllRolePositions().map((item) => item.id)),
  graduationYear: new Set(graduationYearOptions.map((item) => item.value)),
  resumeStage: new Set(resumeStageOptions.map((item) => item.value)),
  careerStage: new Set(careerStageOptions.map((item) => item.value)),
  majorCategory: new Set(majorCategories.map((item) => item.value)),
  overseasIntent: new Set(overseasIntentOptions.map((item) => item.value)),
  targetCountry: new Set(targetCountryOptions.map((item) => item.value)),
  currentGPA: new Set(currentGpaOptions.map((item) => item.value)),
  languageScore: new Set(languageScoreOptions.map((item) => item.value)),
  applicationTimeline: new Set(applicationTimelineOptions.map((item) => item.value)),
};

export function normalizeUserProfile(profile) {
  return {
    intent: profile?.intent ?? "",
    targetRole: profile?.targetRole ?? "",
    targetIndustry: profile?.targetIndustry ?? "",
    targetCategory: profile?.targetCategory ?? "",
    targetSubcategory: profile?.targetSubcategory ?? "",
    targetCompany: (profile?.targetCompany ?? "").trim(),
    graduationYear: profile?.graduationYear ?? "",
    majorCategory: profile?.majorCategory ?? "",
    majorName: (profile?.majorName ?? "").trim(),
    resumeStage: profile?.resumeStage ?? "",
    careerStage: profile?.careerStage ?? "",
    schoolName: (profile?.schoolName ?? "").trim(),
    schoolCity: normalizeCityValue(profile?.schoolProvince ?? "", profile?.schoolCity ?? ""),
    hometownCity: normalizeCityValue(profile?.hometownProvince ?? "", profile?.hometownCity ?? ""),
    // 向后兼容：老数据直接用，新数据从学校省份推导
    studyRegion: profile?.studyRegion ?? (profile?.schoolProvince === "海外" ? "overseas" : "domestic"),
    overseasIntent: profile?.overseasIntent ?? "",
    targetCountry: profile?.targetCountry ?? "",
    currentGPA: profile?.currentGPA ?? "",
    languageScore: profile?.languageScore ?? "",
    applicationTimeline: profile?.applicationTimeline ?? "",
  };
}

function getMissingMessage(field) {
  return field.requiredMessage ?? `请选择${field.label}`;
}

function getInvalidMessage(field) {
  return field.invalidMessage ?? `请选择有效的${field.label}`;
}

export function validateUserProfile(profile, fieldDefinitions = profileFieldDefinitions) {
  const value = normalizeUserProfile(profile);
  const errors = {};

  for (const field of fieldDefinitions) {
    const fieldValue = value[field.key];

    // 文本输入类
    if (field.type === "text" && field.required && !fieldValue?.trim()) {
      errors[field.key] = field.requiredMessage ?? `请输入${field.label}`;
      continue;
    }

    // 城市级联：城市名存在即通过
    if (field.type === "city-cascade") {
      if (field.required && !fieldValue?.trim()) {
        errors[field.key] = field.requiredMessage ?? `请选择${field.label}`;
      }
      continue;
    }

    // 专业二级选择
    if (field.type === "major-sub") {
      if (field.required && !fieldValue?.trim()) {
        errors[field.key] = field.requiredMessage ?? `请选择${field.label}`;
      }
      continue;
    }

    if (field.required && !fieldValue) {
      errors[field.key] = getMissingMessage(field);
      continue;
    }

    if ((field.type === "select" || field.type === "role-select" || field.type === "major-cascade") && fieldValue) {
      const valueSet = allowedValues[field.key];
      if (valueSet && !valueSet.has(fieldValue)) {
        errors[field.key] = getInvalidMessage(field);
      }
    }
  }

  // 三级岗位：必填 + 有效值校验
  if (!value.targetIndustry) {
    errors.targetIndustry = "请选择行业";
  } else if (!allowedValues.targetIndustry.has(value.targetIndustry)) {
    errors.targetIndustry = "请选择有效的行业";
  } else if (!value.targetCategory) {
    errors.targetCategory = "请选择岗位大类";
  } else {
    const categorySet = new Set(getCategoriesByIndustry(value.targetIndustry).map((item) => item.id));
    if (!categorySet.has(value.targetCategory)) {
      errors.targetCategory = "请选择有效的岗位大类";
    } else if (!value.targetSubcategory) {
      errors.targetSubcategory = "请选择细分岗位";
    } else if (!allowedValues.targetSubcategory.has(value.targetSubcategory)) {
      errors.targetSubcategory = "请选择有效的细分岗位";
    }
  }

  return errors;
}
