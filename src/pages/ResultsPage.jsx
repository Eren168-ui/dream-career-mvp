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
        <p>找不到示例：{demoId}</p>
        <Link to="/" className="btn btn-ghost mt-4">返回首页</Link>
      </div>
    );
  }

  return (
    <div>
      <nav className="nav">
        <span className="nav-brand">职业测评</span>
      </nav>

      <div className="page-container">
        <div style={{ fontSize: 13, color: "var(--text-2)", marginBottom: 16 }}>
          <Link to="/" style={{ color: "var(--text-2)" }}>← 返回示例列表</Link>
        </div>

        <ResultContent profile={demo.profile} result={result} />

        <div style={{ marginTop: 8, textAlign: "center" }}>
          <Link className="btn btn-ghost" to="/" style={{ fontSize: 13 }}>← 返回示例列表</Link>
        </div>
      </div>
    </div>
  );
}
