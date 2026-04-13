import { appConfig } from "../config/appConfig.js";

function escapeXml(value) {
  return String(value)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&apos;");
}

export function buildResultShareSvg({ profile, result }) {
  const dimensionRows = (result.dimensionRanking ?? [])
    .slice(0, 4)
    .map((item, index) => {
      const y = 270 + index * 54;
      return `
        <text x="56" y="${y}" font-size="22" fill="#0F172A">${escapeXml(item.label)}</text>
        <text x="520" y="${y}" font-size="18" fill="#475569">${escapeXml(item.level)}</text>
        <text x="660" y="${y}" font-size="20" fill="#1D4ED8" text-anchor="end">${escapeXml(item.score)}</text>
      `;
    })
    .join("");

  return `
    <svg xmlns="http://www.w3.org/2000/svg" width="720" height="720" viewBox="0 0 720 720">
      <rect width="720" height="720" rx="36" fill="#F8FAFC" />
      <rect x="32" y="32" width="656" height="656" rx="28" fill="#FFFFFF" stroke="#E2E8F0" />
      <text x="56" y="84" font-size="22" fill="#2563EB">${escapeXml(appConfig.appDomain)}</text>
      <text x="56" y="152" font-size="42" font-weight="700" fill="#0F172A">${escapeXml(result.roleName)}</text>
      <text x="56" y="196" font-size="24" fill="#475569">${escapeXml(result.fitLabel)} · ${escapeXml(result.score)}分</text>
      <text x="56" y="230" font-size="18" fill="#64748B">${escapeXml(profile.majorName ?? "")}${profile.targetCompany ? ` · 目标：${escapeXml(profile.targetCompany)}` : ""}</text>
      <text x="56" y="316" font-size="18" fill="#94A3B8">维度得分与分级</text>
      ${dimensionRows}
      <line x1="56" y1="510" x2="664" y2="510" stroke="#E2E8F0" />
      <text x="56" y="560" font-size="20" fill="#0F172A">当前结果图仅保留维度得分和分级。</text>
      <text x="56" y="612" font-size="18" fill="#475569">完整报告：免费留资获取</text>
      <text x="56" y="650" font-size="18" fill="#475569">简历工具：${escapeXml(appConfig.resumeToolUrl)}</text>
    </svg>
  `.trim();
}

export function downloadResultShareImage({ profile, result, filename = "career-result-card.svg" }) {
  const svg = buildResultShareSvg({ profile, result });
  const blob = new Blob([svg], { type: "image/svg+xml;charset=utf-8" });
  const url = URL.createObjectURL(blob);
  const anchor = document.createElement("a");
  anchor.href = url;
  anchor.download = filename;
  document.body.append(anchor);
  anchor.click();
  anchor.remove();
  URL.revokeObjectURL(url);
}
