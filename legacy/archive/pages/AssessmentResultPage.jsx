import { Navigate, useNavigate } from "react-router-dom";
import AppShell from "../components/AppShell.jsx";
import SectionCard from "../components/SectionCard.jsx";
import { appConfig } from "../config/appConfig.js";
import { downloadResultShareImage } from "../lib/share.js";
import { getOptionLabel } from "../lib/display.js";
import { getActiveAssessmentResult, getActiveProfile } from "../services/mockDatabase.js";

export default function AssessmentResultPage() {
  const navigate = useNavigate();
  const profile = getActiveProfile();
  const result = getActiveAssessmentResult();

  if (!profile || !result) {
    return <Navigate to="/assessment/setup" replace />;
  }

  return (
    <AppShell
      title="结果页"
      subtitle={`目标岗位：${result.roleName}。当前基于刚完成的答题结果输出固定 4 个模块，不展示逐题对错。`}
      actions={(
        <>
          <button
            className="primary-button"
            onClick={() => downloadResultShareImage({ profile, result, filename: `${result.roleId}-result-card.svg` })}
          >
            下载结果图
          </button>
          <button className="ghost-button" onClick={() => navigate("/resume-upgrade")}>
            去简历升级页
          </button>
        </>
      )}
    >
      <div className="page-grid">
        <SectionCard title="结果总览" kicker="维度得分 + 分级">
          <div className="score-panel">
            <div className="score-header">
              <strong>{result.score} / 100</strong>
              <span>{result.fitLabel}</span>
            </div>
            <div className="metadata-grid">
              <div>
                <span>毕业年份</span>
                <strong>{getOptionLabel("graduationYear", profile.graduationYear)}</strong>
              </div>
              <div>
                <span>学历</span>
                <strong>{getOptionLabel("educationLevel", profile.educationLevel)}</strong>
              </div>
              <div>
                <span>就读区域</span>
                <strong>{getOptionLabel("studyRegion", profile.studyRegion)}</strong>
              </div>
              <div>
                <span>目标公司</span>
                <strong>{profile.targetCompany || "未填写"}</strong>
              </div>
            </div>
          </div>
        </SectionCard>

        <SectionCard title={result.modules.selfAwareness.title} kicker="模块 1">
          <p className="muted-text">{result.modules.selfAwareness.summary}</p>
          <ul className="plain-list">
            {result.modules.selfAwareness.highlights.map((item) => (
              <li key={item}>{item}</li>
            ))}
          </ul>
          <div className="dimension-list">
            {result.dimensionRanking.map((dimension) => (
              <div key={dimension.dimension} className="dimension-row">
                <div>
                  <div className="dimension-row__label">{dimension.label}</div>
                  <div className="dimension-row__meta">{dimension.level}</div>
                </div>
                <div className="dimension-row__score">{dimension.score}</div>
              </div>
            ))}
          </div>
        </SectionCard>
      </div>

      <div className="page-grid">
        <SectionCard title={result.modules.marketReality.title} kicker="模块 2">
          <ul className="plain-list">
            {result.modules.marketReality.content.map((item) => (
              <li key={item}>{item}</li>
            ))}
          </ul>
        </SectionCard>

        <SectionCard title={result.modules.actionGuide.title} kicker="模块 3">
          <div className="two-column-list">
            <div>
              <h3>学业规划</h3>
              <ul className="plain-list">
                {result.modules.actionGuide.studyPlan.map((item) => (
                  <li key={item}>{item}</li>
                ))}
              </ul>
            </div>
            <div>
              <h3>实习规划</h3>
              <ul className="plain-list">
                {result.modules.actionGuide.internshipPlan.map((item) => (
                  <li key={item}>{item}</li>
                ))}
              </ul>
            </div>
          </div>
          <div className="two-column-list">
            <div>
              <h3>技能规划 / 硬技能</h3>
              <ul className="plain-list">
                {result.modules.actionGuide.skillPlan.hardSkills.map((item) => (
                  <li key={item}>{item}</li>
                ))}
              </ul>
            </div>
            <div>
              <h3>技能规划 / 软技能</h3>
              <ul className="plain-list">
                {result.modules.actionGuide.skillPlan.softSkills.map((item) => (
                  <li key={item}>{item}</li>
                ))}
              </ul>
            </div>
          </div>
        </SectionCard>
      </div>

      <SectionCard title={result.modules.closingMessage.title} kicker="模块 4">
        <p className="muted-text">{result.modules.closingMessage.content}</p>
      </SectionCard>

      <SectionCard title="本页 CTA" kicker="按最新默认决策">
        <div className="cta-stack">
          <button className="primary-button" onClick={() => navigate("/resume-upgrade")}>
            {appConfig.fullReportCtaLabel}
          </button>
          <a className="ghost-button ghost-link-button" href={appConfig.resumeToolUrl} target="_blank" rel="noreferrer">
            {appConfig.resumeToolCtaLabel}（只读跳转）
          </a>
        </div>
      </SectionCard>
    </AppShell>
  );
}
