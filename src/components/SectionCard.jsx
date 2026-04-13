export default function SectionCard({ title, kicker, children }) {
  return (
    <section className="section-card">
      {kicker ? <p className="section-kicker">{kicker}</p> : null}
      <h2>{title}</h2>
      <div className="section-body">{children}</div>
    </section>
  );
}
