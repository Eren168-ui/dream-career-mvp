import { resultTemplates } from "../data/resultTemplates.js";
import { getOptionLabel } from "../lib/display.js";

const FIT_COLORS = {
  "匹配度较高": "#10B981",
  "潜力明显":   "#3B82F6",
  "需要补足":   "#F59E0B",
};

const FIT_SUMMARY = {
  "匹配度较高": (roleName) => `你现在和${roleName}已经比较搭，核心能力方向对了，接下来把最强的经历做成能投递的证据就行。`,
  "潜力明显":   (roleName) => `你对${roleName}有明显潜力，方向没问题，但还需要把经历转化成招聘方看得懂的证据。`,
  "需要补足":   (roleName) => `你现在不是方向错了，只是准备还不够充分，先把最弱的地方补上来，再系统整理简历。`,
};

export function getFitColor(label) {
  return FIT_COLORS[label] ?? "#6B7280";
}

function normalizeTraitItems(items = []) {
  return items.map((item) => {
    if (typeof item === "object" && item?.keyword) {
      const explanation = typeof item.explanation === "string" && item.explanation.trim().length > 0
        ? item.explanation
        : `这项能力已经有基础，继续往更稳定的发挥去打磨。`;

      return {
        ...item,
        explanation,
      };
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
function ModuleCard({ number, title, children, style }) {
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
        marginBottom: 18, letterSpacing: "-0.01em",
      }}>{title}</div>
      {children}
    </div>
  );
}

/* ── Insight card ── */
function InsightCard({ item, tone }) {
  const tones = {
    positive: {
      badgeColor: "#106B4E",
      badgeBg: "#EFFAF4",
      border: "#D7EDE2",
    },
    growth: {
      badgeColor: "#9A5A11",
      badgeBg: "#FFF6E7",
      border: "#F1E2C5",
    },
  };
  const palette = tones[tone] ?? tones.positive;

  return (
    <li className={`insight-card insight-card--${tone}`}>
      <span style={{
        display: "inline-flex",
        alignItems: "center",
        padding: "4px 10px",
        borderRadius: 999,
        background: palette.badgeBg,
        color: palette.badgeColor,
        border: `1px solid ${palette.border}`,
        fontSize: 12,
        fontWeight: 700,
        lineHeight: 1,
        width: "fit-content",
      }}>
        {item.keyword}
      </span>
      <div style={{ fontSize: 13, color: "var(--text-2)", lineHeight: 1.68 }}>
        {item.explanation}
      </div>
    </li>
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
      <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", gap: 16, marginBottom: 14, flexWrap: "wrap" }}>
        <div style={{ display: "grid", gap: 8 }}>
          <span style={{
            display: "inline-flex",
            alignItems: "center",
            width: "fit-content",
            background: `${c.badge}12`,
            color: c.badge,
            border: `1px solid ${c.line}`,
            fontSize: 11,
            fontWeight: 700,
            padding: "5px 10px",
            borderRadius: 999,
            letterSpacing: "0.04em",
          }}>
            {item.path} 路径
          </span>
          <div style={{ fontSize: 16, fontWeight: 700, color: "var(--text-1)", letterSpacing: "-0.02em" }}>
            {item.focus}
          </div>
        </div>
        <span style={{
          fontSize: 11,
          color: "var(--text-3)",
          letterSpacing: "0.04em",
          whiteSpace: "nowrap",
        }}>
          留学跨专业参考
        </span>
      </div>

      {[
        { label: "推荐专业", value: item.focus },
        { label: "学校参考", value: item.schools },
        { label: "适合人群", value: item.suitableFor },
        { label: "申请前补", value: item.nextStep },
      ].map(({ label, value }) => value && (
        <div key={label} style={{
          display: "grid",
          gridTemplateColumns: "72px 1fr",
          gap: 10,
          paddingTop: 10,
          marginTop: 10,
          borderTop: `1px solid ${c.line}`,
          alignItems: "flex-start",
        }}>
          <span style={{
            fontSize: 11,
            fontWeight: 700,
            color: c.badge,
            letterSpacing: "0.04em",
            paddingTop: 2,
          }}>{label}</span>
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
    const text = typeof item === "string" ? item : item.requirement;
    const cat  = typeof item === "string" ? "核心看重" : (item.category ?? "核心看重");
    if (grouped[cat]) grouped[cat].push(text);
    else grouped["核心看重"].push(text);
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
              {items.map((text, i) => (
                <li key={i} style={{
                  fontSize: 13, lineHeight: 1.75, color: "#111827",
                  marginBottom: i < items.length - 1 ? 4 : 0,
                  display: "flex", gap: 7,
                }}>
                  <span style={{ color, flexShrink: 0, fontWeight: 700 }}>·</span>
                  {text}
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
function NumberedSection({ num, label, children }) {
  return (
    <div style={{ marginBottom: 20 }}>
      <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 10 }}>
        <span style={{
          width: 20, height: 20,
          borderRadius: "50%",
          background: "#EFF6FF",
          color: "#2563EB",
          fontSize: 10, fontWeight: 700,
          display: "flex", alignItems: "center", justifyContent: "center",
          flexShrink: 0,
        }}>{num}</span>
        <span style={{ fontSize: 12, fontWeight: 700, color: "#374151", letterSpacing: "0.04em" }}>{label}</span>
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

/* ══════════════════════════════════════════════════════ */
export default function ResultContent({ profile, result }) {
  const fitColor = getFitColor(result.fitLabel);

  const selfAwareness  = result.modules.selfAwareness;
  const marketReality  = result.modules.marketReality;
  const actionGuide    = result.modules.actionGuide;
  const closingMessage = result.modules.closingMessage;

  const summaryText = (FIT_SUMMARY[result.fitLabel] ?? FIT_SUMMARY["需要补足"])(result.roleName);
  const strengthCards = normalizeTraitItems(selfAwareness.strengthCards ?? selfAwareness.positiveHighlights).slice(0, 3);
  const growthCards = normalizeTraitItems(selfAwareness.growthCards ?? selfAwareness.growthHints).slice(0, 3);

  // Internship plan split
  const internshipItems  = actionGuide.internshipPlan ?? [];
  const mid              = Math.ceil(internshipItems.length / 2);
  const internshipRole   = internshipItems.slice(0, mid);
  const internshipResume = internshipItems.slice(mid);

  // Overseas paths — always derive from template by roleId so old cached results still work
  const overseasPaths =
    (actionGuide.overseas?.length > 0 ? actionGuide.overseas : null)
    ?? resultTemplates[result.roleId ?? profile.targetRole]?.overseas
    ?? [];

  return (
    <>
      {/* ── Header score card ── */}
      <div className="card result-hero-card" style={{ marginBottom: 12, padding: "28px 30px" }}>
        <div style={{ display: "flex", gap: 24, flexWrap: "wrap", alignItems: "center" }}>
          <div style={{ flex: "1 1 260px" }}>
            <div style={{ fontSize: 11, color: "var(--text-3)", marginBottom: 5, letterSpacing: "0.06em" }}>
              职业准备度测评结果
            </div>
            <div style={{ fontSize: 22, fontWeight: 700, marginBottom: 10, color: "var(--text-1)", letterSpacing: "-0.02em" }}>
              {result.roleName}
            </div>
            <p style={{ fontSize: 14, color: "var(--text-2)", lineHeight: 1.8, maxWidth: 400, margin: 0 }}>
              {summaryText}
            </p>
            <div className="result-hero-meta">
              {profile.targetCompany ? <span className="result-meta-pill">目标公司：{profile.targetCompany}</span> : null}
              {profile.resumeStage ? <span className="result-meta-pill">当前阶段：{getOptionLabel("resumeStage", profile.resumeStage)}</span> : null}
              {profile.studyRegion === "overseas" ? <span className="result-meta-pill">已考虑留学路径</span> : null}
            </div>
          </div>

          <div style={{
            minWidth: 130,
            padding: "16px 20px",
            borderRadius: 12,
            background: `${fitColor}0D`,
            border: `1px solid ${fitColor}28`,
            textAlign: "center",
            flexShrink: 0,
          }}>
            <div style={{ fontSize: 10, color: "var(--text-3)", marginBottom: 6, letterSpacing: "0.06em" }}>综合得分</div>
            <div style={{ fontSize: 44, fontWeight: 700, color: fitColor, lineHeight: 1 }}>
              {result.fitScore ?? result.score}
            </div>
            <div style={{ fontSize: 13, fontWeight: 700, color: fitColor, marginTop: 7 }}>{result.fitLabel}</div>
            {profile.majorName && (
              <div style={{ fontSize: 11, color: "var(--text-3)", marginTop: 5 }}>{profile.majorName}</div>
            )}
          </div>
        </div>
      </div>

      {/* ── 01 自我认知 ── */}
      <ModuleCard number="01" title="自我认知">
        {/* Dimension score bars */}
        <div style={{ marginBottom: 22 }}>
          {result.dimensionRanking?.map((item) => (
            <div key={item.dimension} className="score-bar-row">
              <span className="score-bar-label" style={{ fontSize: 12, color: "var(--text-2)" }}>{item.label}</span>
              <div className="score-bar-track">
                <div className="score-bar-fill" style={{ width: `${item.score}%`, background: fitColor }} />
              </div>
              <span className="score-bar-value" style={{ color: fitColor, fontSize: 12 }}>{item.score}</span>
            </div>
          ))}
        </div>

        <div className="trait-columns">
          <div className="trait-panel trait-panel--positive">
            <div className="trait-panel__title">你的优势</div>
            <ul className="trait-list">
              {strengthCards.map((item, i) => (
                <InsightCard key={`${item.keyword}-${i}`} item={item} tone="positive" />
              ))}
            </ul>
          </div>
          <div className="trait-panel trait-panel--growth">
            <div className="trait-panel__title">你当前更该补的地方</div>
            <ul className="trait-list">
              {growthCards.map((item, i) => (
                <InsightCard key={`${item.keyword}-${i}`} item={item} tone="growth" />
              ))}
            </ul>
          </div>
        </div>
      </ModuleCard>

      {/* ── 02 外界认知 ── */}
      <ModuleCard number="02" title="外界认知">
        <NumberedSection num="1" label="这个岗位每天在做什么">
          <ul style={{ margin: 0, padding: 0, listStyle: "none" }}>
            {marketReality.content?.map((item, i) => (
              <li key={i} style={{
                display: "flex", gap: 8,
                fontSize: 13, color: "var(--text-2)", lineHeight: 1.75,
                marginBottom: 5,
              }}>
                <span style={{ color: "var(--accent)", flexShrink: 0, fontWeight: 700 }}>·</span>
                {item}
              </li>
            ))}
          </ul>
        </NumberedSection>

        <NumberedSection num="2" label="招聘方最看重什么">
          <RequirementsGroup requirements={marketReality.requirements} />
        </NumberedSection>

        <NumberedSection num="3" label="代表性公司">
          <div className="skill-tags">
            {marketReality.topCompanies?.map((item) => (
              <span key={item} className="skill-tag">{item}</span>
            ))}
          </div>
        </NumberedSection>

        <NumberedSection num="4" label="典型路径与参考薪资">
          <p style={{ fontSize: 13, color: "var(--text-2)", lineHeight: 1.7, margin: 0 }}>
            {marketReality.careerPath}
          </p>
          {marketReality.avgSalary && (
            <p style={{ fontSize: 12, color: "var(--text-3)", marginTop: 5 }}>
              参考薪资：{marketReality.avgSalary}
            </p>
          )}
        </NumberedSection>
      </ModuleCard>

      {/* ── 03 行动指引 ── */}
      <ModuleCard number="03" title="行动指引">
        <div className="action-guide-stack">
          <SubSection label="A · 学业规划与留学路径">
          {actionGuide.studyPlan?.length > 0 && (
            <div style={{ marginBottom: 16 }}>
              <MiniLabel>课程补足方向</MiniLabel>
              <ul className="result-list">
                {actionGuide.studyPlan.map((item, i) => <li key={i}>{item}</li>)}
              </ul>
            </div>
          )}

          {overseasPaths.length > 0 && (
            <div>
              <MiniLabel>留学跨专业路径参考</MiniLabel>
              <div style={{
                fontSize: 12, color: "var(--text-3)", lineHeight: 1.6,
                marginBottom: 12, paddingLeft: 2,
              }}>
                如果你考虑通过留学切入{result.roleName}方向，以下是三个主要路径的选专业建议。
              </div>
              {overseasPaths.map((item, i) => (
                <OverseasCard key={i} item={item} />
              ))}
            </div>
          )}
          </SubSection>

          <SubSection label="B · 实习规划">
          <div style={{ marginBottom: 14 }}>
            <MiniLabel>优先投递这类岗位</MiniLabel>
            <ul className="result-list">
              {internshipRole.map((item, i) => <li key={i}>{item}</li>)}
            </ul>
          </div>
          <div>
            <MiniLabel>简历要体现这些关键词</MiniLabel>
            <ul className="result-list">
              {internshipResume.length > 0
                ? internshipResume.map((item, i) => <li key={i}>{item}</li>)
                : <li>参考目标岗位 JD，提炼 3–5 个高频关键词写进简历。</li>
              }
            </ul>
          </div>
          </SubSection>

          <SubSection label="C · 技能规划">
          <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
            <div>
              <MiniLabel>硬技能</MiniLabel>
              <div className="skill-tags skill-tags--soft-wrap">
                {actionGuide.skillPlan?.hardSkills?.map((item) => (
                  <span key={item} className="skill-tag">{item}</span>
                ))}
              </div>
            </div>
            <div>
              <MiniLabel>软技能</MiniLabel>
              <div className="skill-tags skill-tags--soft-wrap">
                {actionGuide.skillPlan?.softSkills?.map((item) => (
                  <span key={item} className="skill-tag">{item}</span>
                ))}
              </div>
            </div>
          </div>
          </SubSection>
        </div>
      </ModuleCard>

      {/* ── 04 结尾寄语 ── */}
      <ModuleCard
        number="04"
        title="写在最后"
        style={{ borderLeft: `3px solid ${fitColor}` }}
      >
        <p style={{ fontSize: 14, lineHeight: 1.95, color: "var(--text-2)", marginBottom: 16 }}>
          {closingMessage.content}
        </p>
        <p style={{ fontSize: 12, color: "var(--text-3)", lineHeight: 1.7 }}>
          测完后，可向老师领取《101高薪简历案例库》，继续参考同方向案例是怎么把经历讲清楚的。
        </p>
      </ModuleCard>
    </>
  );
}
