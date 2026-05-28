export default function OccupancyChart({ occupancyTrend = [] }) {
  return (
    <div className="card shadow-sm h-100">
      <div className="card-body">
        <h2 className="h5">Occupancy Chart</h2>
        <p className="text-muted small mb-3">Average occupancy by month.</p>
        <div className="d-grid gap-3">
          {occupancyTrend.map((item) => (
            <div key={item.month}>
              <div className="d-flex justify-content-between small text-muted">
                <span>{item.month}</span>
                <span>{item.rate}%</span>
              </div>
              <div
                className="progress"
                role="progressbar"
                aria-label={`${item.month} occupancy`}
                aria-valuenow={item.rate}
                aria-valuemin="0"
                aria-valuemax="100"
              >
                <div className="progress-bar" style={{ width: `${item.rate}%` }} />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
