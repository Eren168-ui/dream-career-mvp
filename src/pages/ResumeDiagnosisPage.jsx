import { useLocation, useNavigate } from "react-router-dom";
import ReportContent from "../components/ReportContent.jsx";
import { buildResumeDiagnosisReport } from "../lib/reporting.js";
import {
  getActiveAssessmentResult,
  getActiveProfile,
  getActiveResumeDiagnosisReport,
  saveResumeDiagnosisReport,
} from "../services/mockDatabase.js";

export default function ResumeDiagnosisPage() {
  const { state } = useLocation();
  const navigate = useNavigate();
  const profile = state?.profile ?? getActiveProfile();
  const result = state?.result ?? getActiveAssessmentResult();
  let report = state?.report ?? getActiveResumeDiagnosisReport();

  if (profile && result && report?.assessmentId && report.assessmentId !== result.id) {
    report = null;
  }

  if (profile && result && !report) {
    report = saveResumeDiagnosisReport({
      profileId: profile.id,
      assessmentId: result.id,
      report: buildResumeDiagnosisReport({ profile, assessmentResult: result }),
    });
  }

  if (!profile || !result || !report) {
    return (
      <div className="page-container" style={{ textAlign: "center", paddingTop: 80 }}>
        <p>没有找到可展示的诊断报告</p>
        <button className="btn btn-ghost mt-4" onClick={() => navigate("/start")}>返回填写信息</button>
      </div>
    );
  }

  return (
    <div>
      <nav className="nav">
        <span className="nav-brand">梦想职业评估</span>
        <div className="nav-steps">
          <span className="nav-step">① 测试导航</span>
          <span className="nav-step">② 题目作答</span>
          <span className="nav-step active">③ 报告查看</span>
        </div>
      </nav>

      <div className="page-container">
        <div className="card" style={{ marginBottom: 16 }}>
          <div style={{ fontSize: 13, color: "var(--text-2)", marginBottom: 6 }}>差距分析报告 / 学业、实习与技能规划</div>
          <div style={{ fontSize: 30, fontWeight: 700, marginBottom: 8 }}>
            {profile.majorName} · 目标岗位：{report.roleName}
          </div>
          <p style={{ fontSize: 14, color: "var(--text-2)", lineHeight: 1.85 }}>
            这份报告承接上一页的职业准备度评估与岗位匹配度分析，重点把“当前判断”翻译成“当前差距、补足方向、阶段规划和本学期动作”。
            {profile.targetCompany ? ` 当前会优先贴近 ${profile.targetCompany} 及同类公司的岗位要求。` : ""}
          </p>
        </div>

        <ReportContent profile={profile} result={result} report={report} />

        <div style={{ display: "flex", gap: 10, justifyContent: "flex-end" }}>
          <button className="btn btn-ghost" onClick={() => navigate("/result")}>← 返回结果页</button>
          <button className="btn btn-primary" onClick={() => navigate("/start")}>重新开始评估</button>
        </div>
      </div>
    </div>
  );
}
