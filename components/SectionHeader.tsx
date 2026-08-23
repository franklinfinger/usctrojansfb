import Link from "next/link";

type SectionHeaderProps = {
  eyebrow: string;
  title: string;
  subtitle?: string;
  level?: "h1" | "h2";
  seeAll?: { href: string; label?: string };
  className?: string;
};

export default function SectionHeader({
  eyebrow,
  title,
  subtitle,
  level = "h1",
  seeAll,
  className,
}: SectionHeaderProps) {
  const Heading = level;
  const headingClass =
    level === "h1" ? "page-title" : "mt-2 font-serif text-3xl text-ink md:text-4xl";

  return (
    <div
      className={[
        seeAll ? "flex items-end justify-between gap-4" : "",
        className ?? "",
      ]
        .filter(Boolean)
        .join(" ")}
    >
      <div>
        <p className="eyebrow">{eyebrow}</p>
        <Heading className={headingClass}>{title}</Heading>
        {subtitle ? <p className="page-sub">{subtitle}</p> : null}
      </div>
      {seeAll ? (
        <Link href={seeAll.href} className="btn-quiet hidden md:inline">
          {seeAll.label ?? "See everything →"}
        </Link>
      ) : null}
    </div>
  );
}
