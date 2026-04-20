import {
  applicationTimelineOptions,
  careerStageOptions,
  currentGpaOptions,
  educationLevelOptions,
  graduationYearOptions,
  intentOptions,
  languageScoreOptions,
  overseasIntentOptions,
  resumeStageOptions,
  studyRegionOptions,
  targetCountryOptions,
} from "../data/profileOptions.js";
import { getRoleById } from "../data/roles.js";

const optionGroups = {
  intent: intentOptions,
  graduationYear: graduationYearOptions,
  resumeStage: resumeStageOptions,
  careerStage: careerStageOptions,
  educationLevel: educationLevelOptions,
  studyRegion: studyRegionOptions,
  overseasIntent: overseasIntentOptions,
  targetCountry: targetCountryOptions,
  currentGPA: currentGpaOptions,
  languageScore: languageScoreOptions,
  applicationTimeline: applicationTimelineOptions,
};

export function getOptionLabel(groupName, value) {
  const group = optionGroups[groupName] ?? [];
  return group.find((item) => item.value === value)?.label ?? value ?? "-";
}

export function getRoleLabel(roleId) {
  return getRoleById(roleId)?.name ?? roleId ?? "-";
}
