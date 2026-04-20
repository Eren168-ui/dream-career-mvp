import roleSystemDataset from "./roleSystem.generated.js";

const industries = roleSystemDataset.industries ?? [];
const categoryList = industries.flatMap((industry) =>
  (industry.categories ?? []).map((category) => ({
    ...category,
    industryId: industry.id,
    industryName: industry.name,
    industryEmoji: industry.emoji,
  })),
);

const positionList = categoryList.flatMap((category) =>
  (category.positions ?? []).map((position) => ({
    ...position,
    categoryId: category.id,
    categoryName: category.name,
    questionSetRoleId: category.questionSetRoleId,
    industryId: category.industryId,
    industryName: category.industryName,
  })),
);

export const roleSystemConfig = industries;

export function getIndustries() {
  return industries;
}

export function findIndustry(industryId) {
  return industries.find((item) => item.id === industryId) ?? null;
}

export function getCategoriesByIndustry(industryId) {
  return categoryList.filter((item) => item.industryId === industryId);
}

export function findRoleCategory(categoryId) {
  return categoryList.find((item) => item.id === categoryId) ?? null;
}

export function findRolePosition(categoryId, positionId) {
  return positionList.find((item) => item.categoryId === categoryId && item.id === positionId) ?? null;
}

export function getAllRolePositions() {
  return positionList;
}

export function getRoleSystemStats() {
  return roleSystemDataset.stats ?? {
    industryCount: industries.length,
    categoryCount: categoryList.length,
    positionCount: positionList.length,
    categories: categoryList.map((item) => ({
      industryId: item.industryId,
      industryName: item.industryName,
      categoryId: item.id,
      categoryName: item.name,
      questionSetRoleId: item.questionSetRoleId,
      positionCount: item.positions?.length ?? 0,
      companyCount: item.recommendedCompanies?.length ?? 0,
      audienceTags: item.audienceTags ?? [],
    })),
  };
}

export function resolveRoleSelection(profile = {}) {
  const industry = findIndustry(profile.targetIndustry);
  const category =
    findRoleCategory(profile.targetCategory)
    ?? positionList.find((item) => item.id === profile.targetSubcategory)
    ?? null;
  const resolvedCategory = category && "positions" in category ? category : findRoleCategory(category?.categoryId);
  const position =
    resolvedCategory && profile.targetSubcategory
      ? findRolePosition(resolvedCategory.id, profile.targetSubcategory)
      : null;

  const categoryMeta = resolvedCategory ?? null;
  const industryMeta = industry ?? findIndustry(categoryMeta?.industryId);
  const templateRoleId = categoryMeta?.questionSetRoleId ?? profile.targetRole ?? "";
  const recommendedCompanies = Array.from(
    new Set([
      ...(position?.recommendedCompanies ?? []),
      ...(categoryMeta?.recommendedCompanies ?? []),
      ...(industryMeta?.recommendedCompanies ?? []),
    ]),
  ).slice(0, 10);

  return {
    industry: industryMeta,
    category: categoryMeta,
    position,
    templateRoleId,
    displayName: position?.name ?? categoryMeta?.name ?? "",
    recommendedCompanies,
  };
}

export function getRecommendedCompaniesForProfile(profile = {}) {
  return resolveRoleSelection(profile).recommendedCompanies;
}

export function getRoleDisplayName(profile = {}) {
  return resolveRoleSelection(profile).displayName;
}

export function listSelectableRoleCategories() {
  return categoryList.map((category) => ({
    id: category.id,
    name: category.name,
    industryId: category.industryId,
    industryName: category.industryName,
    questionSetRoleId: category.questionSetRoleId,
  }));
}

export function listSelectableRolePositions() {
  return positionList.map((position) => ({
    id: position.id,
    name: position.name,
    categoryId: position.categoryId,
    categoryName: position.categoryName,
    industryId: position.industryId,
    industryName: position.industryName,
    questionSetRoleId: position.questionSetRoleId,
  }));
}
