import { useMemo } from "react";
import { Link, useParams } from "react-router-dom";
import ResultContent from "../components/ResultContent.jsx";
import { getDemoSession } from "../data/demoSessions.js";
import { buildAssessmentResult } from "../lib/assessment.js";

export default function ResultsPage() {
  const { demoId } = useParams();
  const demo = getDemoSession(demoId);

  const result = useMemo(() => {
    if (!demo) return null;
    return buildAssessmentResult({ profile: demo.profile, answers: demo.answers });
  }, [demo]);

  if (!demo || !result) {
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
          <span className="nav-step active">岗位匹配度分析</span>
          <Link className="nav-step" to={`/demo/${demoId}/report`}>差距分析报告</Link>
        </div>
      </nav>

      <div className="page-container">
        <div style={{ fontSize: 13, color: "var(--text-2)", marginBottom: 8 }}>
          <Link to="/">Demo 列表</Link> / {demo.name} / 岗位匹配度分析
        </div>
        <div className="card" style={{ marginBottom: 16 }}>
          <div style={{ fontSize: 13, color: "var(--text-2)", marginBottom: 6 }}>演示档案 / 职业准备度评估</div>
          <div style={{ fontSize: 24, fontWeight: 700, marginBottom: 8 }}>{demo.name}</div>
          <p style={{ fontSize: 14, color: "var(--text-2)", lineHeight: 1.8 }}>
            {demo.description}
          </p>
        </div>

        <ResultContent profile={demo.profile} result={result} />

        <div style={{ display: "flex", gap: 10, justifyContent: "flex-end" }}>
          <Link className="btn btn-ghost" to="/">← 返回 Demo 列表</Link>
          <Link className="btn btn-primary" to={`/demo/${demoId}/report`}>查看差距分析报告 →</Link>
        </div>
      </div>
    </div>
  );
}
