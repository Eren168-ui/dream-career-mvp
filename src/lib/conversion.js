import { getRoleById } from "../data/roles.js";

export function buildConversionSearch({ profile = {}, sourcePath = "" }) {
  const params = new URLSearchParams();

  if (profile.targetRole) params.set("role", profile.targetRole);
  if (profile.targetCompany) params.set("company", profile.targetCompany);
  if (sourcePath) params.set("source", sourcePath);

  return params.toString();
}

export function readConversionContext(search = "", fallbackProfile = null) {
  const params = new URLSearchParams(search);
  const roleId = params.get("role") ?? fallbackProfile?.targetRole ?? "";
  const company = params.get("company") ?? fallbackProfile?.targetCompany ?? "";
  const source = params.get("source") ?? "";
  const roleName = getRoleById(roleId)?.name ?? "目标岗位";

  return {
    roleId,
    roleName,
    company,
    source,
  };
}

export function getConversionSourceLabel(source = "") {
  if (!source) return "当前评估结果";
  if (source.includes("/demo/") && source.includes("/report")) return "Demo 报告页";
  if (source.includes("/demo/") && source.includes("/results")) return "Demo 结果页";
  if (source.includes("/report")) return "差距分析报告";
  if (source.includes("/result")) return "岗位匹配度分析";
  return "当前评估流程";
}
