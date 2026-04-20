import { Link } from "react-router-dom";

export default function DemoGalleryPage() {
  return (
    <div style={{ minHeight: "100vh", background: "var(--bg)" }}>
      <nav className="nav">
        <span className="nav-brand">职业测评</span>
      </nav>

      <div className="page-container" style={{ maxWidth: 900 }}>
        <div className="landing-hero">
          <div className="page-kicker">
            已帮助 5W+ 留学生找到高薪岗位方向
          </div>

          <h1 className="landing-hero__title">
            测测你的天选岗位
          </h1>

          <p className="landing-hero__lead">
            你最有机会拿下哪类高薪 Offer？
          </p>

          <p className="landing-hero__subtitle">
            测完就能知道你更适合冲什么岗位，差距主要卡在哪，以及下一步最该补的准备动作。
          </p>

          <div className="landing-hero__meta" aria-label="测试信息">
            <span>20 道题</span>
            <span>约 5 分钟</span>
            <span>当场看结果</span>
          </div>

          <p className="landing-hero__bonus">
            测完即可领取《101 高薪岗位简历案例库》
          </p>

          <div style={{ display: "flex", gap: 12, justifyContent: "center", flexWrap: "wrap", marginTop: 28 }}>
            <Link
              className="btn btn-primary"
              to="/start"
              style={{
                fontSize: 16,
                padding: "14px 40px",
                fontWeight: 700,
                letterSpacing: "0.02em",
              }}
            >
              开始测试
            </Link>
            <a
              className="btn btn-ghost"
              href="https://resume.erenlab.cn/login"
              target="_blank"
              rel="noreferrer"
              style={{
                fontSize: 15,
                padding: "14px 28px",
                fontWeight: 700,
                letterSpacing: "0.01em",
              }}
            >
              留学/升学定向简历规划
            </a>
          </div>

          <div className="landing-stats">
            <div className="landing-stat">
              <span>为什么现在点开</span>
              <p>先把方向看清，再决定简历和实习往哪边发力。</p>
            </div>
            <div className="landing-stat">
              <span>为什么值得测</span>
              <p>不只告诉你适合什么岗位，也会点出短板和下一步重点。</p>
            </div>
            <div className="landing-stat">
              <span>为什么不麻烦</span>
              <p>5 分钟做完，当场看结果，不用先准备一堆材料。</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
