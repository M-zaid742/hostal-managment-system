import { Link, NavLink, Outlet, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { LogOut, Menu, X } from "lucide-react";
import { useState } from "react";
import { clearSession, getUser } from "../utils/auth.js";
import { ThemeToggle } from "../context/ThemeContext.jsx";
import Footer from "../components/Footer.jsx";

export default function UserLayout() {
  const user = getUser();
  const navigate = useNavigate();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const handleLogout = () => {
    clearSession();
    navigate("/login");
  };

  const navVariants = {
    hidden: { opacity: 0, y: -20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.5,
        ease: "easeOut",
      },
    },
  };

  const linkVariants = {
    hover: {
      color: "#8b5cf6",
      transition: { duration: 0.2 },
    },
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.2,
      },
    },
  };

  return (
    <motion.div
      className="min-h-screen bg-gradient-to-br from-slate-50 via-purple-50 to-slate-100 dark:from-slate-950 dark:via-purple-950 dark:to-slate-900"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      {/* Navigation Bar */}
      <motion.header
        className="navbar-modern border-b border-slate-200/50 dark:border-slate-700/30 sticky top-0 z-50"
        initial="hidden"
        animate="visible"
        variants={navVariants}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex items-center justify-between">
          {/* Logo */}
          <Link
            to="/"
            className="group flex items-center gap-2 transition-all duration-300"
          >
            <motion.div
              className="text-2xl md:text-3xl font-bold bg-gradient-to-r from-purple-600 via-blue-500 to-cyan-500 bg-clip-text text-transparent"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              RoomFlow
            </motion.div>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center gap-8">
            <motion.div
              className="flex gap-8"
              variants={containerVariants}
              initial="hidden"
              animate="visible"
            >
              {[
                { to: "/", label: "Home" },
                { to: "/subscribe", label: "List Your Hostel" },
                ...(user ? [{ to: "/profile", label: "Profile" }] : []),
                ...(user?.role === "owner"
                  ? [{ to: "/owner/dashboard", label: "Dashboard" }]
                  : []),
              ].map((link) => (
                <motion.div key={link.to} variants={linkVariants}>
                  <NavLink
                    to={link.to}
                    end={link.to === "/"}
                    className={({ isActive }) =>
                      `text-sm font-medium transition-colors duration-200 ${
                        isActive
                          ? "text-purple-600 dark:text-purple-400"
                          : "text-slate-600 dark:text-slate-400 hover:text-purple-600 dark:hover:text-purple-400"
                      }`
                    }
                  >
                    {link.label}
                  </NavLink>
                </motion.div>
              ))}

              {!user && (
                <motion.div variants={linkVariants}>
                  <NavLink
                    to="/login"
                    className={({ isActive }) =>
                      `text-sm font-medium transition-colors duration-200 ${
                        isActive
                          ? "text-purple-600 dark:text-purple-400"
                          : "text-slate-600 dark:text-slate-400 hover:text-purple-600 dark:hover:text-purple-400"
                      }`
                    }
                  >
                    Login
                  </NavLink>
                </motion.div>
              )}
            </motion.div>
          </nav>

          {/* Auth Section */}
          <div className="hidden md:flex items-center gap-4">
            <ThemeToggle />
            {user && (
              <motion.button
                onClick={handleLogout}
                className="btn-secondary flex items-center gap-2"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <LogOut size={18} />
                <span className="text-sm font-semibold">Logout</span>
              </motion.button>
            )}
          </div>

          {/* Mobile Menu Toggle */}
          <button
            className="md:hidden p-2 text-slate-600 dark:text-slate-400 hover:text-purple-600"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          >
            {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>

        {/* Mobile Menu */}
        {mobileMenuOpen && (
          <motion.div
            className="md:hidden border-t border-slate-200/50 dark:border-slate-700/30 bg-white/50 dark:bg-slate-800/50 backdrop-blur-md"
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
          >
            <div className="px-4 py-4 space-y-3">
              {[
                { to: "/", label: "Home" },
                { to: "/subscribe", label: "List Your Hostel" },
                ...(user ? [{ to: "/profile", label: "Profile" }] : []),
                ...(user?.role === "owner"
                  ? [{ to: "/owner/dashboard", label: "Dashboard" }]
                  : []),
              ].map((link) => (
                <NavLink
                  key={link.to}
                  to={link.to}
                  end={link.to === "/"}
                  className={({ isActive }) =>
                    `block px-4 py-2 rounded-lg transition-all ${
                      isActive
                        ? "bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-400 font-semibold"
                        : "text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700/50"
                    }`
                  }
                  onClick={() => setMobileMenuOpen(false)}
                >
                  {link.label}
                </NavLink>
              ))}

              {!user && (
                <NavLink
                  to="/login"
                  className="block px-4 py-2 rounded-lg text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700/50 transition-all"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  Login
                </NavLink>
              )}

              {user && (
                <button
                  onClick={() => {
                    handleLogout();
                    setMobileMenuOpen(false);
                  }}
                  className="w-full btn-secondary flex items-center justify-center gap-2 mt-4"
                >
                  <LogOut size={18} />
                  Logout
                </button>
              )}
            </div>
          </motion.div>
        )}
      </motion.header>

      {/* Main Content */}
      <main className="flex-1">
        <Outlet />
      </main>

      {/* Footer */}
      <Footer />
    </motion.div>
  );
}
