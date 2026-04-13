import { Link, useLocation } from "react-router-dom";
import { buildConversionSearch } from "../lib/conversion.js";

function ListBlock({ items }) {
  return (
    <ul className="result-list">
      {items.map((item, index) => {
        const text =
          typeof item === "string"
            ? item
            : item.issue ?? item.requirement ?? item.description ?? item.action ?? item.item ?? item.path ?? item.background ?? item.lesson ?? "";

        return <li key={`${text}-${index}`}>{text}</li>;
      })}
    </ul>
  );
}

function Section({ title, children }) {
  return (
    <div className="card" style={{ marginBottom: 16 }}>
      <div className="result-module-title">{title}</div>
      {children}
    </div>
  );
}

export default function ReportContent({ profile, result, report }) {
  const location = useLocation();
  const conversionSearch = buildConversionSearch({ profile, sourcePath: location.pathname });

  return (
    <>
      <Section title="从岗位匹配度分析到差距分析">
        <p style={{ fontSize: 14, color: "var(--text-2)", lineHeight: 1.85 }}>{report.bridgeSummary.summary}</p>
        {report.bridgeSummary.bridgeNote ? (
          <p style={{ fontSize: 14, color: "var(--text-2)", lineHeight: 1.85, marginTop: 10 }}>
            {report.bridgeSummary.bridgeNote}
          </p>
        ) : null}
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))", gap: 12, marginTop: 16 }}>
          <div style={{ padding: 14, borderRadius: 10, background: "var(--surface-2)" }}>
            <div className="skill-tag-label">目标岗位</div>
            <div style={{ fontWeight: 700 }}>{report.roleName}</div>
          </div>
          <div style={{ padding: 14, borderRadius: 10, background: "var(--surface-2)" }}>
            <div className="skill-tag-label">当前判断</div>
            <div style={{ fontWeight: 700 }}>{report.bridgeSummary.fitLabel}</div>
          </div>
          <div style={{ padding: 14, borderRadius: 10, background: "var(--surface-2)" }}>
            <div className="skill-tag-label">优先补足</div>
            <div style={{ fontWeight: 700 }}>{report.bridgeSummary.keyGaps.join("、") || "岗位证据"}</div>
          </div>
          <div style={{ padding: 14, borderRadius: 10, background: "var(--surface-2)" }}>
            <div className="skill-tag-label">已有优势</div>
            <div style={{ fontWeight: 700 }}>{report.bridgeSummary.keyStrengths.join("、") || "基础能力"}</div>
          </div>
        </div>
      </Section>

      <Section title="当前简历问题诊断">
        <div style={{ display: "grid", gap: 10 }}>
          {report.currentResumeIssues.map((item) => (
            <div
              key={item.issue}
              style={{
                padding: 14,
                borderRadius: 10,
                border: "1px solid var(--border)",
                background: item.severity === "high" ? "#FFF7ED" : item.severity === "medium" ? "#F8FAFC" : "#F0FDF4",
              }}
            >
              <div className="skill-tag-label">严重度：{item.severity}</div>
              <div style={{ fontSize: 14, lineHeight: 1.8 }}>{item.issue}</div>
            </div>
          ))}
        </div>
      </Section>

      <Section title="岗位要求拆解">
        <div style={{ display: "grid", gap: 10 }}>
          {report.targetRoleRequirements.map((item, index) => (
            <div key={`${item.category}-${item.requirement}-${index}`} style={{ padding: 14, borderRadius: 10, border: "1px solid var(--border)" }}>
              <div className="skill-tag-label">{item.category}</div>
              <div style={{ fontSize: 14, lineHeight: 1.8 }}>{item.requirement}</div>
            </div>
          ))}
        </div>
      </Section>

      <Section title="当前差距分析">
        <div style={{ display: "grid", gap: 12 }}>
          {report.gapAnalysis.map((item) => (
            <div key={item.dimension} style={{ padding: 14, borderRadius: 10, border: "1px solid var(--border)" }}>
              <div style={{ display: "flex", justifyContent: "space-between", gap: 12, alignItems: "center", marginBottom: 6 }}>
                <strong>{item.dimension}</strong>
                <span className="skill-tag">{item.currentStatus}</span>
              </div>
              <p style={{ fontSize: 14, color: "var(--text-2)", lineHeight: 1.8 }}>{item.description}</p>
            </div>
          ))}
        </div>
      </Section>

      <Section title="阶段规划">
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))", gap: 12 }}>
          <div>
            <div className="skill-tag-label">大二 / 探索积累</div>
            <ListBlock items={report.phasePlan.sophomore} />
          </div>
          <div>
            <div className="skill-tag-label">大三 / 实战突破</div>
            <ListBlock items={report.phasePlan.junior} />
          </div>
          <div>
            <div className="skill-tag-label">毕业前 / 冲刺收口</div>
            <ListBlock items={report.phasePlan.beforeGraduation} />
          </div>
        </div>
      </Section>

      <Section title="本学期行动建议">
        <div style={{ display: "grid", gap: 10 }}>
          {report.currentSemesterActions.map((item) => (
            <div key={item.action} style={{ display: "flex", gap: 12, alignItems: "flex-start" }}>
              <span className="skill-tag" style={{ minWidth: 36, textAlign: "center" }}>{item.priority}</span>
              <div style={{ fontSize: 14, lineHeight: 1.8 }}>{item.action}</div>
            </div>
          ))}
        </div>
      </Section>

      <Section title="学业 / 实习 / 技能路线">
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))", gap: 12 }}>
          <div>
            <div className="skill-tag-label">学业规划</div>
            <ListBlock items={report.threeDimensionRoadmap.academics} />
          </div>
          <div>
            <div className="skill-tag-label">实习规划</div>
            <ListBlock items={report.threeDimensionRoadmap.internships} />
          </div>
          <div>
            <div className="skill-tag-label">技能规划</div>
            <ListBlock items={report.threeDimensionRoadmap.skills} />
          </div>
        </div>
      </Section>

      <Section title="留学路径建议">
        <div style={{ display: "grid", gap: 12 }}>
          {report.overseasPathSuggestions.map((item, index) => (
            <div key={`${item.path}-${index}`} style={{ padding: 14, borderRadius: 10, border: "1px solid var(--border)" }}>
              <div style={{ fontWeight: 700, marginBottom: 6 }}>{item.path}</div>
              {item.focus ? <div style={{ fontSize: 14, lineHeight: 1.7, marginBottom: 6 }}>建议方向：{item.focus}</div> : null}
              {item.schools ? <div style={{ fontSize: 13, color: "var(--text-2)", marginBottom: 6 }}>{item.schools}</div> : null}
              {item.condition ? <div style={{ fontSize: 14, lineHeight: 1.7 }}>申请条件：{item.condition}</div> : null}
              {item.advantage ? <div style={{ fontSize: 14, lineHeight: 1.7 }}>路径优势：{item.advantage}</div> : null}
              {item.suitableFor ? <div style={{ fontSize: 14, lineHeight: 1.7 }}>更适合：{item.suitableFor}</div> : null}
              {item.nextStep ? <div style={{ fontSize: 14, lineHeight: 1.7 }}>当前提醒：{item.nextStep}</div> : null}
              {item.hook ? <div style={{ fontSize: 14, color: "var(--text-2)", lineHeight: 1.7, marginTop: 6 }}>{item.hook}</div> : null}
            </div>
          ))}
        </div>
        <p style={{ fontSize: 14, color: "var(--text-2)", lineHeight: 1.8, marginTop: 14 }}>
          如需进一步了解 {report.roleName} 方向的留学规划与准备路径，可预约一对一咨询获取更细化建议。
        </p>
      </Section>

      <Section title="案例分析">
        <div style={{ display: "grid", gap: 12 }}>
          {report.caseAnalysis.map((item, index) => (
            <div key={`${item.name ?? index}`} style={{ padding: 14, borderRadius: 10, border: "1px solid var(--border)" }}>
              <div style={{ fontWeight: 700, marginBottom: 6 }}>{item.name ?? `案例 ${index + 1}`}</div>
              {item.background ? <div style={{ fontSize: 14, lineHeight: 1.8, marginBottom: 6 }}>{item.background}</div> : null}
              {item.keyMove ? <div style={{ fontSize: 14, lineHeight: 1.8, marginBottom: 6 }}>关键动作：{item.keyMove}</div> : null}
              <div style={{ fontSize: 14, color: "var(--text-2)", lineHeight: 1.8 }}>可借鉴点：{item.lesson ?? item.keyMove}</div>
            </div>
          ))}
        </div>
      </Section>

      <Section title="下一步行动">
        <div style={{ marginBottom: 12, fontSize: 14, color: "var(--text-2)" }}>
          当前专业：{profile.majorName} · 当前结果：{result.fitLabel}
        </div>
        <div style={{ display: "grid", gap: 12 }}>
          {report.nextActions.map((item) => (
            <div key={item.action} style={{ display: "flex", gap: 12, alignItems: "flex-start" }}>
              <span className="skill-tag" style={{ minWidth: 64, textAlign: "center" }}>{item.timeframe}</span>
              <div style={{ fontSize: 14, lineHeight: 1.8 }}>{item.action}</div>
            </div>
          ))}
        </div>
      </Section>

      <Section title="继续推进">
        <p style={{ fontSize: 14, color: "var(--text-2)", lineHeight: 1.8, marginBottom: 14 }}>
          如果你想把这份报告继续承接成更具体的行动，可以继续进入咨询、案例领取或简历诊断页面。
        </p>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))", gap: 12 }}>
          <Link className="btn btn-primary" to={`/consultation?${conversionSearch}`}>
            预约一对一咨询
          </Link>
          <Link className="btn btn-ghost" to={`/resume-cases?${conversionSearch}`}>
            领取同岗位案例
          </Link>
          <Link className="btn btn-ghost" to={`/resume-diagnosis-bridge?${conversionSearch}`}>
            上传简历获取诊断
          </Link>
        </div>
      </Section>
    </>
  );
}
