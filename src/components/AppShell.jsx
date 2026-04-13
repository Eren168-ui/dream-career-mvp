import { appConfig } from "../config/appConfig.js";
import { Link, NavLink } from "react-router-dom";

export default function AppShell({ title, subtitle, actions, children }) {
  return (
    <div className="app-shell">
      <header className="topbar">
        <Link className="brand" to="/">
          {appConfig.appName}
        </Link>
        <nav className="topnav">
          <NavLink to="/" className="nav-link">
            Demo 入口
          </NavLink>
          <NavLink to="/start" className="nav-link">
            测试导航页
          </NavLink>
          <NavLink to="/assessment" className="nav-link">
            题目页
          </NavLink>
          <NavLink to="/result" className="nav-link">
            结果页
          </NavLink>
          <NavLink to="/report" className="nav-link">
            报告页
          </NavLink>
        </nav>
      </header>

      <main className="page">
        <section className="hero">
          <div>
            <p className="eyebrow">独立新系统 / 域名：{appConfig.appDomain} / 不触碰原系统</p>
            <h1>{title}</h1>
            {subtitle ? <p className="hero-copy">{subtitle}</p> : null}
          </div>
          {actions ? <div className="hero-actions">{actions}</div> : null}
        </section>
        {children}
      </main>
    </div>
  );
}
