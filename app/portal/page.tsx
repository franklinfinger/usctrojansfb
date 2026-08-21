import { getRoster } from "@/lib/cfbd";

// CFBD transfer portal endpoint: /player/portal
async function getPortal() {
  const key = process.env.CFBD_API_KEY;
  if (!key) return [];
  const res = await fetch(
    "https://api.collegefootballdata.com/player/portal?year=2026",
    {
      headers: { Authorization: `Bearer ${key}` },
      next: { revalidate: 3600 },
    }
  );
  if (!res.ok) return [];
  return (await res.json()) as {
    season: number;
    firstName: string;
    lastName: string;
    position: string;
    origin?: string;
    destination?: string;
    transferDate?: string;
    rating?: number;
    stars?: number;
    eligibility?: string;
  }[];
}

export default async function PortalPage() {
  const [portal, roster] = await Promise.all([
    getPortal().catch(() => []),
    getRoster().catch(() => []),
  ]);

  const rosterNames = new Set(
    roster.map((p) => `${p.firstName} ${p.lastName}`.toLowerCase())
  );

  const related = portal.filter((p) => {
    const name = `${p.firstName} ${p.lastName}`.toLowerCase();
    return (
      p.origin === "USC" ||
      p.destination === "USC" ||
      rosterNames.has(name)
    );
  });

  const incoming = related.filter((p) => p.destination === "USC");
  const outgoing = related.filter((p) => p.origin === "USC");

  return (
    <div className="space-y-5">
      <div>
        <h2 className="text-2xl font-bold">Transfer Portal</h2>
        <p className="text-sm text-white/55">USC-related moves · 2026 cycle</p>
      </div>

      <PortalGroup title="Incoming" rows={incoming} />
      <PortalGroup title="Outgoing" rows={outgoing} />

      {incoming.length === 0 && outgoing.length === 0 ? (
        <p className="rounded-2xl border border-white/10 bg-white/5 p-4 text-sm text-white/55">
          No USC-related portal entries found for this cycle yet, or the endpoint
          needs a higher CFBD tier.
        </p>
      ) : null}
    </div>
  );
}

function PortalGroup({
  title,
  rows,
}: {
  title: string;
  rows: {
    firstName: string;
    lastName: string;
    position: string;
    origin?: string;
    destination?: string;
    eligibility?: string;
  }[];
}) {
  if (!rows.length) return null;
  return (
    <section>
      <h3 className="mb-3 text-sm uppercase tracking-wide text-white/60">
        {title} ({rows.length})
      </h3>
      <div className="overflow-hidden rounded-2xl border border-white/10">
        {rows.map((p, i) => (
          <div
            key={`${p.firstName}-${p.lastName}-${i}`}
            className="border-b border-white/10 px-4 py-3 last:border-b-0"
          >
            <p className="font-medium">
              {p.firstName} {p.lastName}
            </p>
            <p className="text-sm text-white/55">
              {p.position}
              {p.origin ? ` · from ${p.origin}` : ""}
              {p.destination ? ` · to ${p.destination}` : ""}
              {p.eligibility ? ` · ${p.eligibility}` : ""}
            </p>
          </div>
        ))}
      </div>
    </section>
  );
}
