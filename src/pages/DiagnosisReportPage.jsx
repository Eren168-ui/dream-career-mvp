import { useMemo } from "react";
import { Link, useParams } from "react-router-dom";
import ReportContent from "../components/ReportContent.jsx";
import { getDemoSession } from "../data/demoSessions.js";
import { buildAssessmentResult } from "../lib/assessment.js";
import { buildResumeDiagnosisReport } from "../lib/reporting.js";

export default function DiagnosisReportPage() {
  const { demoId } = useParams();
  const demo = getDemoSession(demoId);

  const { result, report } = useMemo(() => {
    if (!demo) return {};
    const nextResult = buildAssessmentResult({ profile: demo.profile, answers: demo.answers });
    return {
      result: nextResult,
      report: buildResumeDiagnosisReport({ profile: demo.profile, assessmentResult: nextResult }),
    };
  }, [demo]);

  if (!demo || !result || !report) {
    return (
      <div className="page-container" style={{ textAlign: "center", paddingTop: 80 }}>
        <p>找不到演示案例：{demoId}</p>
        <Link to="/" className="btn btn-ghost mt-4">返回首页</Link>
      </div>
    );
  }

  return (
    <div>
      <nav className="nav">
        <span className="nav-brand">梦想职业评估 Demo</span>
        <div className="nav-steps">
          <Link className="nav-step" to={`/demo/${demoId}/results`}>岗位匹配度分析</Link>
          <span className="nav-step active">差距分析报告</span>
        </div>
      </nav>

      <div className="page-container">
        <div style={{ fontSize: 13, color: "var(--text-2)", marginBottom: 8 }}>
          <Link to="/">Demo 列表</Link> / {demo.name} / 差距分析报告
        </div>

        <div className="card" style={{ marginBottom: 16 }}>
          <div style={{ fontSize: 13, color: "var(--text-2)", marginBottom: 6 }}>演示报告 / 差距分析与行动建议</div>
          <div style={{ fontSize: 28, fontWeight: 700, marginBottom: 8 }}>
            {demo.profile.majorName} · 目标岗位：{report.roleName}
          </div>
          <p style={{ fontSize: 14, color: "var(--text-2)", lineHeight: 1.85 }}>
            {demo.description}
            {demo.profile.targetCompany ? ` 当前按 ${demo.profile.targetCompany} 及同类公司的岗位逻辑演示报告承接。` : ""}
          </p>
        </div>

        <ReportContent profile={demo.profile} result={result} report={report} />

        <div style={{ display: "flex", gap: 10, justifyContent: "flex-end" }}>
          <Link className="btn btn-ghost" to="/">← 返回 Demo 列表</Link>
          <Link className="btn btn-primary" to={`/demo/${demoId}/results`}>查看岗位匹配度分析 →</Link>
        </div>
      </div>
    </div>
  );
}
