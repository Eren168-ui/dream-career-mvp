import { useLocation, useNavigate } from "react-router-dom";
import ResultContent from "../components/ResultContent.jsx";
import { getActiveAssessmentResult, getActiveProfile } from "../services/mockDatabase.js";

export default function ResultPage() {
  const { state } = useLocation();
  const navigate = useNavigate();

  const activeProfile = getActiveProfile();
  const activeResult = getActiveAssessmentResult();

  const profile = state?.profile ?? activeProfile;
  const result =
    state?.result?.id && activeResult?.id === state.result.id
      ? activeResult
      : state?.result ?? activeResult;

  if (!result || !profile) {
    return (
      <div className="page-container" style={{ textAlign: "center", paddingTop: 80 }}>
        <p>没有找到评估结果</p>
        <button className="btn btn-ghost mt-4" onClick={() => navigate("/start")}>重新开始</button>
      </div>
    );
  }

  return (
    <div>
      <nav className="nav">
        <span className="nav-brand">职业测评</span>
        <div className="nav-steps">
          <span className="nav-step">① 基本信息</span>
          <span className="nav-step">② 题目作答</span>
          <span className="nav-step active">③ 查看结果</span>
        </div>
      </nav>
      <div className="page-container">
        <ResultContent profile={profile} result={result} />
        <div style={{ marginTop: 8, textAlign: "center" }}>
          <button className="btn btn-ghost" onClick={() => navigate("/start")} style={{ fontSize: 13 }}>
            重新测评
          </button>
        </div>
      </div>
    </div>
  );
}
