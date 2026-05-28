const badgeClasses = {
  Confirmed: "bg-success-subtle text-success",
  Pending: "bg-warning-subtle text-warning",
  "Checked-in": "bg-primary-subtle text-primary"
};

export default function RecentBookings({ recentBookings = [] }) {
  return (
    <div className="card shadow-sm h-100">
      <div className="card-body">
        <h2 className="h5">Recent Bookings</h2>
        <table className="table align-middle mb-0">
          <thead>
            <tr>
              <th>Guest</th>
              <th>Room</th>
              <th>Nights</th>
              <th>Status</th>
            </tr>
          </thead>
          <tbody>
            {recentBookings.map((booking) => (
              <tr key={booking.name}>
                <td>{booking.name}</td>
                <td>{booking.room}</td>
                <td>{booking.nights}</td>
                <td>
                  <span className={`badge rounded-pill ${badgeClasses[booking.status] || "bg-secondary-subtle text-secondary"}`}>
                    {booking.status}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
