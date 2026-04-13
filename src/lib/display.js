import {
  careerStageOptions,
  educationLevelOptions,
  graduationYearOptions,
  resumeStageOptions,
  studyRegionOptions,
} from "../data/profileOptions.js";
import { getRoleById } from "../data/roles.js";

const optionGroups = {
  graduationYear: graduationYearOptions,
  resumeStage: resumeStageOptions,
  careerStage: careerStageOptions,
  educationLevel: educationLevelOptions,
  studyRegion: studyRegionOptions,
};

export function getOptionLabel(groupName, value) {
  const group = optionGroups[groupName] ?? [];
  return group.find((item) => item.value === value)?.label ?? value ?? "-";
}

export function getRoleLabel(roleId) {
  return getRoleById(roleId)?.name ?? roleId ?? "-";
}
