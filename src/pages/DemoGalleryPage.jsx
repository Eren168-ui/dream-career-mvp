import { Link } from "react-router-dom";
import { demoSessions } from "../data/demoSessions.js";
import { getCareerStageOptions } from "../data/careerStagesCopy.js";
import { getRoleLabel, getOptionLabel } from "../lib/display.js";

const stageMap = Object.fromEntries(getCareerStageOptions().map((item) => [item.value, item]));

export default function DemoGalleryPage() {
  return (
    <div>
      <nav className="nav">
        <span className="nav-brand">梦想职业评估</span>
        <div className="nav-steps">
          <Link className="nav-step active" to="/">Demo</Link>
          <Link className="nav-step" to="/start">正式流程</Link>
        </div>
      </nav>

      <div className="page-container">
        <div className="card" style={{ marginBottom: 16 }}>
          <div style={{ fontSize: 13, color: "var(--text-2)", marginBottom: 6 }}>独立新系统 / Demo 与正式流程共用同一套职业准备度评估逻辑</div>
          <div style={{ fontSize: 30, fontWeight: 700, marginBottom: 10 }}>职业准备度评估 Demo 入口</div>
          <p style={{ fontSize: 14, color: "var(--text-2)", lineHeight: 1.85, marginBottom: 16 }}>
            当前提供 10 个岗位 demo，可直接查看岗位匹配度分析和差距分析报告；正式用户流程从 `/start` 进入，依次完成测试导航、题目作答、结果查看和报告查看。
          </p>
          <div style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
            <Link className="btn btn-primary" to="/start">进入测试导航页</Link>
            <a className="btn btn-ghost" href="#demo-list">直接看 Demo 案例</a>
          </div>
        </div>

        <div id="demo-list" style={{ display: "grid", gap: 16 }}>
          {demoSessions.map((demo) => {
            const stage = stageMap[demo.profile.careerStage];

            return (
              <div key={demo.id} className="card">
                <div style={{ display: "flex", justifyContent: "space-between", gap: 16, flexWrap: "wrap", marginBottom: 10 }}>
                  <div>
                    <div style={{ fontSize: 22, fontWeight: 700, marginBottom: 8 }}>{demo.name}</div>
                    <p style={{ fontSize: 14, color: "var(--text-2)", lineHeight: 1.8 }}>{demo.description}</p>
                  </div>
                  <div style={{ display: "flex", gap: 10, flexWrap: "wrap", alignContent: "flex-start" }}>
                    <Link className="btn btn-ghost" to={`/demo/${demo.id}/results`}>岗位匹配度分析</Link>
                    <Link className="btn btn-primary" to={`/demo/${demo.id}/report`}>差距分析报告</Link>
                  </div>
                </div>

                <div className="skill-tags">
                  <span className="skill-tag">{getRoleLabel(demo.profile.targetRole)}</span>
                  <span className="skill-tag">{getOptionLabel("educationLevel", demo.profile.educationLevel)}</span>
                  <span className="skill-tag">{demo.profile.majorName}</span>
                  <span className="skill-tag">{getOptionLabel("resumeStage", demo.profile.resumeStage)}</span>
                  <span className="skill-tag">{stage?.label ?? demo.profile.careerStage}</span>
                  <span className="skill-tag">{getOptionLabel("studyRegion", demo.profile.studyRegion)}</span>
                  {demo.profile.targetCompany ? <span className="skill-tag">目标公司：{demo.profile.targetCompany}</span> : null}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
