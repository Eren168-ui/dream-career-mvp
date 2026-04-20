import { useState } from "react";
import { resultTemplates } from "../data/resultTemplates.js";
import { getRoleProfile } from "../data/roleProfiles.js";
import { getOptionLabel } from "../lib/display.js";
import { getAllRolePositions } from "../data/roleSystem.js";

const FIT_COLORS = {
  "匹配度较高": "#10B981",
  "潜力明显":   "#3B82F6",
  "需要补足":   "#F59E0B",
};

export function getFitColor(label) {
  return FIT_COLORS[label] ?? "#6B7280";
}

/* 技能学习路径映射（具体工具 + 行动建议） */
const SKILL_LEARNING_MAP = {
  "PRD / 流程图":                     "用 Axure RP 或 Figma 练习，先从 3 个真实功能需求写起，逐步建立文档模板",
  "PRD 写作与流程图":                  "用 Axure RP 或 ProcessOn 画需求文档，确保覆盖用户故事、流程逻辑和异常处理",
  "基础 SQL":                         "推荐 SQLZoo 或 LeetCode SQL，重点掌握 JOIN、GROUP BY、窗口函数，配合真实数据集实操",
  "基础 SQL / 数据看板":               "从基础语法开始，结合 Metabase 或 Tableau Public 练习搭建数据看板",
  "用户访谈":                          "先读《用户故事地图》，再做 3-5 次结构化访谈并整理成洞察报告",
  "用户访谈与需求文档":                "先做 3 次用户访谈，再把访谈内容整理成结构化需求文档，循环迭代",
  "指标拆解":                          "练习用指标树拆解具体业务问题（如留存下降），推荐结合真实 App 的 DAU / 转化数据",
  "竞品分析":                          "每周分析 1 个竞品，输出 1-2 页报告，按受众-功能-渠道-定价维度拆解",
  "竞品分析框架":                      "学习 SWOT / 4P 框架，每周拆解一个同类产品的关键策略",
  "内容策划与文案撰写":                "选一个真实平台账号实操，每周发 2 条内容并复盘数据表现（打开率 / 互动率）",
  "数据分析（转化率、ROI）":           "用 Google Analytics 或飞书多维表格练习跟踪转化漏斗，输出可视化报告",
  "社媒平台运营（小红书/抖音/微信）":  "选一个平台深耕 1-2 个月后做完整数据复盘，理解各平台算法逻辑差异",
  "市场调研与竞品监测":                "建立竞品监测表格，每两周更新一次，追踪核心指标（份额 / 活动 / 产品变化）",
  "商务谈判与提案技巧":                "准备提案场景脚本，与同学模拟演练，录制视频复盘表达和节奏",
  "CRM 系统使用（Salesforce 等）":     "注册 Salesforce 免费 Trailhead，完成入门路径并练习线索跟进和商机管理",
  "客户需求访谈与方案定制":            "设计访谈问题模板，至少做 3 次模拟客户访谈，输出需求摘要文档",
  "合同条款基础理解":                  "阅读并拆解 2-3 份真实服务合同，标注核心条款、违约责任和注意事项",
};

function normalizeTraitItems(items = []) {
  return items.map((item) => {
    if (typeof item === "object" && item?.keyword) {
      const explanation = typeof item.explanation === "string" && item.explanation.trim().length > 0
        ? item.explanation
        : `这项能力已经有基础，继续往更稳定的发挥去打磨。`;
      return { ...item, explanation };
    }
    const text = typeof item === "string" ? item : "";
    const index = text.indexOf("，");
    const keyword = index > 0 ? text.slice(0, index) : text;
    const explanation = index > 0 ? text.slice(index + 1) : "";
    return {
      keyword,
      explanation: explanation || "这项能力已经有基础，继续往更稳定的发挥去打磨。",
    };
  });
}

/* ── Module card wrapper ── */
function ModuleCard({ number, title, subtitle, children, style }) {
  return (
    <div className="card" style={{ marginBottom: 12, padding: "24px", ...style }}>
      {number && (
        <div style={{
          fontSize: 10, fontWeight: 700, color: "var(--text-3)",
          letterSpacing: "0.12em", marginBottom: 3, textTransform: "uppercase",
        }}>
          {number}
        </div>
      )}
      <div style={{
        fontSize: 15, fontWeight: 700, color: "var(--text-1)",
        marginBottom: subtitle ? 5 : 18, letterSpacing: "-0.01em",
      }}>{title}</div>
      {subtitle && (
        <div style={{
          fontSize: 12, color: "var(--text-3)", lineHeight: 1.6,
          marginBottom: 18, fontWeight: 500,
        }}>{subtitle}</div>
      )}
      {children}
    </div>
  );
}

/* ── Campus action block（在校规划 5 个抓手） ── */
function CampusActionBlock({ label, color, tagline, items }) {
  return (
    <div style={{
      padding: "13px 16px",
      borderRadius: 12,
      border: `1px solid ${color}25`,
      background: `${color}07`,
      marginBottom: 10,
    }}>
      <div style={{ display: "flex", alignItems: "baseline", gap: 8, marginBottom: 10 }}>
        <span style={{
          fontSize: 12, fontWeight: 700, color,
          background: `${color}15`,
          padding: "3px 10px",
          borderRadius: 999,
          whiteSpace: "nowrap",
          flexShrink: 0,
        }}>{label}</span>
        <span style={{ fontSize: 11, color: "var(--text-3)", lineHeight: 1.5 }}>{tagline}</span>
      </div>
      <ul className="result-list">
        {items.map((item, i) => <li key={i}>{item}</li>)}
      </ul>
    </div>
  );
}

/* ── Overseas path card ── */
function OverseasCard({ item }) {
  const regionColors = {
    "美国":         { bg: "#F7FAFF", border: "#D7E4FF", badge: "#2456C7", line: "#BFD1FF" },
    "英国":         { bg: "#FBF8FF", border: "#E3D7FF", badge: "#6D47BE", line: "#D7CBFF" },
    "香港 / 新加坡": { bg: "#F5FBF7", border: "#D4ECDD", badge: "#167A57", line: "#BCE1CA" },
  };
  const c = regionColors[item.path] ?? { bg: "#F9FAFB", border: "#E5E7EB", badge: "#6B7280", line: "#E5E7EB" };

  return (
    <div className="overseas-path-card" style={{
      padding: "18px 18px 16px",
      borderRadius: 18,
      background: c.bg,
      border: `1px solid ${c.border}`,
      marginBottom: 12,
    }}>
      <div style={{ display: "flex", alignItems: "flex-start", gap: 16, marginBottom: 14, flexWrap: "wrap" }}>
        <div style={{ display: "grid", gap: 8 }}>
          <span style={{
            display: "inline-flex", alignItems: "center", width: "fit-content",
            background: `${c.badge}12`, color: c.badge, border: `1px solid ${c.line}`,
            fontSize: 11, fontWeight: 700, padding: "5px 10px", borderRadius: 999, letterSpacing: "0.04em",
          }}>
            {item.path} 路径
          </span>
          <div style={{ fontSize: 15, fontWeight: 700, color: "var(--text-1)", letterSpacing: "-0.02em" }}>
            {item.focus}
          </div>
        </div>
      </div>

      {[
        { label: "留学方向", value: item.focus },
        { label: "学校参考", value: item.schools },
        { label: "跨专业优势", value: item.advantage },
        { label: "适合人群", value: item.suitableFor },
        { label: "申请前要做", value: item.nextStep },
      ].map(({ label, value }) => value && (
        <div key={label} style={{
          display: "grid", gridTemplateColumns: "72px 1fr", gap: 10,
          paddingTop: 10, marginTop: 10, borderTop: `1px solid ${c.line}`, alignItems: "flex-start",
        }}>
          <span style={{ fontSize: 11, fontWeight: 700, color: c.badge, letterSpacing: "0.04em", paddingTop: 2 }}>{label}</span>
          <span style={{ fontSize: 13, color: "#334155", lineHeight: 1.7 }}>{value}</span>
        </div>
      ))}
    </div>
  );
}

/* ── Requirements grouped by category ── */
function RequirementsGroup({ requirements }) {
  const grouped = { "硬性准入": [], "核心看重": [], "加分项": [] };
  (requirements ?? []).forEach((item) => {
    const entry = typeof item === "string"
      ? { requirement: item, detail: "" }
      : { requirement: item.requirement, detail: item.detail ?? "" };
    const cat  = typeof item === "string" ? "核心看重" : (item.category ?? "核心看重");
    if (grouped[cat]) grouped[cat].push(entry);
    else grouped["核心看重"].push(entry);
  });

  const catMeta = {
    "硬性准入": { color: "#DC2626", bg: "#FEF2F2", border: "#FECACA", label: "准入条件" },
    "核心看重": { color: "#2563EB", bg: "#EFF6FF", border: "#BFDBFE", label: "核心看重" },
    "加分项":   { color: "#059669", bg: "#F0FDF4", border: "#BBF7D0", label: "加分项" },
  };

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
      {Object.entries(grouped).map(([cat, items]) => {
        if (items.length === 0) return null;
        const { color, bg, border, label } = catMeta[cat];
        return (
          <div key={cat} style={{ padding: "12px 14px", borderRadius: 9, background: bg, border: `1px solid ${border}` }}>
            <div style={{ fontSize: 11, fontWeight: 700, color, letterSpacing: "0.06em", marginBottom: 7 }}>{label}</div>
            <ul style={{ margin: 0, padding: 0, listStyle: "none" }}>
              {items.map((entry, i) => (
                <li key={i} style={{
                  fontSize: 13, lineHeight: 1.75, color: "#111827",
                  marginBottom: i < items.length - 1 ? 10 : 0,
                  display: "flex", gap: 7,
                  alignItems: "flex-start",
                }}>
                  <span style={{ color, flexShrink: 0, fontWeight: 700, paddingTop: 2 }}>·</span>
                  <span style={{ display: "grid", gap: entry.detail ? 4 : 0 }}>
                    <span>{entry.requirement}</span>
                    {entry.detail ? (
                      <span style={{ fontSize: 12, color: "#4B5563", lineHeight: 1.75 }}>
                        {entry.detail}
                      </span>
                    ) : null}
                  </span>
                </li>
              ))}
            </ul>
          </div>
        );
      })}
    </div>
  );
}

/* ── Numbered section inside market reality ── */
function NumberedSection({ label, children }) {
  return (
    <div style={{ marginBottom: 20 }}>
      <div style={{ fontSize: 12, fontWeight: 700, color: "#374151", letterSpacing: "0.04em", marginBottom: 10 }}>
        {label}
      </div>
      {children}
    </div>
  );
}

/* ── Sub-section divider inside action guide ── */
function SubSection({ label, children }) {
  return (
    <div className="action-panel">
      <div style={{
        fontSize: 11, fontWeight: 700, color: "#374151",
        marginBottom: 14, paddingBottom: 10,
        borderBottom: "1px solid #ECEEF1",
        letterSpacing: "0.05em",
      }}>{label}</div>
      {children}
    </div>
  );
}

/* ── Mini label for sub-grouping ── */
function MiniLabel({ children }) {
  return (
    <div style={{
      fontSize: 11, fontWeight: 600, color: "var(--text-3)",
      letterSpacing: "0.04em", marginBottom: 7,
    }}>{children}</div>
  );
}

/* ── Dimension analysis card（三层：当前诊断 / 提升建议 / 行动规划） ── */
function DimensionAnalysisCard({ item, fitColor }) {
  const levelColor = item.score >= 65 ? "#10B981" : item.score >= 45 ? "#F59E0B" : "#EF4444";
  const levelLabel = item.score >= 65 ? "优势项" : item.score >= 45 ? "可发展" : "待补足";
  const actionSections = [
    { label: "怎么做", color: "#2563EB", bg: "#EFF6FF", items: item.actionPlan?.howToDo ?? [] },
    { label: "怎么规划", color: "#7C3AED", bg: "#F5F3FF", items: item.actionPlan?.howToPlan ?? [] },
    { label: "学什么", color: "#0F766E", bg: "#ECFEFF", items: item.actionPlan?.whatToLearn ?? [] },
  ];

  return (
    <div style={{ border: "1px solid #E5E7EB", borderRadius: 12, marginBottom: 10, overflow: "hidden" }}>
      {/* 标题行 */}
      <div style={{
        display: "flex", alignItems: "center", justifyContent: "space-between",
        padding: "11px 16px", background: "#FAFAFA", borderBottom: "1px solid #F0F0F0",
      }}>
        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
          <div style={{
            width: 34, height: 34, borderRadius: 8, background: `${fitColor}14`,
            display: "flex", alignItems: "center", justifyContent: "center",
            fontSize: 12, fontWeight: 700, color: fitColor,
          }}>
            {item.score}
          </div>
          <span style={{ fontSize: 14, fontWeight: 700, color: "var(--text-1)" }}>{item.keyword}</span>
        </div>
        <span style={{
          fontSize: 11, fontWeight: 700, color: levelColor,
          background: `${levelColor}14`, padding: "3px 10px", borderRadius: 999,
        }}>{levelLabel}</span>
      </div>

      <div style={{ padding: "12px 16px", display: "flex", flexDirection: "column", gap: 10 }}>
        <div style={{ display: "flex", gap: 8 }}>
          <span style={{
            fontSize: 10, fontWeight: 700, color: item.score >= 65 ? "#059669" : "#D97706",
            background: item.score >= 65 ? "#ECFDF5" : "#FFF7ED",
            padding: "2px 7px", borderRadius: 4,
            whiteSpace: "nowrap", alignSelf: "flex-start", marginTop: 1,
          }}>当前诊断</span>
          <span style={{ fontSize: 13, color: "var(--text-2)", lineHeight: 1.7 }}>{item.currentDiagnosis}</span>
        </div>
        <div style={{ display: "flex", gap: 8 }}>
          <span style={{
            fontSize: 10, fontWeight: 700, color: "#6366F1",
            background: "#EEF2FF", padding: "2px 7px", borderRadius: 4,
            whiteSpace: "nowrap", alignSelf: "flex-start", marginTop: 1,
          }}>提升建议</span>
          <span style={{ fontSize: 13, color: "var(--text-2)", lineHeight: 1.7 }}>{item.improvementAdvice}</span>
        </div>
        <div style={{
          border: "1px solid #E5E7EB",
          borderRadius: 10,
          background: "#FBFCFD",
          padding: "12px 12px 8px",
        }}>
          <div style={{
            fontSize: 11, fontWeight: 700, color: "#111827",
            letterSpacing: "0.04em", marginBottom: 10,
          }}>
            行动规划
          </div>
          <div style={{ display: "grid", gap: 10 }}>
            {actionSections.map((section) => {
              if (section.items.length === 0) return null;
              return (
              <div key={section.label} style={{
                display: "grid",
                gridTemplateColumns: "68px 1fr",
                gap: 10,
                alignItems: "flex-start",
              }}>
                <span style={{
                  fontSize: 11,
                  fontWeight: 700,
                  color: section.color,
                  background: section.bg,
                  borderRadius: 999,
                  padding: "4px 8px",
                  textAlign: "center",
                  whiteSpace: "nowrap",
                }}>
                  {section.label}
                </span>
                <ul style={{ margin: 0, paddingLeft: 18, color: "var(--text-2)", display: "grid", gap: 4 }}>
                  {section.items.map((entry) => (
                    <li key={entry} style={{ fontSize: 12.5, lineHeight: 1.7 }}>
                      {entry}
                    </li>
                  ))}
                </ul>
              </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}

/* ── 成长阶段卡片（晋升空间模块专用） ── */
const STAGE_COLORS = ["#2563EB", "#7C3AED", "#059669"];

function CareerGrowthStages({ stages }) {
  if (!Array.isArray(stages) || stages.length === 0) return null;
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
      {stages.map((stage, idx) => {
        const color = STAGE_COLORS[idx] ?? "#6B7280";
        const isLast = idx === stages.length - 1;
        return (
          <div key={idx}>
            {/* 阶段卡片 */}
            <div style={{
              borderRadius: 12, border: `1.5px solid ${color}33`,
              background: `${color}08`, overflow: "hidden",
            }}>
              {/* 卡头：阶段编号 + 职位 + 年限 + 薪资 */}
              <div style={{
                padding: "10px 14px 10px",
                background: `${color}14`,
                borderBottom: `1px solid ${color}22`,
                display: "flex", alignItems: "flex-start", justifyContent: "space-between", gap: 8,
              }}>
                <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                  <span style={{
                    width: 22, height: 22, borderRadius: "50%",
                    background: color, color: "#fff",
                    fontSize: 11, fontWeight: 800,
                    display: "inline-flex", alignItems: "center", justifyContent: "center", flexShrink: 0,
                  }}>{idx + 1}</span>
                  <div>
                    <div style={{ fontSize: 13, fontWeight: 700, color: "#111827", lineHeight: 1.4 }}>{stage.title}</div>
                    <div style={{ fontSize: 11, color: "#6B7280", lineHeight: 1.4 }}>{stage.period}</div>
                  </div>
                </div>
              </div>

              {/* 卡体 */}
              <div style={{ padding: "10px 14px 12px", display: "flex", flexDirection: "column", gap: 10 }}>

                {/* 阶段定位 */}
                {stage.positioning && (
                  <div style={{
                    fontSize: 12, color: "#374151", lineHeight: 1.7,
                    padding: "6px 10px", borderRadius: 7,
                    background: "#F9FAFB", borderLeft: `3px solid ${color}`,
                  }}>
                    {stage.positioning}
                  </div>
                )}

                {/* 主要工作 */}
                {Array.isArray(stage.mainWork) && stage.mainWork.length > 0 && (
                  <div>
                    <div style={{ fontSize: 11, fontWeight: 700, color, letterSpacing: "0.05em", marginBottom: 4 }}>
                      主要工作
                    </div>
                    <ul style={{ margin: 0, padding: 0, listStyle: "none" }}>
                      {stage.mainWork.map((w, i) => (
                        <li key={i} style={{ fontSize: 12, color: "#374151", lineHeight: 1.7, display: "flex", gap: 6 }}>
                          <span style={{ color, flexShrink: 0, fontWeight: 700 }}>·</span>{w}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

                {/* 核心能力要求 */}
                {Array.isArray(stage.coreRequirements) && stage.coreRequirements.length > 0 && (
                  <div>
                    <div style={{ fontSize: 11, fontWeight: 700, color: "#059669", letterSpacing: "0.05em", marginBottom: 4 }}>
                      核心能力要求
                    </div>
                    <ul style={{ margin: 0, padding: 0, listStyle: "none" }}>
                      {stage.coreRequirements.map((r, i) => (
                        <li key={i} style={{ fontSize: 12, color: "#374151", lineHeight: 1.7, display: "flex", gap: 6 }}>
                          <span style={{ color: "#059669", flexShrink: 0, fontWeight: 700 }}>✓</span>{r}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

                {/* 常见短板 */}
                {Array.isArray(stage.commonBottlenecks) && stage.commonBottlenecks.length > 0 && (
                  <div>
                    <div style={{ fontSize: 11, fontWeight: 700, color: "#DC2626", letterSpacing: "0.05em", marginBottom: 4 }}>
                      常见短板
                    </div>
                    <ul style={{ margin: 0, padding: 0, listStyle: "none" }}>
                      {stage.commonBottlenecks.map((b, i) => (
                        <li key={i} style={{ fontSize: 12, color: "#374151", lineHeight: 1.7, display: "flex", gap: 6 }}>
                          <span style={{ color: "#DC2626", flexShrink: 0, fontWeight: 700 }}>!</span>{b}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            </div>

            {/* 阶段间箭头（非最后一阶段） */}
            {!isLast && stage.nextStageFocus && (
              <div style={{
                margin: "0 0 0 14px", padding: "8px 12px",
                borderLeft: `2px dashed ${STAGE_COLORS[idx + 1] ?? "#9CA3AF"}`,
                position: "relative",
              }}>
                <div style={{
                  fontSize: 11, fontWeight: 700, color: "#6B7280",
                  letterSpacing: "0.04em", marginBottom: 3,
                }}>
                  ↑ 晋升关键
                </div>
                <div style={{ fontSize: 12, color: "#374151", lineHeight: 1.7 }}>
                  {stage.nextStageFocus}
                </div>
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}

/* ── Workplace reality section（7 维度，职场黑盒说明书） ── */
function WorkplaceRealitySection({ workplaceReality, careerStages }) {
  if (!workplaceReality) return null;

  const sections = [
    { key: "jobRequirements",   num: "1", label: "岗位要求",    color: "#2563EB", bg: "#EFF6FF" },
    { key: "professionalism",   num: "2", label: "职业素养",    color: "#7C3AED", bg: "#F5F3FF" },
    { key: "coreSkills",        num: "3", label: "基本技能",    color: "#0891B2", bg: "#ECFEFF" },
    { key: "dailyOperations",   num: "4", label: "日常事务",    color: "#059669", bg: "#ECFDF5" },
    { key: "careerGrowth",      num: "5", label: "晋升空间",    color: "#D97706", bg: "#FFF7ED" },
    { key: "workplaceRelations",num: "6", label: "职场关系",    color: "#DC2626", bg: "#FEF2F2" },
    { key: "personalityTraits", num: "7", label: "性格 / 其他", color: "#6B7280", bg: "#F9FAFB" },
  ];

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
      {sections.map(({ key, num, label, color, bg }) => {
        const content = workplaceReality[key];
        if (!content) return null;

        /* 晋升空间：如果有 careerStages，切换为卡片渲染 */
        if (key === "careerGrowth" && Array.isArray(careerStages) && careerStages.length > 0) {
          return (
            <div key={key}>
              <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 10 }}>
                <span style={{
                  width: 18, height: 18, borderRadius: "50%",
                  background: color, color: "#fff",
                  fontSize: 10, fontWeight: 700,
                  display: "inline-flex", alignItems: "center", justifyContent: "center", flexShrink: 0,
                }}>{num}</span>
                <span style={{ fontSize: 12, fontWeight: 700, color, letterSpacing: "0.06em" }}>{label}</span>
              </div>
              <CareerGrowthStages stages={careerStages} />
            </div>
          );
        }

        const items = Array.isArray(content) ? content : [content];
        return (
          <div key={key} style={{ padding: "12px 14px", borderRadius: 10, background: bg, border: `1px solid ${color}22` }}>
            <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 8 }}>
              <span style={{
                width: 18, height: 18, borderRadius: "50%",
                background: color, color: "#fff",
                fontSize: 10, fontWeight: 700,
                display: "inline-flex", alignItems: "center", justifyContent: "center",
                flexShrink: 0,
              }}>{num}</span>
              <span style={{ fontSize: 12, fontWeight: 700, color, letterSpacing: "0.06em" }}>{label}</span>
            </div>
            <ul style={{ margin: 0, padding: 0, listStyle: "none" }}>
              {items.map((item, i) => (
                <li key={i} style={{
                  fontSize: 13, lineHeight: 1.75, color: "#1F2937",
                  marginBottom: i < items.length - 1 ? 4 : 0,
                  display: "flex", gap: 7,
                }}>
                  <span style={{ color, flexShrink: 0, fontWeight: 700 }}>·</span>
                  {item}
                </li>
              ))}
            </ul>
          </div>
        );
      })}
    </div>
  );
}

/* ── QR Code Modal ── */
const WECOM_QR_URL = null; // e.g. "/assets/wecom-qr.png"
const WECOM_LINK   = null; // e.g. "https://work.weixin.qq.com/k/xxxxxxxx"

function QRModal({ onClose }) {
  return (
    <div
      style={{
        position: "fixed", inset: 0, zIndex: 9999,
        background: "rgba(0,0,0,0.55)", backdropFilter: "blur(4px)",
        display: "flex", alignItems: "center", justifyContent: "center", padding: 24,
      }}
      onClick={onClose}
    >
      <div
        style={{
          background: "#fff", borderRadius: 20, padding: "32px 28px",
          maxWidth: 340, width: "100%", textAlign: "center",
          boxShadow: "0 24px 64px rgba(0,0,0,0.18)",
        }}
        onClick={(e) => e.stopPropagation()}
      >
        <p style={{ fontSize: 16, fontWeight: 700, color: "var(--text-1)", marginBottom: 8 }}>
          领取《101高薪简历案例库》
        </p>
        <p style={{ fontSize: 13, color: "var(--text-2)", marginBottom: 20, lineHeight: 1.7 }}>
          扫码添加老师，立即领取<br />同方向优秀简历案例
        </p>
        {WECOM_QR_URL ? (
          <img src={WECOM_QR_URL} alt="企微二维码" style={{ width: 180, height: 180, borderRadius: 12, border: "1px solid var(--border)" }} />
        ) : (
          <div style={{
            width: 180, height: 180, margin: "0 auto",
            borderRadius: 12, background: "var(--surface-2)",
            border: "2px dashed var(--border)",
            display: "flex", alignItems: "center", justifyContent: "center",
            color: "var(--text-3)", fontSize: 12, lineHeight: 1.6,
          }}>
            待配置<br />企微二维码
          </div>
        )}
        <button
          onClick={onClose}
          style={{
            marginTop: 20, width: "100%", padding: "10px 0",
            borderRadius: 10, border: "1px solid var(--border)",
            background: "transparent", color: "var(--text-2)",
            fontSize: 13, cursor: "pointer",
          }}
        >
          关闭
        </button>
      </div>
    </div>
  );
}

/* ══════════════════════════════════════════════════════ */
export default function ResultContent({ profile, result }) {
  const [showQR, setShowQR] = useState(false);
  const fitColor = getFitColor(result.fitLabel);

  const subcategoryName = profile.targetSubcategory
    ? (getAllRolePositions().find((p) => p.id === profile.targetSubcategory)?.name ?? null)
    : null;

  const selfAwareness  = result.modules.selfAwareness;
  const marketReality  = result.modules.marketReality;
  const actionGuide    = result.modules.actionGuide;
  const closingMessage = result.modules.closingMessage;

  const roleProfile = getRoleProfile(result.roleId ?? profile.targetRole);
  const workplaceReality = marketReality.workplaceReality ?? roleProfile?.workplaceReality;

  // 动态总结句
  const dimensionRanking = result.dimensionRanking ?? [];
  const highestDim = dimensionRanking[0]?.label;
  const lowestDim  = dimensionRanking.at(-1)?.label;
  const highestScore = dimensionRanking[0]?.score ?? 0;
  const lowestScore = dimensionRanking.at(-1)?.score ?? 0;
  const scoreGap = highestScore - lowestScore;
  const hasBalancedHighScores = lowestScore >= 85 || (lowestScore >= 80 && scoreGap <= 8);
  const summaryText = selfAwareness.summary ?? (
    highestDim && lowestDim && highestDim !== lowestDim && hasBalancedHighScores
      ? `当前你的整体表现已经很强，而且各项能力分布比较均衡。你在【${highestDim}】方面的优势会更容易先被岗位看到，这意味着你不仅能做对事情，也更有机会把经历讲成有说服力的案例；与此同时，其它维度也保持在高位，下一步更值得做的是把这些高分能力沉淀成作品、项目结果和面试表达。`
      : highestDim && lowestDim && highestDim !== lowestDim
      ? `当前你在【${highestDim}】方面已经表现出更明显的岗位潜力，这说明你在对应场景里更容易形成稳定发挥，也更容易把优势讲成可信的案例；但【${lowestDim}】仍是当前最需要优先补足的短板，如果这一项长期偏弱，你在岗位适配、案例表达和后续成长速度上都会更容易被卡住。`
      : highestDim
      ? `当前你在【${highestDim}】方面表现最为突出，下一步最值得做的不是再泛看更多信息，而是尽快把这项优势沉淀成可被简历和面试看见的真实证据。`
      : `你现在不是方向错了，而是优势和短板还没有被真正看清。先找出最强项作为主打，再把最弱的一项补成稳定动作，后面的简历、案例和投递节奏才会顺起来。`
  );

  // 自我认知分栏：top-N 为优势，bottom-N 为待提升（各最多 3 个，不重叠）
  const strengthDims = selfAwareness.strengthCards ?? [];
  const improvementDims = selfAwareness.growthCards ?? [];
  const topCount = strengthDims.length;
  const bottomCount = improvementDims.length;

  // Internship plan split
  const internshipItems  = actionGuide.internshipPlan ?? [];
  const mid              = Math.ceil(internshipItems.length / 2);
  const internshipRole   = internshipItems.slice(0, mid);
  const internshipResume = internshipItems.slice(mid);

  // Overseas paths
  const overseasPaths =
    (actionGuide.overseas?.length > 0 ? actionGuide.overseas : null)
    ?? resultTemplates[result.roleId ?? profile.targetRole]?.overseas
    ?? [];

  const hardSkills = actionGuide.skillPlan?.hardSkills ?? [];
  const softSkills = actionGuide.skillPlan?.softSkills ?? [];
  const hardSkillDetails = actionGuide.skillPlan?.hardSkillDetails ?? [];
  const softSkillDetails = actionGuide.skillPlan?.softSkillDetails ?? [];
  const internshipRoadmap = actionGuide.internshipRoadmap ?? null;
  const academicPlan = actionGuide.academicPlan ?? null;
  const studyPlanItems = actionGuide.studyPlan ?? [];
  const resumeStageLabel = getOptionLabel("resumeStage", profile.resumeStage);
  const careerStageLabel = getOptionLabel("careerStage", profile.careerStage);
  const weakestKeyword = improvementDims[0]?.keyword ?? lowestDim ?? "当前短板";
  const actionPrompt = actionGuide.immediateAction ?? "先把过往经历整理出来，明确下一步优先补哪条证据线。";
  const reflectionQuestion = actionGuide.firstQuestion ?? "如果接下来 4 周只能补一项，你最该先补哪条差距？";

  // 在校规划 5 个抓手（固定结构，内容动态来自现有数据）
  const campusActions = [
    {
      key: "network",
      label: "找圈子",
      color: "#4F46E5",
      tagline: "获取一手信息，别靠想象了解行业",
      items: [
        `在 LinkedIn 或校友群里搜索已在做${result.roleName}的前辈，约 15 分钟 Coffee Chat 了解真实工作日常`,
        "加入相关方向的飞书群、微信群、知识星球等社群，持续接收行业一手动态",
        "参加学校就业中心的行业宣讲和岗位分享活动，争取和到场 HR 或从业者交换联系方式",
      ],
    },
    {
      key: "join",
      label: "参与项目",
      color: "#0891B2",
      tagline: "真实协作经历，比空谈强 100 倍",
      items: [
        "参加校内外案例赛、商赛或黑客马拉松，在有时间约束的场景中积累协作和交付经历",
        "加入实验室课题、导师横向项目或创业团队，贡献具体模块的完整工作",
        internshipItems[0] ?? `主动联系感兴趣的公司或团队，争取实习机会或项目合作`,
      ],
    },
    {
      key: "create",
      label: "自己创立项目",
      color: "#059669",
      tagline: "不等机会，自己制造证据",
      items: [
        `选一个你身边真实存在的问题，用"问题-动作-结果"完整记录解决过程，哪怕规模很小`,
        "把社团、学生会或兴趣小组里的协调 / 策划任务当作真实项目推进，记录关键动作与成果",
        studyPlanItems.find((s) => s.includes("项目") || s.includes("实践"))
          ?? `复刻一个你喜欢的产品功能或活动流程，写成完整案例放进作品集`,
      ],
    },
    {
      key: "portfolio",
      label: "搭建作品集",
      color: "#D97706",
      tagline: "让简历看得见，让能力摸得着",
      items: [
        "整理 1-2 个核心案例，清楚呈现背景、你的判断、动作和最终结果，放进 Notion 或简历附件",
        hardSkills.length > 0
          ? `把硬技能（${hardSkills.slice(0, 3).join("、")}等）实际用进项目里，生成可展示的真实产出物`
          : "把学到的技能用进真实项目里，生成可展示的产出物",
        "每次实践结束后在 24 小时内写好复盘，持续更新作品集，避免关键细节遗忘",
      ],
    },
    {
      key: "course",
      label: "针对性买课",
      color: "#7C3AED",
      tagline: "只买用得上的，边学边做",
      items: [
        ...(studyPlanItems
          .filter((s) => s.includes("课") || s.includes("学") || s.includes("练") || s.includes("补"))
          .slice(0, 2)),
        "优先选有实操作业和项目反馈的课程，别只看视频不动手；平台推荐：Coursera（英文系统课）、B站 / 网易公开课（中文速成）、得到（商业框架）",
      ].filter(Boolean),
    },
  ];

  // 动态子模块标签（有无留学路径影响 B/C/D 编号）
  const hasOverseas = overseasPaths.length > 0;
  const internshipLabel  = hasOverseas ? "C · 实习规划" : "B · 实习规划";
  const skillLabel       = hasOverseas ? "D · 技能规划" : "C · 技能规划";

  // ── Hero card 推导数据 ──
  const score = result.fitScore ?? result.score;

  // 一句话判断：短、有判断感、不鸡汤
  const heroOneLiner =
    result.fitLabel === "匹配度较高"
      ? `你在【${highestDim}】上已经形成优势——接下来不是再广泛学习，而是把证据转化成能投递的内容。`
      : result.fitLabel === "潜力明显" && highestDim && lowestDim
      ? `你在【${highestDim}】上有基础，但【${lowestDim}】的缺口正在拖累整体准备度——补上这块，竞争力会快速提升。`
      : lowestDim
      ? `你不是完全不适合，而是【${lowestDim}】的短板目前还太明显——这是当前最优先要补的事。`
      : `先把最关键的短板补扎实，再考虑大范围投递。`;

  // 适配判断描述
  const fitDescription =
    result.fitLabel === "匹配度较高"
      ? `综合得分 ${score}，准备充分，已具备投递基础。优势集中在「${highestDim}」，可进入冲刺阶段。`
      : result.fitLabel === "潜力明显"
      ? `综合得分 ${score}，基础存在但还不稳定。需针对性补足短板，再大范围发力投递。`
      : `综合得分 ${score}，核心能力缺口明显，距离上岗还有差距。需先补再投，不要急于广撒网。`;

  // 分数卡标签
  const scoreTag =
    score >= 80 ? "基础扎实，可冲刺投递"
    : score >= 65 ? "能入门，但还不够稳定"
    : score >= 50 ? "基础有，还差一口气"
    : "短板明显，先补核心能力";

  // 关键短板 & 提升方向
  const growthCardsSlice = (selfAwareness.growthCards ?? []).slice(0, 3);
  const nextStepsSlice   = (actionGuide.nextSteps ?? []).slice(0, 3);
  const weakestTwoLabels = dimensionRanking.slice(-2).map((d) => d.label);

  return (
    <>
      {/* ── 首屏诊断卡（结论先行 + 模块化 + 强化分数卡）── */}
      <div className="card result-hero-card" style={{ marginBottom: 12, padding: "24px 28px" }}>

        {/* ① 顶部：眉标 + 岗位名 + 一句话判断 */}
        <div style={{ marginBottom: 20 }}>
          <div style={{ fontSize: 11, color: "var(--text-3)", marginBottom: 6, letterSpacing: "0.08em", fontWeight: 600 }}>
            职业准备度测评结果
          </div>
          <div style={{ fontSize: 24, fontWeight: 800, color: "var(--text-1)", letterSpacing: "-0.03em", marginBottom: subcategoryName ? 4 : 8, lineHeight: 1.2 }}>
            {result.roleName}
          </div>
          {subcategoryName && (
            <div style={{ fontSize: 13, color: "var(--text-3)", marginBottom: 8, fontWeight: 500 }}>
              细分方向：{subcategoryName}
            </div>
          )}
          <p style={{
            fontSize: 14, color: "var(--text-2)", lineHeight: 1.75,
            margin: 0, maxWidth: 520, fontWeight: 500,
          }}>
            {heroOneLiner}
          </p>
        </div>

        {/* ② 中部：左侧三模块 + 右侧分数卡 */}
        <div style={{ display: "flex", gap: 16, alignItems: "flex-start", flexWrap: "wrap" }}>

          {/* 左侧三个诊断模块 */}
          <div style={{ flex: "1 1 300px", display: "flex", flexDirection: "column", gap: 10 }}>

            {/* A · 适配判断 */}
            <div style={{
              padding: "12px 16px", borderRadius: 12,
              background: `${fitColor}08`, border: `1px solid ${fitColor}28`,
            }}>
              <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 8 }}>
                <span style={{ fontSize: 11, fontWeight: 700, color: "var(--text-3)", letterSpacing: "0.06em" }}>适配判断</span>
                <span style={{
                  fontSize: 11, fontWeight: 700, color: fitColor,
                  background: `${fitColor}15`, padding: "2px 9px",
                  borderRadius: 999, border: `1px solid ${fitColor}30`,
                }}>
                  {result.fitLabel}
                </span>
              </div>
              <p style={{ fontSize: 13, color: "var(--text-2)", lineHeight: 1.7, margin: 0 }}>
                {fitDescription}
              </p>
            </div>

            {/* B · 关键短板 */}
            <div style={{
              padding: "12px 16px", borderRadius: 12,
              background: "#FFF7ED", border: "1px solid #FED7AA",
            }}>
              <div style={{ fontSize: 11, fontWeight: 700, color: "#C2410C", letterSpacing: "0.06em", marginBottom: 10 }}>
                关键短板
              </div>
              {growthCardsSlice.length > 0 ? growthCardsSlice.map((card) => (
                <div key={card.keyword} style={{ display: "flex", gap: 8, marginBottom: 7, alignItems: "flex-start" }}>
                  <span style={{ color: "#F97316", fontWeight: 700, flexShrink: 0, lineHeight: 1.7 }}>·</span>
                  <div>
                    <span style={{ fontSize: 12, fontWeight: 700, color: "#9A3412", marginRight: 5 }}>{card.keyword}</span>
                    <span style={{ fontSize: 12, color: "#78350F", lineHeight: 1.65 }}>{card.explanation}</span>
                  </div>
                </div>
              )) : (
                <p style={{ fontSize: 12, color: "#78350F", margin: 0, lineHeight: 1.7 }}>
                  当前维度数据不足，请完成更多测评题目后查看。
                </p>
              )}
            </div>

            {/* C · 提升方向 */}
            <div style={{
              padding: "12px 16px", borderRadius: 12,
              background: "#F0FDF4", border: "1px solid #A7F3D0",
            }}>
              <div style={{ fontSize: 11, fontWeight: 700, color: "#065F46", letterSpacing: "0.06em", marginBottom: 10 }}>
                提升方向
              </div>
              {nextStepsSlice.length > 0 ? nextStepsSlice.map((step, i) => (
                <div key={i} style={{ display: "flex", gap: 8, marginBottom: 7, alignItems: "flex-start" }}>
                  <span style={{ color: "#059669", fontWeight: 700, flexShrink: 0, lineHeight: 1.7 }}>·</span>
                  <span style={{ fontSize: 12, color: "#064E3B", lineHeight: 1.65 }}>{step}</span>
                </div>
              )) : (
                <p style={{ fontSize: 12, color: "#064E3B", margin: 0, lineHeight: 1.7 }}>
                  完成测评后将自动生成专属提升方向。
                </p>
              )}
            </div>
          </div>

          {/* 右侧增强分数卡 */}
          <div style={{
            width: 162, flexShrink: 0,
            padding: "20px 16px 18px",
            borderRadius: 16,
            background: `${fitColor}09`,
            border: `1.5px solid ${fitColor}35`,
            textAlign: "center",
          }}>
            {/* 大分数 */}
            <div style={{ fontSize: 10, color: "var(--text-3)", marginBottom: 6, letterSpacing: "0.06em", fontWeight: 600 }}>
              综合得分
            </div>
            <div style={{ fontSize: 56, fontWeight: 800, color: fitColor, lineHeight: 1, marginBottom: 5, fontVariantNumeric: "tabular-nums" }}>
              {score}
            </div>
            <div style={{ fontSize: 13, fontWeight: 700, color: fitColor, marginBottom: 8 }}>
              {result.fitLabel}
            </div>
            {/* 描述标签 */}
            <div style={{
              fontSize: 11, fontWeight: 600, color: fitColor,
              background: `${fitColor}12`, border: `1px solid ${fitColor}30`,
              padding: "4px 10px", borderRadius: 999,
              lineHeight: 1.5, display: "inline-block", marginBottom: 14,
            }}>
              {scoreTag}
            </div>

            {/* 分隔 + 最弱能力 */}
            {weakestTwoLabels.length > 0 && (
              <div style={{ borderTop: `1px solid ${fitColor}20`, paddingTop: 12 }}>
                <div style={{ fontSize: 10, color: "var(--text-3)", marginBottom: 8, letterSpacing: "0.05em", fontWeight: 600 }}>
                  当前最弱能力
                </div>
                <div style={{ display: "flex", flexDirection: "column", gap: 5, alignItems: "center" }}>
                  {weakestTwoLabels.map((label) => (
                    <span key={label} style={{
                      fontSize: 11, fontWeight: 600, color: "#9A3412",
                      background: "#FFF7ED", border: "1px solid #FED7AA",
                      padding: "4px 12px", borderRadius: 999,
                      whiteSpace: "nowrap",
                    }}>{label}</span>
                  ))}
                </div>
              </div>
            )}

            {/* 专业/年级 */}
            {profile.majorName && (
              <div style={{
                fontSize: 11, color: "var(--text-3)", marginTop: 12,
                borderTop: `1px solid ${fitColor}18`, paddingTop: 10,
              }}>
                {profile.majorName}
              </div>
            )}
          </div>
        </div>

        {/* ③ 底部：辅助标签（弱化，只做补充信息） */}
        <div className="result-hero-meta" style={{ marginTop: 16, opacity: 0.85 }}>
          {profile.targetCompany ? <span className="result-meta-pill">目标公司：{profile.targetCompany}</span> : null}
          {profile.resumeStage   ? <span className="result-meta-pill">当前阶段：{resumeStageLabel}</span> : null}
          {profile.studyRegion === "overseas" ? <span className="result-meta-pill">已考虑留学路径</span> : null}
        </div>
      </div>

      {/* ── 01 自我认知 ── */}
      <ModuleCard
        number="01"
        title="自我认知"
        subtitle="第一步：先看清自己，才不会被选择带着走"
      >
        {/* 维度得分条形图 */}
        <div style={{ marginBottom: 20 }}>
          {dimensionRanking.map((item) => (
            <div key={item.dimension} className="score-bar-row">
              <span className="score-bar-label" style={{ fontSize: 12, color: "var(--text-2)" }}>{item.label}</span>
              <div className="score-bar-track">
                <div className="score-bar-fill" style={{ width: `${item.score}%`, background: fitColor }} />
              </div>
              <span className="score-bar-value" style={{ color: fitColor, fontSize: 12 }}>{item.score}</span>
            </div>
          ))}
        </div>

        {/* 左右分栏：优势 Top-N vs 待提升 Bottom-N */}
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))", gap: 16, alignItems: "start" }}>

          {/* 左侧：你的优势 */}
          <div>
            <div style={{
              display: "flex", alignItems: "center", gap: 8,
              padding: "8px 14px", borderRadius: 8, marginBottom: 10,
              background: "#ECFDF5", border: "1px solid #6EE7B7",
            }}>
              <span style={{ width: 8, height: 8, borderRadius: "50%", background: "#10B981", flexShrink: 0 }} />
              <span style={{ fontSize: 12, fontWeight: 700, color: "#065F46", letterSpacing: "0.04em" }}>
                你的优势 · TOP {topCount}
              </span>
            </div>
            {strengthDims.map((item) => (
              <DimensionAnalysisCard key={item.dimension} item={item} fitColor="#10B981" />
            ))}
          </div>

          {/* 右侧：你需要提升 */}
          <div>
            <div style={{
              display: "flex", alignItems: "center", gap: 8,
              padding: "8px 14px", borderRadius: 8, marginBottom: 10,
              background: "#FFF7ED", border: "1px solid #FCD34D",
            }}>
              <span style={{ width: 8, height: 8, borderRadius: "50%", background: "#F59E0B", flexShrink: 0 }} />
              <span style={{ fontSize: 12, fontWeight: 700, color: "#92400E", letterSpacing: "0.04em" }}>
                你需要提升 · BOTTOM {bottomCount}
              </span>
            </div>
            {improvementDims.map((item) => (
              <DimensionAnalysisCard key={item.dimension} item={item} fitColor="#F59E0B" />
            ))}
          </div>

        </div>
      </ModuleCard>

      {/* ── 02 外界认知 ── */}
      <ModuleCard
        number="02"
        title="外界认知"
        subtitle="第二步：看见真实职场规则，比想象更重要"
      >
        {/* 7 维度职场解析 */}
        {workplaceReality ? (
          <WorkplaceRealitySection
            workplaceReality={workplaceReality}
            careerStages={roleProfile?.careerStages}
          />
        ) : (
          <NumberedSection label="这个岗位每天在做什么">
            <ul style={{ margin: 0, padding: 0, listStyle: "none" }}>
              {marketReality.content?.map((item, i) => (
                <li key={i} style={{ display: "flex", gap: 8, fontSize: 13, color: "var(--text-2)", lineHeight: 1.75, marginBottom: 5 }}>
                  <span style={{ color: "var(--accent)", flexShrink: 0, fontWeight: 700 }}>·</span>
                  {item}
                </li>
              ))}
            </ul>
          </NumberedSection>
        )}

        {/* 分隔线 */}
        <div style={{ borderTop: "1px dashed #E5E7EB", margin: "16px 0 14px" }} />

        {/* 招聘方最看重 */}
        <div style={{ marginBottom: 16 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 10 }}>
            <span style={{
              width: 18, height: 18, borderRadius: "50%",
              background: "#374151", color: "#fff",
              fontSize: 10, fontWeight: 700,
              display: "inline-flex", alignItems: "center", justifyContent: "center", flexShrink: 0,
            }}>8</span>
            <span style={{ fontSize: 12, fontWeight: 700, color: "#374151", letterSpacing: "0.04em" }}>招聘方最看重什么</span>
          </div>
          <RequirementsGroup requirements={marketReality.requirements} />
        </div>

        {/* 代表性公司 */}
        <div style={{ marginBottom: 16 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 10 }}>
            <span style={{
              width: 18, height: 18, borderRadius: "50%",
              background: "#374151", color: "#fff",
              fontSize: 10, fontWeight: 700,
              display: "inline-flex", alignItems: "center", justifyContent: "center", flexShrink: 0,
            }}>9</span>
            <span style={{ fontSize: 12, fontWeight: 700, color: "#374151", letterSpacing: "0.04em" }}>代表性公司</span>
          </div>
          <p style={{ fontSize: 12, color: "var(--text-3)", margin: "0 0 8px", lineHeight: 1.6 }}>
            以下是该岗位方向的典型雇主，可参考其招聘信息了解具体岗位要求。
          </p>
          <div className="skill-tags">
            {marketReality.topCompanies?.map((item) => (
              <span key={item} className="skill-tag">{item}</span>
            ))}
          </div>
        </div>

        {/* 可迁移行业 / 岗位 */}
        {workplaceReality?.transferableRoles?.length > 0 && (
          <div>
            <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 10 }}>
              <span style={{ fontSize: 11, fontWeight: 700, color: "#4F46E5", letterSpacing: "0.06em" }}>
                可迁移行业 / 岗位
              </span>
            </div>
            <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
              {workplaceReality.transferableRoles.map((role) => (
                <span key={role} style={{
                  fontSize: 12, fontWeight: 600, color: "#4F46E5",
                  background: "#EEF2FF", border: "1px solid #C7D2FE",
                  padding: "5px 12px", borderRadius: 999,
                }}>{role}</span>
              ))}
            </div>
          </div>
        )}
      </ModuleCard>

      {/* ── 03 行动指引 ── */}
      <ModuleCard
        number="03"
        title="第三步：开始行动，答案藏在每一次尝试里"
        subtitle="结合你的当前阶段，从以下维度系统推进"
      >
        <div className="action-guide-stack">

          {/* A · 学业规划 */}
          <SubSection label="A · 学业规划">
            {academicPlan && (
              <>
                <div style={{ display: "flex", gap: 8, flexWrap: "wrap", marginBottom: 14 }}>
                  {academicPlan.yearContext?.phase ? (
                    <span style={{
                      display: "inline-flex",
                      alignItems: "center",
                      padding: "5px 12px",
                      borderRadius: 999,
                      fontSize: 12,
                      fontWeight: 600,
                      color: "#1D4ED8",
                      background: "#EFF6FF",
                      border: "1px solid #BFDBFE",
                    }}>
                      当前时间窗口：{academicPlan.yearContext.phase}（{academicPlan.yearContext.window}）
                    </span>
                  ) : null}
                  {academicPlan.urgencyBadge ? (
                    <span style={{
                      display: "inline-flex",
                      alignItems: "center",
                      padding: "5px 12px",
                      borderRadius: 999,
                      fontSize: 12,
                      fontWeight: 600,
                      color: "#92400E",
                      background: "#FFF7ED",
                      border: "1px solid #FCD34D",
                    }}>
                      简历状态：{academicPlan.urgencyBadge}
                    </span>
                  ) : null}
                </div>

                <div style={{
                  padding: "14px 16px",
                  borderRadius: 12,
                  border: "1px solid #D9E7FF",
                  background: "linear-gradient(135deg, #F8FBFF 0%, #F9FCFF 100%)",
                  marginBottom: 14,
                }}>
                  <p style={{ margin: 0, fontSize: 13, color: "var(--text-2)", lineHeight: 1.8 }}>
                    {academicPlan.contextSummary}
                  </p>
                </div>

                <div style={{
                  display: "grid",
                  gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
                  gap: 12,
                  marginBottom: 14,
                }}>
                  <div style={{ padding: "14px 16px", borderRadius: 12, background: "#F8FAFC", border: "1px solid #E5E7EB" }}>
                    <MiniLabel>学业规划的核心目标</MiniLabel>
                    <p style={{ margin: 0, fontSize: 13, color: "var(--text-2)", lineHeight: 1.8 }}>
                      {academicPlan.educationTarget}
                    </p>
                  </div>
                  <div style={{ padding: "14px 16px", borderRadius: 12, background: "#F0FDF4", border: "1px solid #BBF7D0" }}>
                    <MiniLabel>当前最该补的学业边</MiniLabel>
                    <p style={{ margin: 0, fontSize: 13, color: "var(--text-2)", lineHeight: 1.8 }}>
                      {academicPlan.educationEdge}
                    </p>
                  </div>
                  <div style={{ padding: "14px 16px", borderRadius: 12, background: "#FFFDF7", border: "1px solid #FDE68A" }}>
                    <MiniLabel>地区 / 留学衔接提醒</MiniLabel>
                    <p style={{ margin: 0, fontSize: 13, color: "var(--text-2)", lineHeight: 1.8 }}>
                      {academicPlan.regionTip}
                    </p>
                  </div>
                  <div style={{ padding: "14px 16px", borderRadius: 12, background: "#FAF5FF", border: "1px solid #E9D5FF" }}>
                    <MiniLabel>这一阶段的主任务</MiniLabel>
                    <p style={{ margin: 0, fontSize: 13, color: "var(--text-2)", lineHeight: 1.8 }}>
                      {academicPlan.nextStep ?? academicPlan.coreTask}
                    </p>
                  </div>
                </div>

                <div style={{ marginBottom: 14 }}>
                  <MiniLabel>学业上优先补这几件事</MiniLabel>
                  <ul className="result-list">
                    {(academicPlan.studyPlan ?? studyPlanItems).map((item, i) => <li key={i}>{item}</li>)}
                  </ul>
                </div>

                {academicPlan.threeSemesterRoadmap && (
                  <div style={{
                    display: "grid",
                    gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
                    gap: 12,
                    marginBottom: 14,
                  }}>
                    {Object.values(academicPlan.threeSemesterRoadmap).map((phase) => (
                      <div key={phase.label} style={{
                        padding: "14px 16px",
                        borderRadius: 12,
                        background: "#FFFFFF",
                        border: "1px solid #E5E7EB",
                      }}>
                        <MiniLabel>{phase.label}</MiniLabel>
                        <ul className="result-list" style={{ marginBottom: 0 }}>
                          {(phase.tasks ?? []).map((item, i) => <li key={i}>{item}</li>)}
                        </ul>
                      </div>
                    ))}
                  </div>
                )}
              </>
            )}

            <p style={{ fontSize: 13, color: "var(--text-3)", lineHeight: 1.65, marginBottom: 14 }}>
              不要等到实习才开始积累——在校期间有 5 个真实可操作的抓手：
            </p>
            {campusActions.map((action) => (
              <CampusActionBlock key={action.key} {...action} />
            ))}
          </SubSection>

          {/* B · 留学规划（有路径数据时展示） */}
          {hasOverseas && (
            <SubSection label="B · 留学规划">
              <p style={{ fontSize: 13, color: "var(--text-3)", lineHeight: 1.65, marginBottom: 14 }}>
                留学不只是镀金，更是补足短板的杠杆——以下是针对{result.roleName}方向三条主要跨专业路径的院校建议（信息基于真实项目情况整理）：
              </p>
              {overseasPaths.map((item, i) => (
                <OverseasCard key={i} item={item} />
              ))}
            </SubSection>
          )}

          {/* C/B · 实习规划（动态读取 resumeStage） */}
          <SubSection label={internshipLabel}>
            <div style={{ display: "flex", gap: 8, flexWrap: "wrap", marginBottom: 14 }}>
              {careerStageLabel && (
                <div style={{
                  display: "inline-flex", alignItems: "center", gap: 6,
                  padding: "5px 12px", borderRadius: 999,
                  background: "#ECFDF5", border: "1px solid #6EE7B7",
                  fontSize: 12, fontWeight: 600, color: "#065F46",
                }}>
                  <span style={{ width: 6, height: 6, borderRadius: "50%", background: "#10B981", flexShrink: 0 }} />
                  当前实习阶段：{careerStageLabel}
                </div>
              )}
              {profile.resumeStage && (
                <div style={{
                  display: "inline-flex", alignItems: "center", gap: 6,
                  padding: "5px 12px", borderRadius: 999,
                  background: "#F8FAFC", border: "1px solid #E2E8F0",
                  fontSize: 12, fontWeight: 600, color: "#475569",
                }}>
                  简历状态：{resumeStageLabel}
                </div>
              )}
            </div>

            {internshipRoadmap?.stageDiagnosis && (
              <div style={{
                padding: "14px 16px",
                borderRadius: 12,
                border: "1px solid #D9E7FF",
                background: "linear-gradient(135deg, #F8FBFF 0%, #F9FCFF 100%)",
                marginBottom: 16,
              }}>
                <MiniLabel>阶段判断</MiniLabel>
                <p style={{ margin: 0, fontSize: 13, color: "var(--text-2)", lineHeight: 1.8 }}>
                  {internshipRoadmap.stageDiagnosis}
                </p>
              </div>
            )}

            <div style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))",
              gap: 12,
              marginBottom: 12,
            }}>
              <div style={{ padding: "14px 16px", borderRadius: 12, background: "#F8FAFC", border: "1px solid #E5E7EB" }}>
                <MiniLabel>优先争取的岗位 / 场景</MiniLabel>
                <ul className="result-list" style={{ marginBottom: 0 }}>
                  {(internshipRoadmap?.priorityRoles ?? internshipRole).map((item, i) => <li key={i}>{item}</li>)}
                </ul>
              </div>
              <div style={{ padding: "14px 16px", borderRadius: 12, background: "#FFFDF7", border: "1px solid #FDE68A" }}>
                <MiniLabel>简历和面试要重点强调</MiniLabel>
                <ul className="result-list" style={{ marginBottom: 0 }}>
                  {(internshipRoadmap?.resumeKeywords ?? internshipResume).map((item, i) => <li key={i}>{item}</li>)}
                </ul>
              </div>
              <div style={{ padding: "14px 16px", borderRadius: 12, background: "#F0FDF4", border: "1px solid #BBF7D0" }}>
                <MiniLabel>最近 2 周先做什么</MiniLabel>
                <ul className="result-list" style={{ marginBottom: 0 }}>
                  {(internshipRoadmap?.nextTwoWeeks ?? []).map((item, i) => <li key={i}>{item}</li>)}
                </ul>
              </div>
              <div style={{ padding: "14px 16px", borderRadius: 12, background: "#EFF6FF", border: "1px solid #BFDBFE" }}>
                <MiniLabel>接下来 4 周怎么推进</MiniLabel>
                <ul className="result-list" style={{ marginBottom: 0 }}>
                  {(internshipRoadmap?.nextFourWeeks ?? []).map((item, i) => <li key={i}>{item}</li>)}
                </ul>
              </div>
            </div>

            {(internshipRoadmap?.deliverables?.length > 0) && (
              <div style={{
                padding: "14px 16px",
                borderRadius: 12,
                background: "#FFFBEB",
                border: "1px solid #FCD34D",
              }}>
                <MiniLabel>这一阶段最好拿到的产出物</MiniLabel>
                <ul className="result-list" style={{ marginBottom: 0 }}>
                  {internshipRoadmap.deliverables.map((item, i) => <li key={i}>{item}</li>)}
                </ul>
              </div>
            )}
          </SubSection>

          {/* D/C · 技能规划 */}
          <SubSection label={skillLabel}>
            {hardSkillDetails.length > 0 ? (
              <div style={{ marginBottom: 16 }}>
                <MiniLabel>硬技能——为什么补、怎么练、练完拿什么证明</MiniLabel>
                <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                  {hardSkillDetails.map((item) => {
                    return (
                      <div key={item.skill} style={{
                        padding: "12px 14px", borderRadius: 12,
                        background: "#F8F9FF", border: "1px solid #E0E7FF",
                      }}>
                        <div style={{ fontSize: 13, fontWeight: 700, color: "#3730A3", marginBottom: 8 }}>
                          {item.skill}
                        </div>
                        <div style={{ display: "grid", gap: 6 }}>
                          <div style={{ fontSize: 12, color: "var(--text-2)", lineHeight: 1.75 }}>
                            <strong style={{ color: "#312E81" }}>为什么要补：</strong>{item.reason}
                          </div>
                          <div style={{ fontSize: 12, color: "var(--text-2)", lineHeight: 1.75 }}>
                            <strong style={{ color: "#312E81" }}>具体提升路径：</strong>{item.practicePath}
                          </div>
                          <div style={{ fontSize: 12, color: "var(--text-2)", lineHeight: 1.75 }}>
                            <strong style={{ color: "#312E81" }}>完成后要拿到的证明：</strong>{item.output}
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            ) : hardSkills.length > 0 ? (
              <div style={{ marginBottom: 16 }}>
                <MiniLabel>硬技能——具体学什么、怎么学</MiniLabel>
                <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                  {hardSkills.map((skill) => {
                    const howTo = SKILL_LEARNING_MAP[skill];
                    return (
                      <div key={skill} style={{
                        padding: "10px 14px", borderRadius: 10,
                        background: "#F8F9FF", border: "1px solid #E0E7FF",
                      }}>
                        <div style={{ fontSize: 13, fontWeight: 700, color: "#3730A3", marginBottom: howTo ? 4 : 0 }}>
                          {skill}
                        </div>
                        {howTo && (
                          <div style={{ fontSize: 12, color: "var(--text-2)", lineHeight: 1.65 }}>{howTo}</div>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>
            ) : null}

            {softSkillDetails.length > 0 ? (
              <div>
                <MiniLabel>软技能——放进真实场景里练，别只把它当成形容词</MiniLabel>
                <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))", gap: 10 }}>
                  {softSkillDetails.map((item) => (
                    <div key={item.skill} style={{
                      padding: "12px 14px",
                      borderRadius: 12,
                      background: "#F9FAFB",
                      border: "1px solid #E5E7EB",
                    }}>
                      <div style={{ fontSize: 13, fontWeight: 700, color: "#374151", marginBottom: 8 }}>
                        {item.skill}
                      </div>
                      <div style={{ fontSize: 12, color: "var(--text-2)", lineHeight: 1.75, marginBottom: 6 }}>
                        <strong style={{ color: "#1F2937" }}>典型场景：</strong>{item.scenario}
                      </div>
                      <div style={{ fontSize: 12, color: "var(--text-2)", lineHeight: 1.75, marginBottom: 6 }}>
                        <strong style={{ color: "#1F2937" }}>刻意练习动作：</strong>{item.practiceAction}
                      </div>
                      <div style={{ fontSize: 12, color: "var(--text-2)", lineHeight: 1.75 }}>
                        <strong style={{ color: "#1F2937" }}>复盘时问自己：</strong>{item.reviewQuestion}
                      </div>
                    </div>
                  ))}
                </div>
                <p style={{ fontSize: 12, color: "var(--text-3)", lineHeight: 1.7, marginTop: 12, marginBottom: 0 }}>
                  软技能无法单独"学会"，只能在真实项目协作和复盘中刻意练习——每次交付结束后问自己：这次我哪里表达不清、推进不力、或复盘不到位？
                </p>
              </div>
            ) : softSkills.length > 0 ? (
              <div>
                <MiniLabel>软技能——如何在实践中刻意练习</MiniLabel>
                <div style={{ display: "flex", flexWrap: "wrap", gap: 8, marginBottom: 10 }}>
                  {softSkills.map((skill) => (
                    <span key={skill} style={{
                      padding: "6px 14px", borderRadius: 999,
                      fontSize: 12, fontWeight: 600,
                      color: "#6B7280", background: "#F3F4F6", border: "1px solid #E5E7EB",
                    }}>{skill}</span>
                  ))}
                </div>
                <p style={{ fontSize: 12, color: "var(--text-3)", lineHeight: 1.7, margin: 0 }}>
                  软技能无法单独"学会"，只能在真实项目协作和复盘中刻意练习——每次交付结束后问自己：这次我哪里表达不清、推进不力、或复盘不到位？
                </p>
              </div>
            ) : null}
          </SubSection>
        </div>
      </ModuleCard>

      {/* ── 04 写在最后 ── */}
      <ModuleCard
        number="04"
        title="写在最后"
        style={{ borderLeft: `3px solid ${fitColor}` }}
      >
        <p style={{ fontSize: 14, lineHeight: 1.95, color: "var(--text-2)", marginBottom: 0 }}>
          {`从这次结果看，你现在最该优先处理的，不是继续看更多岗位信息，而是把【${weakestKeyword}】补成稳定动作。对 ${result.roleName} 这类岗位来说，短板不会只影响一时的得分，它会直接反映在你能不能把项目讲清楚、能不能接住面试追问，以及进到真实团队后能不能快速被信任。`}
        </p>
        <p style={{ fontSize: 14, lineHeight: 1.95, color: "var(--text-2)", marginTop: 12, marginBottom: 0 }}>
          {`如果你现在就准备开始动手，最现实的一步不是一下子补很多，而是先做这件事：${actionPrompt}。只要第一步够具体，后面的案例、简历和表达才会逐渐连成线，而不是一直停留在“知道该努力，但不知道怎么下手”。`}
        </p>
        <p style={{ fontSize: 14, lineHeight: 1.95, color: "var(--text-2)", marginTop: 12, marginBottom: 20 }}>
          {`后面每做完一个项目、一次练习或一段实习，都建议你拿这个问题回头追问自己：${reflectionQuestion}。这一步的意义不是自我感动，而是把经历慢慢沉淀成招聘方能看懂、面试官也愿意继续追问的真实证据。`}
        </p>

        {/* 积极鼓励语 */}
        <div style={{
          padding: "14px 18px", borderRadius: 12,
          background: `${fitColor}0A`, border: `1px solid ${fitColor}28`,
          marginBottom: 20,
        }}>
          <p style={{ fontSize: 13, fontWeight: 600, color: fitColor, lineHeight: 1.8, margin: 0 }}>
            {closingMessage.content}
          </p>
        </div>

        {/* CTA 引导卡片 */}
        <div style={{
          background: "linear-gradient(135deg, #EFF6FF 0%, #F0FDF4 100%)",
          border: "1.5px solid rgba(30,87,221,0.18)",
          borderRadius: 16, padding: "18px 20px",
          display: "flex", flexDirection: "column", gap: 14,
        }}>
          <p style={{ fontSize: 13.5, lineHeight: 1.8, color: "var(--text-2)", margin: 0 }}>
            测完后，你可以先找我们领取《101高薪简历案例库》，看看同方向的优秀案例是怎么把经历讲清楚的。
          </p>
          <button
            onClick={() => {
              if (WECOM_LINK) {
                window.open(WECOM_LINK, "_blank", "noopener");
              } else {
                setShowQR(true);
              }
            }}
            style={{
              alignSelf: "flex-start",
              padding: "10px 22px", borderRadius: 10, border: "none",
              background: "linear-gradient(135deg, #1E57DD 0%, #1043B8 100%)",
              color: "#fff", fontSize: 14, fontWeight: 700, cursor: "pointer",
              letterSpacing: "0.02em", boxShadow: "0 4px 14px rgba(30,87,221,0.28)",
              transition: "transform 0.15s, box-shadow 0.15s",
            }}
            onMouseEnter={(e) => { e.currentTarget.style.transform = "translateY(-1px)"; e.currentTarget.style.boxShadow = "0 6px 18px rgba(30,87,221,0.36)"; }}
            onMouseLeave={(e) => { e.currentTarget.style.transform = ""; e.currentTarget.style.boxShadow = "0 4px 14px rgba(30,87,221,0.28)"; }}
          >
            免费领取案例库 →
          </button>
        </div>
      </ModuleCard>

      {showQR && <QRModal onClose={() => setShowQR(false)} />}
    </>
  );
}
