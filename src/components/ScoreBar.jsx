export function ScoreBar({ label, value, max = 100, color }) {
  const pct = Math.round((value / max) * 100);
  const barColor = color ?? (pct >= 70 ? "var(--green)" : pct >= 45 ? "var(--accent)" : "var(--amber)");

  return (
    <div className="scorebar">
      {label && <span className="scorebar__label">{label}</span>}
      <div className="scorebar__track">
        <div
          className="scorebar__fill"
          style={{ width: `${pct}%`, background: barColor, boxShadow: `0 0 6px ${barColor}55` }}
        />
      </div>
      <span className="scorebar__value" style={{ color: barColor }}>
        {value}
      </span>
    </div>
  );
}

export function FitBadge({ label }) {
  const cls =
    label === "高度匹配" || label === "匹配度较高"
      ? "badge--green"
      : label === "潜力明显"
      ? "badge--blue"
      : "badge--amber";
  return <span className={`badge ${cls}`}>{label}</span>;
}
