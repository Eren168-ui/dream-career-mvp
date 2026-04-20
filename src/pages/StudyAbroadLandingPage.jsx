import { Link } from "react-router-dom";

export default function StudyAbroadLandingPage() {
  return (
    <div style={{ minHeight: "100vh", background: "var(--bg)" }}>
      <nav className="nav">
        <span className="nav-brand">职业测评</span>
      </nav>

      <div className="page-container" style={{ maxWidth: 920 }}>
        <div className="page-title-block" style={{ marginBottom: 22 }}>
          <div className="page-kicker">第二入口 / 留学与升学定向</div>
          <h1>留学/升学定向简历规划</h1>
          <p>
            这个入口面向正在考虑国内升学、国外留学、目标院校筛选和目标专业选择的人。它不会替代原来的通用简历批改，
            而是把职业目标、留学路径、申请节奏和回国求职逻辑放在同一条主线上看。
          </p>
        </div>

        <div className="page-grid-wide" style={{ marginBottom: 18 }}>
          <div className="card" style={{ padding: 24 }}>
            <div className="result-module-title">适合谁走这个入口</div>
            <ul className="result-list">
              <li>想同时判断职业方向和留学路径，而不是只做一份通用简历修改。</li>
              <li>已经有目标院校或目标国家，但还没想清楚该选什么专业更能支撑未来岗位。</li>
              <li>准备国内升学 / 海外留学，希望申请规划和回国就业逻辑能对得上。</li>
            </ul>
          </div>

          <div className="card" style={{ padding: 24 }}>
            <div className="result-module-title">和通用简历批改的区别</div>
            <ul className="result-list">
              <li>通用入口更偏向现有简历问题、岗位匹配度和求职补足建议。</li>
              <li>这个入口会额外收集国家、申请节奏、GPA、语言成绩等留学相关信息。</li>
              <li>最终报告会把职业目标反推成国家 / 院校 / 专业建议和长周期阶段规划。</li>
            </ul>
          </div>
        </div>

        <div className="card" style={{ padding: 24 }}>
          <div className="surface-note" style={{ marginBottom: 18 }}>
            P0 版本先聚焦双入口骨架：信息页独立、题页复用、留学定向报告独立展示。
          </div>
          <div style={{ display: "flex", gap: 12, flexWrap: "wrap" }}>
            <Link className="btn btn-primary" to="/study-abroad/start">
              进入留学/升学定向信息页
            </Link>
            <Link className="btn btn-ghost" to="/">
              返回首页
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
