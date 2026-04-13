import { profileFieldDefinitions } from "../data/profileFields.js";
import { graduationYearOptions, resumeStageOptions, careerStageOptions, educationLevelOptions, studyRegionOptions } from "../data/profileOptions.js";
import { roles } from "../data/roles.js";

export function createEmptyProfile() {
  return Object.fromEntries(profileFieldDefinitions.map((field) => [field.key, ""]));
}

const allowedValues = {
  targetRole: new Set(roles.map((item) => item.id)),
  graduationYear: new Set(graduationYearOptions.map((item) => item.value)),
  resumeStage: new Set(resumeStageOptions.map((item) => item.value)),
  careerStage: new Set(careerStageOptions.map((item) => item.value)),
  educationLevel: new Set(educationLevelOptions.map((item) => item.value)),
  studyRegion: new Set(studyRegionOptions.map((item) => item.value)),
};

export function normalizeUserProfile(profile) {
  return {
    targetRole: profile?.targetRole ?? "",
    targetCompany: (profile?.targetCompany ?? "").trim(),
    graduationYear: profile?.graduationYear ?? "",
    majorName: (profile?.majorName ?? "").trim(),
    resumeStage: profile?.resumeStage ?? "",
    careerStage: profile?.careerStage ?? "",
    educationLevel: profile?.educationLevel ?? "",
    studyRegion: profile?.studyRegion ?? "",
  };
}

export function validateUserProfile(profile) {
  const value = normalizeUserProfile(profile);
  const errors = {};

  if (!value.targetRole) errors.targetRole = "请选择理想岗位";
  else if (!allowedValues.targetRole.has(value.targetRole)) errors.targetRole = "请选择有效的理想岗位";
  if (!value.graduationYear) errors.graduationYear = "请选择毕业年份";
  else if (!allowedValues.graduationYear.has(value.graduationYear)) errors.graduationYear = "请选择有效的毕业年份";
  if (!value.majorName) errors.majorName = "请输入专业名称";
  if (!value.resumeStage) errors.resumeStage = "请选择简历阶段";
  else if (!allowedValues.resumeStage.has(value.resumeStage)) errors.resumeStage = "请选择有效的简历阶段";
  if (!value.careerStage) errors.careerStage = "请选择职业阶段";
  else if (!allowedValues.careerStage.has(value.careerStage)) errors.careerStage = "请选择有效的职业阶段";
  if (!value.educationLevel) errors.educationLevel = "请选择学历";
  else if (!allowedValues.educationLevel.has(value.educationLevel)) errors.educationLevel = "请选择有效的学历";
  if (!value.studyRegion) errors.studyRegion = "请选择就读区域";
  else if (!allowedValues.studyRegion.has(value.studyRegion)) errors.studyRegion = "请选择有效的就读区域";

  return errors;
}
