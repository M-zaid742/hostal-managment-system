import { NavLink, Outlet } from "react-router-dom";

const navItems = [
  { label: "Dashboard", to: "/admin" },
  { label: "Rooms", to: "/admin/rooms" },
  { label: "Bookings", to: "/admin/bookings" },
  { label: "Payments", to: "/admin/payments" },
  { label: "Staff", to: "/admin/staff" },
  { label: "Maintenance", to: "/admin/maintenance" }
];

export default function AdminLayout() {
  return (
    <div className="app-shell">
      <aside className="app-sidebar">
        <div className="brand">HostelFlow</div>
        <p className="text-muted small mb-4">Operations Hub</p>
        <nav className="nav flex-column gap-1">
          {navItems.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              end={item.to === "/admin"}
              className={({ isActive }) =>
                `nav-link sidebar-link ${isActive ? "active" : ""}`
              }
            >
              {item.label}
            </NavLink>
          ))}
        </nav>
        <div className="sidebar-footer">
          <div className="small text-muted">Last sync</div>
          <div className="fw-semibold">2 mins ago</div>
        </div>
      </aside>

      <div className="app-main">
        <header className="app-topbar">
          <div>
            <div className="text-muted small">Welcome back</div>
            <div className="h5 mb-0">Operations Overview</div>
          </div>
          <div className="d-flex align-items-center gap-2">
            <button className="btn btn-outline-light btn-sm">Export</button>
            <button className="btn btn-accent btn-sm">New Booking</button>
          </div>
        </header>

        <main className="app-content">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
