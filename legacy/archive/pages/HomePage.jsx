import { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import AppShell from "../components/AppShell.jsx";
import SectionCard from "../components/SectionCard.jsx";
import { appConfig } from "../config/appConfig.js";
import { demoSessions } from "../data/demoSessions.js";
import { createDemoSession, getActiveProfile, getCatalogSnapshot, getAllUserProfiles } from "../services/mockDatabase.js";

function SummaryPill({ label, value }) {
  return (
    <div className="summary-pill">
      <span>{label}</span>
      <strong>{value}</strong>
    </div>
  );
}

export default function HomePage() {
  const navigate = useNavigate();
  const [latestProfile, setLatestProfile] = useState(getActiveProfile());
  const [profileCount, setProfileCount] = useState(getAllUserProfiles().length);
  const catalog = useMemo(() => getCatalogSnapshot(), []);

  function handleCreateDemo(demoId) {
    const session = createDemoSession(demoId);
    setLatestProfile(session.profile);
    setProfileCount(getAllUserProfiles().length);
    navigate("/assessment/result");
  }

  return (
    <AppShell
      title="职业测试引流独立新系统 MVP"
      subtitle="按固定链路跑通：首页 → 导航页 → 题目页 → 结果页 → 简历升级页。当前只支持免费留资，不做直接付费。"
      actions={(
        <>
          <button className="primary-button" onClick={() => navigate("/assessment/setup")}>
            开始测评
          </button>
          <button className="ghost-button" onClick={() => navigate("/resume-upgrade")}>
            查看最近升级页
          </button>
        </>
      )}
    >
      <section className="stats-grid">
        <SummaryPill label="目标岗位" value={catalog.roles.length} />
        <SummaryPill label="岗位细分" value={catalog.role_subcategories.length} />
        <SummaryPill label="题库套数" value={catalog.question_sets.length} />
        <SummaryPill label="本地留资 / profile" value={profileCount} />
      </section>

      <div className="page-grid page-grid-wide">
        <SectionCard title="本次默认决策" kicker="已锁定">
          <ul className="ordered-list">
            <li>域名默认使用 {appConfig.appDomain}。</li>
            <li>结果页仅展示维度得分和分级，不展示逐题对错。</li>
            <li>分享方式先做结果图下载，不接微信 JS-SDK。</li>
            <li>后台系统暂不开发，多岗位测评暂不支持。</li>
            <li>原系统 {appConfig.resumeToolUrl} 仅做只读跳转引用。</li>
          </ul>
          {latestProfile ? (
            <div className="inline-panel">
              <strong>最近一次本地 profile</strong>
              <span>{latestProfile.majorName} / {latestProfile.targetCompany || "未填目标公司"}</span>
            </div>
          ) : null}
        </SectionCard>

        <SectionCard title="MVP 主链路" kicker="明早验收重点">
          <ol className="ordered-list">
            <li>导航页按最新字段定义完成建档，并明确一次只测一个岗位。</li>
            <li>题目页自动切换 10 个岗位的专属题库。</li>
            <li>结果页输出维度得分、分级、结果图下载与下一步 CTA。</li>
            <li>简历升级页承接免费留资，并跳转原有简历批注工具。</li>
          </ol>
        </SectionCard>
      </div>

      <SectionCard title="快捷演示" kicker="便于验收">
        <div className="demo-list">
          {demoSessions.map((demo) => (
            <article key={demo.id} className="demo-card">
              <div>
                <h3>{demo.name}</h3>
                <p>{demo.description}</p>
              </div>
              <button className="primary-button" onClick={() => handleCreateDemo(demo.id)}>
                载入并查看结果
              </button>
            </article>
          ))}
        </div>
      </SectionCard>
    </AppShell>
  );
}
