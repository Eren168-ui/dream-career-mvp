import { Link, useLocation } from "react-router-dom";

export function Layout({ children, wide = false }) {
  const loc = useLocation();

  return (
    <div className="layout">
      <header className="topbar">
        <Link to="/" className="topbar__logo">🎯 梦想职业 MVP</Link>
        <span className="topbar__sep" />
        <Link to="/" className={`topbar__link${loc.pathname === "/" ? " active" : ""}`}>
          演示案例
        </Link>
      </header>
      <main className={`page${wide ? " page--wide" : ""}`}>
        {children}
      </main>
    </div>
  );
}
