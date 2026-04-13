import { useLocation, useNavigate } from "react-router-dom";
import ResultContent from "../components/ResultContent.jsx";
import { buildResumeDiagnosisReport } from "../lib/reporting.js";
import {
  getActiveAssessmentResult,
  getActiveProfile,
  saveResumeDiagnosisReport,
} from "../services/mockDatabase.js";

export default function ResultPage() {
  const { state } = useLocation();
  const navigate = useNavigate();

  const profile = state?.profile ?? getActiveProfile();
  const result = state?.result ?? getActiveAssessmentResult();

  if (!result || !profile) {
    return (
      <div className="page-container" style={{ textAlign: "center", paddingTop: 80 }}>
        <p>没有找到评估结果</p>
        <button className="btn btn-ghost mt-4" onClick={() => navigate("/start")}>重新开始</button>
      </div>
    );
  }

  function handleViewReport() {
    const report = buildResumeDiagnosisReport({ profile, assessmentResult: result });
    const saved = saveResumeDiagnosisReport({ profileId: profile.id, assessmentId: result.id, report });
    navigate("/report", { state: { report: saved, profile, result } });
  }

  return (
    <div>
      <nav className="nav">
        <span className="nav-brand">梦想职业评估</span>
        <div className="nav-steps">
          <span className="nav-step">① 测试导航</span>
          <span className="nav-step">② 题目作答</span>
          <span className="nav-step active">③ 结果查看</span>
        </div>
      </nav>
      <div className="page-container">
        <ResultContent profile={profile} result={result} />

        <div style={{ display: "flex", gap: 10, justifyContent: "flex-end" }}>
          <button className="btn btn-ghost" onClick={() => navigate("/start")}>← 重新评估</button>
          <button className="btn btn-primary" onClick={handleViewReport}>
            查看差距分析报告 →
          </button>
        </div>
      </div>
    </div>
  );
}
