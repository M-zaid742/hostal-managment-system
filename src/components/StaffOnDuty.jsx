export default function StaffOnDuty({ staffOnDuty = [] }) {
  return (
    <div className="card shadow-sm h-100">
      <div className="card-body">
        <h2 className="h5">Staff on Duty</h2>
        <ul className="list-unstyled mb-0">
          {staffOnDuty.map((member) => (
            <li key={member.name} className="d-flex justify-content-between py-2 border-bottom">
              <div>
                <div className="fw-semibold">{member.name}</div>
                <div className="text-muted small">{member.shift}</div>
              </div>
              <span className="fw-semibold">{member.person}</span>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
