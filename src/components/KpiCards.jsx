export default function KpiCards({ kpis = [] }) {
  return (
    <div className="row g-3">
      {kpis.map((kpi) => (
        <div key={kpi.label} className="col-12 col-sm-6 col-lg-3">
          <div className="card shadow-sm border-0 h-100">
            <div className="card-body">
              <div className="text-muted small">{kpi.label}</div>
              <div className="fs-3 fw-semibold">{kpi.value}</div>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
