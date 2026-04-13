import { Link, useLocation } from "react-router-dom";
import { buildConversionSearch } from "../lib/conversion.js";

const FIT_COLORS = {
  "匹配度较高": "#10B981",
  "潜力明显": "#3B82F6",
  "需要补足": "#F59E0B",
};

function ModuleCard({ number, title, children, style }) {
  return (
    <div className="card" style={{ marginBottom: 16, ...style }}>
      {number && (
        <div style={{ fontSize: 11, fontWeight: 600, color: "var(--text-3)", letterSpacing: "0.08em", marginBottom: 4 }}>
          {number}
        </div>
      )}
      <div className="result-module-title">{title}</div>
      {children}
    </div>
  );
}

export function getFitColor(label) {
  return FIT_COLORS[label] ?? "#6B7280";
}

export default function ResultContent({ profile, result }) {
  const fitColor = getFitColor(result.fitLabel);
  const location = useLocation();
  const conversionSearch = buildConversionSearch({ profile, sourcePath: location.pathname });

  return (
    <>
      {/* Header score card */}
      <div className="card" style={{ marginBottom: 16, padding: "28px 24px" }}>
        <div style={{ display: "flex", justifyContent: "space-between", gap: 24, flexWrap: "wrap" }}>
          <div style={{ flex: "1 1 320px" }}>
            <div style={{ fontSize: 13, color: "var(--text-2)", marginBottom: 6 }}>岗位匹配度分析</div>
            <div style={{ fontSize: 32, fontWeight: 700, marginBottom: 8 }}>{result.roleName}</div>
            <p style={{ fontSize: 14, color: "var(--text-2)", lineHeight: 1.8 }}>
              {result.modules.selfAwareness.summary}
            </p>
            <div style={{ display: "flex", flexWrap: "wrap", gap: 8, marginTop: 14 }}>
              {result.modules.selfAwareness.coreCompetencies?.map((item) => (
                <span
                  key={item}
                  style={{
                    padding: "4px 10px",
                    borderRadius: 999,
                    background: "var(--accent-bg)",
                    color: "var(--accent)",
                    fontSize: 12,
                    border: "1px solid rgba(37, 99, 235, 0.16)",
                  }}
                >
                  {item}
                </span>
              ))}
            </div>
          </div>

          <div
            style={{
              minWidth: 180,
              padding: 20,
              borderRadius: 12,
              background: "linear-gradient(135deg, rgba(37,99,235,0.08), rgba(255,255,255,0.9))",
              border: "1px solid var(--border)",
              textAlign: "center",
            }}
          >
            <div style={{ fontSize: 13, color: "var(--text-2)", marginBottom: 8 }}>综合得分</div>
            <div style={{ fontSize: 52, fontWeight: 700, color: fitColor, lineHeight: 1 }}>{result.fitScore ?? result.score}</div>
            <div style={{ fontSize: 16, fontWeight: 700, color: fitColor, marginTop: 10 }}>{result.fitLabel}</div>
            <div style={{ fontSize: 13, color: "var(--text-2)", marginTop: 8 }}>
              {profile.majorName}
              {profile.targetCompany ? ` · 目标：${profile.targetCompany}` : ""}
            </div>
          </div>
        </div>
      </div>

      {/* 01 自我认知 */}
      <ModuleCard number="01" title="自我认知">
        {/* Compact dimension bars */}
        <div style={{ marginBottom: 16 }}>
          {result.dimensionRanking?.map((item) => (
            <div key={item.dimension} className="score-bar-row">
              <span className="score-bar-label">{item.label}</span>
              <div className="score-bar-track">
                <div
                  className="score-bar-fill"
                  style={{ width: `${item.score}%`, background: fitColor }}
                />
              </div>
              <span className="score-bar-value" style={{ color: fitColor }}>
                {item.score}%
              </span>
            </div>
          ))}
        </div>

        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))", gap: 16 }}>
          <div>
            <div className="skill-tag-label">你更容易建立优势的地方</div>
            <ul className="result-list">
              {result.modules.selfAwareness.positiveHighlights?.map((item) => (
                <li key={item}>{item}</li>
              ))}
            </ul>
          </div>
          <div>
            <div className="skill-tag-label">接下来更该补的地方</div>
            <ul className="result-list">
              {result.modules.selfAwareness.growthHints?.map((item) => (
                <li key={item}>{item}</li>
              ))}
            </ul>
          </div>
        </div>
      </ModuleCard>

      {/* 02 外界认知 */}
      <ModuleCard number="02" title="外界认知">
        <ul className="result-list" style={{ marginBottom: 16 }}>
          {result.modules.marketReality.content?.map((item) => (
            <li key={item}>{item}</li>
          ))}
        </ul>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))", gap: 16, marginBottom: 16 }}>
          <div>
            <div className="skill-tag-label">代表性公司</div>
            <div className="skill-tags">
              {result.modules.marketReality.topCompanies?.map((item) => (
                <span key={item} className="skill-tag">{item}</span>
              ))}
            </div>
          </div>
          <div>
            <div className="skill-tag-label">典型路径</div>
            <p style={{ fontSize: 14, color: "var(--text-2)", lineHeight: 1.7 }}>{result.modules.marketReality.careerPath}</p>
            <p style={{ fontSize: 13, color: "var(--text-2)", marginTop: 6 }}>参考薪资：{result.modules.marketReality.avgSalary}</p>
          </div>
        </div>
        <div>
          <div className="skill-tag-label">招聘方更看重什么</div>
          <div style={{ display: "grid", gap: 10 }}>
            {(result.modules.marketReality.requirements ?? []).map((item, index) => {
              const text = typeof item === "string" ? item : item.requirement;
              const category = typeof item === "string" ? "核心看重" : item.category;
              return (
                <div key={`${category}-${index}`} style={{ padding: 12, borderRadius: 10, border: "1px solid var(--border)" }}>
                  <div className="skill-tag-label">{category}</div>
                  <div style={{ fontSize: 14, lineHeight: 1.8 }}>{text}</div>
                </div>
              );
            })}
          </div>
        </div>
      </ModuleCard>

      {/* 03 行动指引 */}
      <ModuleCard number="03" title="行动指引">
        <div style={{ marginBottom: 20 }}>
          <div className="skill-tag-label">学业规划</div>
          <ul className="result-list">
            {result.modules.actionGuide.studyPlan?.map((item) => (
              <li key={item}>{item}</li>
            ))}
          </ul>
        </div>
        <div style={{ marginBottom: 20 }}>
          <div className="skill-tag-label">实习规划</div>
          <ul className="result-list">
            {result.modules.actionGuide.internshipPlan?.map((item) => (
              <li key={item}>{item}</li>
            ))}
          </ul>
        </div>
        <div>
          <div className="skill-tag-label">技能规划</div>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))", gap: 16, marginTop: 8 }}>
            <div>
              <div className="skill-tag-label">硬技能</div>
              <div className="skill-tags">
                {result.modules.actionGuide.skillPlan?.hardSkills?.map((item) => (
                  <span key={item} className="skill-tag">{item}</span>
                ))}
              </div>
            </div>
            <div>
              <div className="skill-tag-label">软技能</div>
              <div className="skill-tags">
                {result.modules.actionGuide.skillPlan?.softSkills?.map((item) => (
                  <span key={item} className="skill-tag">{item}</span>
                ))}
              </div>
            </div>
          </div>
        </div>
      </ModuleCard>

      {/* 04 结尾寄语 */}
      <ModuleCard number="04" title="结尾寄语" style={{ borderLeft: `4px solid ${fitColor}` }}>
        <p style={{ fontSize: 15, lineHeight: 1.9, fontStyle: "italic", color: "var(--text-1)" }}>
          "{result.modules.closingMessage.content}"
        </p>
        <div style={{ marginTop: 20, paddingTop: 16, borderTop: "1px solid var(--border)", display: "flex", gap: 10, flexWrap: "wrap" }}>
          <Link className="btn btn-primary" to={`/consultation?${conversionSearch}`} style={{ flex: "1 1 160px", textAlign: "center" }}>
            预约一对一咨询
          </Link>
          <Link className="btn btn-ghost" to={`/resume-diagnosis-bridge?${conversionSearch}`} style={{ flex: "1 1 160px", textAlign: "center" }}>
            进入简历诊断
          </Link>
        </div>
      </ModuleCard>
    </>
  );
}
