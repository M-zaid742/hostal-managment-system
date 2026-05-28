export default function RoomsStatus({ roomsStatus = [] }) {
  return (
    <div className="card shadow-sm h-100">
      <div className="card-body">
        <h2 className="h5">Rooms Status</h2>
        <ul className="list-group list-group-flush">
          {roomsStatus.map((status) => (
            <li key={status.label} className="list-group-item d-flex justify-content-between">
              <span>{status.label}</span>
              <span className="fw-semibold">{status.value}</span>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
