import { useLocation, useNavigate } from "react-router-dom";
import { getOptionLabel } from "../lib/display.js";
import { buildStudyAbroadReport } from "../lib/studyAbroadReporting.js";
import { getActiveAssessmentResult, getActiveProfile } from "../services/mockDatabase.js";

function Section({ title, children }) {
  return (
    <div className="card" style={{ marginBottom: 16 }}>
      <div className="result-module-title">{title}</div>
      {children}
    </div>
  );
}

export default function StudyAbroadReportPage() {
  const { state } = useLocation();
  const navigate = useNavigate();

  const profile = state?.profile ?? getActiveProfile();
  const result = state?.result ?? getActiveAssessmentResult();

  if (!profile || !result || profile.intent !== "study_abroad_resume") {
    return (
      <div className="page-container" style={{ textAlign: "center", paddingTop: 80 }}>
        <p>没有找到可展示的留学定向报告</p>
        <button className="btn btn-ghost mt-4" onClick={() => navigate("/study-abroad/start")}>返回留学信息页</button>
      </div>
    );
  }

  const report = buildStudyAbroadReport({ profile, assessmentResult: result });

  return (
    <div>
      <nav className="nav">
        <span className="nav-brand">职业测评</span>
        <div className="nav-steps">
          <span className="nav-step">① 定向信息</span>
          <span className="nav-step">② 题目作答</span>
          <span className="nav-step active">③ 定向报告</span>
        </div>
      </nav>

      <div className="page-container">
        <div className="card" style={{ marginBottom: 16 }}>
          <div style={{ fontSize: 13, color: "var(--text-2)", marginBottom: 6 }}>{report.entryLabel}</div>
          <div style={{ fontSize: 30, fontWeight: 700, marginBottom: 8 }}>
            {profile.majorName} · {report.roleName} 留学/升学路径规划
          </div>
          <p style={{ fontSize: 14, color: "var(--text-2)", lineHeight: 1.85 }}>
            这份报告不是把留学当成附加建议，而是把职业目标、国家 / 院校 / 专业选择和申请节奏放在同一条主线上判断。
            你当前选择的是 {getOptionLabel("targetCountry", profile.targetCountry)} 路径，申请节奏为 {getOptionLabel("applicationTimeline", profile.applicationTimeline)}。
          </p>
        </div>

        <Section title="当前背景与目标摘要">
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))", gap: 12 }}>
            {report.backgroundSummary.map((item) => (
              <div key={item.label} style={{ padding: 14, borderRadius: 12, background: "var(--surface-2)" }}>
                <div className="skill-tag-label">{item.label}</div>
                <div style={{ fontWeight: 700, lineHeight: 1.7 }}>{item.value}</div>
              </div>
            ))}
          </div>
        </Section>

        <Section title="职业目标反推留学路径">
          <div style={{ display: "grid", gap: 12 }}>
            {report.reversePathways.map((item) => (
              <div key={item.title} style={{ padding: 16, borderRadius: 12, border: "1px solid var(--border)" }}>
                <div style={{ fontWeight: 700, marginBottom: 8 }}>{item.title}</div>
                <p style={{ fontSize: 14, color: "var(--text-2)", lineHeight: 1.8, marginBottom: 10 }}>{item.summary}</p>
                <ul className="result-list">
                  {item.bullets.map((bullet) => <li key={bullet}>{bullet}</li>)}
                </ul>
              </div>
            ))}
          </div>
        </Section>

        <Section title="国家 / 院校 / 专业建议">
          <div style={{ display: "grid", gap: 12 }}>
            {report.countryRecommendations.map((item) => (
              <div key={item.title} style={{ padding: 16, borderRadius: 12, border: "1px solid var(--border)" }}>
                <div style={{ fontWeight: 700, marginBottom: 8 }}>{item.title}</div>
                <div style={{ fontSize: 14, lineHeight: 1.8, marginBottom: 6 }}>推荐专业方向：{item.recommendedMajors}</div>
                {item.targetSchools ? <div style={{ fontSize: 14, color: "var(--text-2)", lineHeight: 1.8, marginBottom: 6 }}>院校参考：{item.targetSchools}</div> : null}
                {item.fitFor ? <div style={{ fontSize: 14, lineHeight: 1.8, marginBottom: 6 }}>更适合：{item.fitFor}</div> : null}
                {item.advantage ? <div style={{ fontSize: 14, lineHeight: 1.8, marginBottom: 6 }}>路径优势：{item.advantage}</div> : null}
                {item.preWork ? <div style={{ fontSize: 14, lineHeight: 1.8 }}>申请前补什么：{item.preWork}</div> : null}
              </div>
            ))}
          </div>
        </Section>

        <Section title="长周期阶段规划">
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))", gap: 12 }}>
            {report.timelinePlan.map((item) => (
              <div key={item.stage} style={{ padding: 16, borderRadius: 12, border: "1px solid var(--border)" }}>
                <div className="skill-tag-label">{item.stage}</div>
                <div style={{ fontWeight: 700, marginBottom: 8 }}>{item.goal}</div>
                <ul className="result-list">
                  {item.actions.map((action) => <li key={action}>{action}</li>)}
                </ul>
              </div>
            ))}
          </div>
        </Section>

        <Section title="留学定向案例分析">
          <div style={{ display: "grid", gap: 12 }}>
            {report.studyAbroadCaseAnalysis.map((item) => (
              <div key={item.name} style={{ padding: 16, borderRadius: 12, border: "1px solid var(--border)" }}>
                <div style={{ fontWeight: 700, marginBottom: 8 }}>{item.name}</div>
                <div style={{ fontSize: 14, lineHeight: 1.8, marginBottom: 6 }}>目标项目：{item.targetProgram}</div>
                <div style={{ fontSize: 14, lineHeight: 1.8, marginBottom: 6 }}>关键转折：{item.pivotPoint}</div>
                <div style={{ fontSize: 14, lineHeight: 1.8, marginBottom: 6 }}>结果表现：{item.outcome}</div>
                <div style={{ fontSize: 14, color: "var(--text-2)", lineHeight: 1.8 }}>可借鉴点：{item.takeaway}</div>
              </div>
            ))}
          </div>
        </Section>

        <Section title="下一步建议">
          <div style={{ display: "grid", gap: 12 }}>
            {report.nextSteps.map((item) => (
              <div key={item.title} style={{ display: "flex", gap: 12, alignItems: "flex-start" }}>
                <span className="skill-tag" style={{ minWidth: 88, textAlign: "center" }}>{item.title}</span>
                <div style={{ fontSize: 14, lineHeight: 1.8 }}>{item.detail}</div>
              </div>
            ))}
          </div>
        </Section>

        <div style={{ display: "flex", gap: 10, justifyContent: "flex-end", flexWrap: "wrap" }}>
          <button className="btn btn-ghost" onClick={() => navigate("/study-abroad/start")}>← 返回留学信息页</button>
          <button className="btn btn-primary" onClick={() => navigate("/")}>返回首页</button>
        </div>
      </div>
    </div>
  );
}
