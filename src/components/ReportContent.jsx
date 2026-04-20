import { Link, useLocation } from "react-router-dom";
import { buildConversionSearch } from "../lib/conversion.js";

/* ===== Primitive helpers ===== */

function Section({ title, subtitle, accent, children }) {
  return (
    <div className="card" style={{ marginBottom: 16 }}>
      <div style={{ marginBottom: 16 }}>
        <div className="result-module-title">{title}</div>
        {subtitle && (
          <p style={{ fontSize: 13, color: "var(--text-2)", marginTop: 4, lineHeight: 1.6 }}>{subtitle}</p>
        )}
        {accent && (
          <div style={{
            marginTop: 10,
            padding: "8px 14px",
            borderRadius: 8,
            background: "var(--accent-bg)",
            fontSize: 13,
            color: "var(--accent)",
            fontWeight: 500,
          }}>{accent}</div>
        )}
      </div>
      {children}
    </div>
  );
}

function Tag({ children, color }) {
  const styles = {
    blue:   { background: "#EDF3FF", color: "#1E5AE7" },
    orange: { background: "#FFF7ED", color: "#C2410C" },
    green:  { background: "#F0FDF4", color: "#15803D" },
    gray:   { background: "var(--surface-2)", color: "var(--text-2)" },
    red:    { background: "#FEF2F2", color: "#B91C1C" },
  };
  const s = styles[color] ?? styles.gray;
  return (
    <span style={{
      display: "inline-block",
      padding: "2px 10px",
      borderRadius: 20,
      fontSize: 12,
      fontWeight: 600,
      ...s,
    }}>{children}</span>
  );
}

function InfoGrid({ items }) {
  return (
    <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(160px, 1fr))", gap: 10, marginTop: 14 }}>
      {items.map(({ label, value }) => (
        <div key={label} style={{ padding: 14, borderRadius: 10, background: "var(--surface-2)" }}>
          <div style={{ fontSize: 11, color: "var(--text-3)", fontWeight: 600, marginBottom: 4, textTransform: "uppercase", letterSpacing: "0.05em" }}>{label}</div>
          <div style={{ fontWeight: 700, fontSize: 14 }}>{value}</div>
        </div>
      ))}
    </div>
  );
}

function ActionItem({ prefix, text, note, prefixColor }) {
  const colorMap = {
    P0: "#B91C1C", P1: "#C2410C", P2: "#15803D",
    blue: "#1E5AE7", gray: "var(--text-2)",
  };
  const c = colorMap[prefixColor ?? prefix] ?? "var(--text-2)";
  return (
    <div style={{ display: "flex", gap: 12, alignItems: "flex-start", paddingBottom: 12, borderBottom: "1px solid var(--border)" }}>
      {prefix && (
        <span style={{
          flexShrink: 0,
          minWidth: 36,
          textAlign: "center",
          padding: "2px 8px",
          borderRadius: 6,
          fontSize: 11,
          fontWeight: 700,
          background: c + "18",
          color: c,
        }}>{prefix}</span>
      )}
      <div style={{ flex: 1 }}>
        <div style={{ fontSize: 14, lineHeight: 1.8 }}>{text}</div>
        {note && <div style={{ fontSize: 12, color: "var(--text-3)", marginTop: 4 }}>{note}</div>}
      </div>
    </div>
  );
}

/* ===== Section 1: 诊断总览 ===== */
function DiagnosisOverview({ report, profile }) {
  const severityColor = { high: "red", medium: "orange", low: "green" };
  const severityLabel = { high: "严重", medium: "中等", low: "轻微" };

  return (
    <Section
      title="简历核心诊断"
      subtitle={`当前简历与「${report.roleName}」岗位的核心差距分析，重点看最该补什么。`}
    >
      <InfoGrid items={[
        { label: "目标岗位", value: report.roleName },
        { label: "当前判断", value: report.bridgeSummary.fitLabel },
        { label: "最大缺口", value: report.bridgeSummary.keyGaps.slice(0, 2).join(" · ") || "尚待评估" },
        { label: "已有优势", value: report.bridgeSummary.keyStrengths.slice(0, 2).join(" · ") || "基础能力" },
      ]} />

      <p style={{ fontSize: 14, color: "var(--text-2)", lineHeight: 1.85, marginTop: 14 }}>{report.bridgeSummary.summary}</p>

      <div style={{ marginTop: 14 }}>
        <div style={{ fontSize: 13, fontWeight: 600, marginBottom: 10, color: "var(--text-2)" }}>具体问题诊断：</div>
        <div style={{ display: "grid", gap: 10 }}>
          {report.currentResumeIssues.map((item, i) => (
            <div key={i} style={{
              display: "flex",
              gap: 10,
              alignItems: "flex-start",
              padding: "12px 14px",
              borderRadius: 10,
              border: "1px solid var(--border)",
              background: item.severity === "high" ? "#FFF7ED" : item.severity === "medium" ? "#F8FAFC" : "#F0FDF4",
            }}>
              <Tag color={severityColor[item.severity]}>{severityLabel[item.severity]}</Tag>
              <div style={{ fontSize: 14, lineHeight: 1.8 }}>{item.issue}</div>
            </div>
          ))}
        </div>
      </div>

      <div style={{ marginTop: 14 }}>
        <div style={{ fontSize: 13, fontWeight: 600, marginBottom: 10, color: "var(--text-2)" }}>岗位核心要求：</div>
        <div style={{ display: "grid", gap: 8 }}>
          {report.targetRoleRequirements.map((item, i) => (
            <div key={i} style={{ display: "flex", gap: 10, alignItems: "flex-start" }}>
              <Tag color={item.category.includes("准入") ? "red" : item.category.includes("核心") ? "blue" : "gray"}>
                {item.category}
              </Tag>
              <div style={{ fontSize: 14, lineHeight: 1.8 }}>{item.requirement}</div>
            </div>
          ))}
        </div>
      </div>

      <div style={{ marginTop: 14 }}>
        <div style={{ fontSize: 13, fontWeight: 600, marginBottom: 10, color: "var(--text-2)" }}>能力差距详情：</div>
        <div style={{ display: "grid", gap: 10 }}>
          {report.gapAnalysis.map((item) => (
            <div key={item.dimension} style={{ padding: "12px 14px", borderRadius: 10, border: "1px solid var(--border)" }}>
              <div style={{ display: "flex", justifyContent: "space-between", gap: 12, alignItems: "center", marginBottom: 6 }}>
                <strong style={{ fontSize: 14 }}>{item.dimension}</strong>
                <Tag color={item.currentStatus === "已具备" ? "green" : item.currentStatus === "部分具备" ? "orange" : "red"}>
                  {item.currentStatus}
                </Tag>
              </div>
              <p style={{ fontSize: 13, color: "var(--text-2)", lineHeight: 1.7, margin: 0 }}>{item.description}</p>
            </div>
          ))}
        </div>
      </div>
    </Section>
  );
}

/* ===== Section 2: 周期规划 ===== */
function CyclePlanning({ report, profile }) {
  const { timelineContext, phasePlan } = report;

  const phases = [
    { key: "sophomore", label: "大一 · 大二", goal: "探索方向，积累基础经历", items: phasePlan.sophomore },
    { key: "junior",    label: "大三",        goal: "实习突破，案例成型",     items: phasePlan.junior },
    { key: "grad",      label: "大四 / 毕业前", goal: "冲刺收口，面试打磨",  items: phasePlan.beforeGraduation },
  ];

  return (
    <Section
      title="周期规划"
      subtitle="根据你当前阶段，分阶段说明每个时期该做什么——不是给你学习计划，而是告诉你每个阶段应该产出什么。"
      accent={timelineContext ? `当前处于「${timelineContext.yearContext.phase}」（时间窗口：${timelineContext.yearContext.window}）` : null}
    >
      {timelineContext && (
        <div style={{ marginBottom: 16 }}>
          <p style={{ fontSize: 14, color: "var(--text-2)", lineHeight: 1.85, marginBottom: 10 }}>{timelineContext.summary}</p>
          <div style={{ padding: 14, borderRadius: 10, background: "#F8FAFC", border: "1px solid var(--border)", fontSize: 14, lineHeight: 1.85, color: "var(--text-2)" }}>
            <strong>本学期聚焦：</strong>{timelineContext.currentFocus}
          </div>
        </div>
      )}

      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))", gap: 12 }}>
        {phases.map((phase) => (
          <div key={phase.key} style={{ padding: 16, borderRadius: 12, border: "1px solid var(--border)", background: "var(--surface-2)" }}>
            <div style={{ fontSize: 13, fontWeight: 700, color: "var(--accent)", marginBottom: 4 }}>{phase.label}</div>
            <div style={{ fontSize: 12, color: "var(--text-2)", marginBottom: 10 }}>{phase.goal}</div>
            <ul style={{ listStyle: "none", padding: 0, margin: 0, display: "grid", gap: 8 }}>
              {(phase.items ?? []).map((item, i) => {
                const text = typeof item === "string" ? item : item.action ?? item.item ?? "";
                return (
                  <li key={i} style={{ display: "flex", gap: 8, alignItems: "flex-start" }}>
                    <span style={{ color: "var(--accent)", fontWeight: 700, flexShrink: 0, marginTop: 1 }}>·</span>
                    <span style={{ fontSize: 13, lineHeight: 1.7 }}>{text}</span>
                  </li>
                );
              })}
            </ul>
          </div>
        ))}
      </div>

      {report.currentSemesterActions?.length > 0 && (
        <div style={{ marginTop: 14 }}>
          <div style={{ fontSize: 13, fontWeight: 600, marginBottom: 10, color: "var(--text-2)" }}>本学期优先行动：</div>
          <div style={{ display: "grid", gap: 8 }}>
            {report.currentSemesterActions.map((item, i) => (
              <ActionItem key={i} prefix={item.priority} text={item.action} />
            ))}
          </div>
        </div>
      )}
    </Section>
  );
}

/* ===== Section 3: 阶段积累目标 ===== */
function StageAccumulationTargets({ report }) {
  const targets = report.stageAccumulationTargets;
  if (!targets) return null;

  return (
    <Section
      title="阶段积累目标"
      subtitle="不同阶段该补什么、该产出什么——要求具体到「动作 + 可交付物」，不接受「建议提升」这种废话。"
    >
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14 }}>
        {/* 当前阶段 */}
        <div style={{ padding: 16, borderRadius: 12, border: "2px solid var(--accent)", background: "var(--accent-bg)" }}>
          <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 10 }}>
            <span style={{ padding: "2px 10px", borderRadius: 20, background: "var(--accent)", color: "#fff", fontSize: 12, fontWeight: 700 }}>
              当前
            </span>
            <span style={{ fontSize: 14, fontWeight: 700 }}>{targets.currentStageName}</span>
          </div>
          <div style={{ fontSize: 12, color: "var(--accent)", marginBottom: 10, fontWeight: 500 }}>目标：{targets.currentStageGoal}</div>
          <ul style={{ listStyle: "none", padding: 0, margin: 0, display: "grid", gap: 10 }}>
            {targets.currentPriority.map((item, i) => (
              <li key={i} style={{ display: "flex", gap: 8, alignItems: "flex-start" }}>
                <span style={{ color: "var(--accent)", fontWeight: 700, flexShrink: 0, marginTop: 2 }}>{i + 1}.</span>
                <span style={{ fontSize: 13, lineHeight: 1.7 }}>{item}</span>
              </li>
            ))}
          </ul>
        </div>

        {/* 下一阶段 */}
        <div style={{ padding: 16, borderRadius: 12, border: "1px solid var(--border)", background: "var(--surface-2)" }}>
          <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 10 }}>
            <span style={{ padding: "2px 10px", borderRadius: 20, background: "var(--surface-3)", color: "var(--text-2)", fontSize: 12, fontWeight: 700 }}>
              下一阶段
            </span>
            <span style={{ fontSize: 14, fontWeight: 700 }}>{targets.nextStageName}</span>
          </div>
          <div style={{ fontSize: 12, color: "var(--text-2)", marginBottom: 10, fontWeight: 500 }}>目标：{targets.nextStageGoal}</div>
          <ul style={{ listStyle: "none", padding: 0, margin: 0, display: "grid", gap: 10 }}>
            {targets.nextStagePriority.map((item, i) => (
              <li key={i} style={{ display: "flex", gap: 8, alignItems: "flex-start" }}>
                <span style={{ color: "var(--text-3)", fontWeight: 700, flexShrink: 0, marginTop: 2 }}>{i + 1}.</span>
                <span style={{ fontSize: 13, lineHeight: 1.7, color: "var(--text-2)" }}>{item}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>

      <div style={{
        marginTop: 14,
        padding: "12px 16px",
        borderRadius: 10,
        background: "#FFFBEB",
        border: "1px solid #FDE68A",
        fontSize: 13,
        lineHeight: 1.7,
        color: "#92400E",
      }}>
        <strong>最终积累目标：</strong>{targets.longTermGoal}
      </div>

      {/* 三维路线 */}
      <div style={{ marginTop: 16 }}>
        <div style={{ fontSize: 13, fontWeight: 600, marginBottom: 10, color: "var(--text-2)" }}>三维积累路线（学业 / 实习 / 技能）：</div>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: 10 }}>
          <div style={{ padding: 14, borderRadius: 10, border: "1px solid var(--border)" }}>
            <div style={{ fontSize: 12, fontWeight: 600, color: "var(--text-2)", marginBottom: 8 }}>学业方向</div>
            <ul style={{ listStyle: "none", padding: 0, margin: 0, display: "grid", gap: 6 }}>
              {report.threeDimensionRoadmap.academics.map((a, i) => (
                <li key={i} style={{ fontSize: 13, lineHeight: 1.65, display: "flex", gap: 6, alignItems: "flex-start" }}>
                  <span style={{ color: "var(--accent)", flexShrink: 0 }}>·</span>{a.item}
                </li>
              ))}
            </ul>
          </div>
          <div style={{ padding: 14, borderRadius: 10, border: "1px solid var(--border)" }}>
            <div style={{ fontSize: 12, fontWeight: 600, color: "var(--text-2)", marginBottom: 8 }}>实习方向</div>
            <ul style={{ listStyle: "none", padding: 0, margin: 0, display: "grid", gap: 6 }}>
              {report.threeDimensionRoadmap.internships.map((a, i) => (
                <li key={i} style={{ fontSize: 13, lineHeight: 1.65, display: "flex", gap: 6, alignItems: "flex-start" }}>
                  <span style={{ color: "var(--accent)", flexShrink: 0 }}>·</span>{a.item}
                </li>
              ))}
            </ul>
          </div>
          <div style={{ padding: 14, borderRadius: 10, border: "1px solid var(--border)" }}>
            <div style={{ fontSize: 12, fontWeight: 600, color: "var(--text-2)", marginBottom: 8 }}>技能方向</div>
            <div style={{ display: "flex", flexWrap: "wrap", gap: 6 }}>
              {report.threeDimensionRoadmap.skills.slice(0, 8).map((s, i) => (
                <span key={i} style={{ padding: "3px 10px", borderRadius: 6, background: "var(--surface-2)", fontSize: 12, color: "var(--text-2)" }}>
                  {s.item}
                </span>
              ))}
            </div>
          </div>
        </div>
      </div>
    </Section>
  );
}

/* ===== Section 4: 案例分析 ===== */
function CaseAnalysis({ report }) {
  if (!report.caseAnalysis?.length) return null;

  return (
    <Section
      title="案例分析"
      subtitle="参考真实成长路径——不是编故事，而是让你看清楚「类似背景的人是怎么一步步补齐经历的」。"
    >
      <div style={{ display: "grid", gap: 14 }}>
        {report.caseAnalysis.map((item, i) => (
          <div key={i} style={{ padding: 16, borderRadius: 12, border: "1px solid var(--border)" }}>
            <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 10 }}>
              <span style={{ width: 28, height: 28, borderRadius: "50%", background: "var(--accent)", color: "#fff", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 13, fontWeight: 700, flexShrink: 0 }}>
                {i + 1}
              </span>
              <strong style={{ fontSize: 15 }}>{item.name ?? `参考案例 ${i + 1}`}</strong>
            </div>

            <div style={{ display: "grid", gap: 8 }}>
              {item.background && (
                <div style={{ display: "flex", gap: 8, alignItems: "flex-start" }}>
                  <Tag color="gray">背景</Tag>
                  <span style={{ fontSize: 13, lineHeight: 1.7 }}>{item.background}</span>
                </div>
              )}
              {item.keyMove && (
                <div style={{ display: "flex", gap: 8, alignItems: "flex-start" }}>
                  <Tag color="blue">关键动作</Tag>
                  <span style={{ fontSize: 13, lineHeight: 1.7 }}>{item.keyMove}</span>
                </div>
              )}
              {(item.lesson ?? item.takeaway) && (
                <div style={{
                  padding: "10px 12px",
                  borderRadius: 8,
                  background: "var(--accent-bg)",
                  fontSize: 13,
                  lineHeight: 1.7,
                  color: "var(--accent)",
                  marginTop: 4,
                }}>
                  <strong>可借鉴点：</strong>{item.lesson ?? item.takeaway}
                </div>
              )}
            </div>
          </div>
        ))}
      </div>
    </Section>
  );
}

/* ===== Section 5: 留学联动建议 ===== */
function OverseasLinkage({ report }) {
  if (!report.overseasPathSuggestions?.length) return null;

  return (
    <Section
      title="留学路径与职业目标联动"
      subtitle={`留学不是为了学历，而是为了补齐「${report.roleName}」所需要的方法论训练和可讲案例。下面说清楚为什么留学、去哪里留、留完回来怎么衔接就业。`}
    >
      {report.overseasPathSuggestions[0]?.careerLinkage && (
        <div style={{
          marginBottom: 14,
          padding: "12px 16px",
          borderRadius: 10,
          background: "#F0FDF4",
          border: "1px solid #86EFAC",
          fontSize: 13,
          lineHeight: 1.75,
          color: "#15803D",
        }}>
          {report.overseasPathSuggestions[0].careerLinkage}
        </div>
      )}

      <div style={{ display: "grid", gap: 14 }}>
        {report.overseasPathSuggestions.map((item, i) => (
          <div key={i} style={{ padding: 16, borderRadius: 12, border: "1px solid var(--border)" }}>
            <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 12 }}>
              <Tag color="blue">{item.path}</Tag>
              {item.focus && <span style={{ fontSize: 13, fontWeight: 600 }}>{item.focus.split("。")[0]}</span>}
            </div>
            <div style={{ display: "grid", gap: 8 }}>
              {item.schools && (
                <div>
                  <span style={{ fontSize: 11, color: "var(--text-3)", fontWeight: 600, textTransform: "uppercase" }}>参考学校 · </span>
                  <span style={{ fontSize: 13, color: "var(--text-2)" }}>{item.schools}</span>
                </div>
              )}
              {item.condition && (
                <div style={{ display: "flex", gap: 6, alignItems: "flex-start" }}>
                  <Tag color="orange">申请条件</Tag>
                  <span style={{ fontSize: 13, lineHeight: 1.7 }}>{item.condition}</span>
                </div>
              )}
              {item.advantage && (
                <div style={{ display: "flex", gap: 6, alignItems: "flex-start" }}>
                  <Tag color="green">路径优势</Tag>
                  <span style={{ fontSize: 13, lineHeight: 1.7 }}>{item.advantage}</span>
                </div>
              )}
              {item.suitableFor && (
                <div style={{ fontSize: 13, color: "var(--text-2)", lineHeight: 1.7 }}>
                  <strong>更适合：</strong>{item.suitableFor}
                </div>
              )}
              {item.nextStep && (
                <div style={{
                  padding: "8px 12px",
                  borderRadius: 8,
                  background: "#FFFBEB",
                  border: "1px solid #FDE68A",
                  fontSize: 13,
                  lineHeight: 1.7,
                  color: "#92400E",
                }}>
                  <strong>当前提醒：</strong>{item.nextStep}
                </div>
              )}
            </div>
            {item.hook && (
              <p style={{ fontSize: 12, color: "var(--text-3)", lineHeight: 1.65, marginTop: 10 }}>{item.hook}</p>
            )}
          </div>
        ))}
      </div>

      <p style={{ fontSize: 13, color: "var(--text-3)", lineHeight: 1.8, marginTop: 14 }}>
        如需针对 {report.roleName} 方向制定更具体的留学规划，可预约一对一咨询。
      </p>
    </Section>
  );
}

/* ===== Section 6: 行动清单 ===== */
function DetailedActionPlan({ report }) {
  const plan = report.detailedActionPlan;
  if (!plan) return null;

  const timeblocks = [
    {
      label: "接下来 30 天",
      sublabel: "马上能做的事",
      color: "#B91C1C",
      bg: "#FEF2F2",
      border: "#FECACA",
      items: plan.thirtyDays.map((item) => ({
        action: item.action,
        note: item.why,
      })),
    },
    {
      label: "本学期内",
      sublabel: "这段时间要形成的结果",
      color: "#C2410C",
      bg: "#FFF7ED",
      border: "#FED7AA",
      items: plan.oneSemester.map((item) => ({
        action: item.action,
        note: item.milestone,
      })),
    },
    {
      label: "未来一年",
      sublabel: "一年后要达到的状态",
      color: "#15803D",
      bg: "#F0FDF4",
      border: "#86EFAC",
      items: plan.oneYear.map((item) => ({
        action: item.action,
        note: item.milestone,
      })),
    },
  ];

  return (
    <Section
      title="行动清单"
      subtitle="把报告翻译成可执行的时间节点——每个时间段说清楚做什么、做完后要达到什么状态。"
    >
      <div style={{ display: "grid", gap: 14 }}>
        {timeblocks.map((block) => (
          <div key={block.label} style={{ padding: 16, borderRadius: 12, border: `1px solid ${block.border}`, background: block.bg }}>
            <div style={{ marginBottom: 12 }}>
              <span style={{ fontSize: 15, fontWeight: 700, color: block.color }}>{block.label}</span>
              <span style={{ fontSize: 12, color: block.color, marginLeft: 8, opacity: 0.7 }}>{block.sublabel}</span>
            </div>
            <div style={{ display: "grid", gap: 10 }}>
              {block.items.map((item, i) => (
                <div key={i} style={{ display: "flex", gap: 10, alignItems: "flex-start" }}>
                  <span style={{
                    flexShrink: 0,
                    width: 22,
                    height: 22,
                    borderRadius: "50%",
                    background: block.color,
                    color: "#fff",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    fontSize: 11,
                    fontWeight: 700,
                    marginTop: 1,
                  }}>{i + 1}</span>
                  <div style={{ flex: 1 }}>
                    <div style={{ fontSize: 13, lineHeight: 1.75 }}>{item.action}</div>
                    {item.note && (
                      <div style={{ fontSize: 12, color: block.color, opacity: 0.8, marginTop: 4, lineHeight: 1.5, fontStyle: "italic" }}>
                        → {item.note}
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>

      {/* Legacy nextActions as compact list */}
      {report.nextActions?.length > 0 && (
        <div style={{ marginTop: 14 }}>
          <div style={{ fontSize: 13, fontWeight: 600, marginBottom: 8, color: "var(--text-2)" }}>近期优先事项：</div>
          <div style={{ display: "grid", gap: 8 }}>
            {report.nextActions.map((item, i) => (
              <div key={i} style={{ display: "flex", gap: 10, alignItems: "flex-start" }}>
                <Tag color="blue">{item.timeframe}</Tag>
                <div style={{ fontSize: 13, lineHeight: 1.75 }}>{item.action}</div>
              </div>
            ))}
          </div>
        </div>
      )}
    </Section>
  );
}

/* ===== Main export ===== */
export default function ReportContent({ profile, result, report }) {
  const location = useLocation();
  const conversionSearch = buildConversionSearch({ profile, sourcePath: location.pathname });

  return (
    <>
      <DiagnosisOverview report={report} profile={profile} />
      <CyclePlanning report={report} profile={profile} />
      <StageAccumulationTargets report={report} />
      <CaseAnalysis report={report} />
      <OverseasLinkage report={report} />
      <DetailedActionPlan report={report} />

      <div className="card" style={{ marginBottom: 16 }}>
        <div className="result-module-title">继续推进</div>
        <p style={{ fontSize: 14, color: "var(--text-2)", lineHeight: 1.8, marginBottom: 14 }}>
          这份报告已经把「当前差距 → 周期规划 → 积累目标 → 案例参考 → 行动清单」全部拆清楚了。
          如果你想把某一块继续拆细或者拿到更个性化的建议，可以进入咨询、案例或简历诊断。
        </p>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: 12 }}>
          <Link className="btn btn-primary" to={`/consultation?${conversionSearch}`}>预约一对一咨询</Link>
          <Link className="btn btn-ghost" to={`/resume-cases?${conversionSearch}`}>领取同岗位案例</Link>
          <Link className="btn btn-ghost" to={`/resume-diagnosis-bridge?${conversionSearch}`}>上传简历获取诊断</Link>
        </div>
      </div>
    </>
  );
}
