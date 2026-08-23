export default function PageHero({
  eyebrow,
  title,
  subtitle,
}: {
  eyebrow: string;
  title: string;
  subtitle?: string;
}) {
  return (
    <section className="section-dark">
      <div className="relative z-10 mx-auto max-w-6xl px-4 py-14 md:px-8 md:py-20">
        <p className="hero-eyebrow">{eyebrow}</p>
        <h1 className="page-hero-title">{title}</h1>
        {subtitle ? <p className="page-hero-sub">{subtitle}</p> : null}
      </div>
    </section>
  );
}
