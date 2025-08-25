export default function Steps({ className = "" }: { className?: string }) {
  const items = [
    "Discovery",
    "Browse & Filter",
    "Listing Details",
    "Application & Screening",
    "Reservation",
    "Pre Move‑In",
    "Move‑In",
    "Stay & Support",
    "Renewal / Move‑Out",
  ];
  return (
    <section className={className}>
      <h2 className="text-2xl font-bold">How it works</h2>
      <ol className="mt-3 grid grid-cols-1 gap-3 md:grid-cols-3">
        {items.map((t, i) => (
          <li
            key={t}
            className="card p-4 animate-fadeUp"
            style={{ animationDelay: `${i * 60}ms` }}
          >
            <div className="badge">Step {i + 1}</div>
            <div className="mt-2 font-bold">{t}</div>
            <p className="text-sm text-black/70">{desc(i)}</p>
          </li>
        ))}
      </ol>
    </section>
  );
}

function desc(i: number) {
  switch (i) {
    case 0:
      return "Search Calgary rooms with filters";
    case 1:
      return "Apply price, type, pet filters";
    case 2:
      return "See rules, wifi, orientation";
    case 3:
      return "Provide ID & references";
    case 4:
      return "Pay deposit & sign";
    case 5:
      return "Receive keys & checklist";
    case 6:
      return "Inspection & check‑in";
    case 7:
      return "Portal for payments & support";
    case 8:
      return "Renew or plan move‑out";
    default:
      return "";
  }
}
