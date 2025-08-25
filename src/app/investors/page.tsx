export default function InvestorsPage() {
  return (
    <div className="mx-auto max-w-3xl p-4">
      <h1 className="text-2xl font-extrabold">Invest with Natso Rental</h1>
      <p className="mt-2 text-black/80">
        We operate mid & long‑term rentals in Calgary. Investors receive
        transparent ROI dashboards, occupancy insights, and maintenance/turnover
        metrics.
      </p>
      <div className="mt-4 grid grid-cols-1 gap-4 md:grid-cols-3">
        {["Avg. Occupancy 94%", "Turnover 8 days", "ROI Target 12%"].map(
          (k) => (
            <div key={k} className="card p-4 text-center">
              <div className="text-3xl font-extrabold">{k.split(" ")[0]}</div>
              <div className="text-sm text-black/60">
                {k.slice(k.indexOf(" ") + 1)}
              </div>
            </div>
          )
        )}
      </div>
    </div>
  );
}
