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

          <p className="landing-hero__subtitle">
            用一套更接近真实岗位判断逻辑的职业准备度评估，快速看清你当前更适合冲什么岗位，以及接下来最该补哪几件事。
          </p>

          <p className="landing-hero__meta">
            32 道题 · 约 5 分钟 · 当场查看结果
          </p>

          <Link
            className="btn btn-primary"
            to="/start"
            style={{
              fontSize: 16,
              padding: "14px 40px",
              fontWeight: 700,
              letterSpacing: "0.02em",
              marginTop: 28,
            }}
          >
            开始测试
          </Link>

          <div className="landing-stats">
            <div className="landing-stat">
              <span>主链路</span>
              <strong>信息建档 → 一题一屏 → 结果页</strong>
            </div>
            <div className="landing-stat">
              <span>结果结构</span>
              <strong>自我认知 / 外界认知 / 行动指引 / 结尾寄语</strong>
            </div>
            <div className="landing-stat">
              <span>输出重点</span>
              <strong>告诉你更适合什么岗位，以及下一步怎么补</strong>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
