import { useEffect, useState } from "react";
import { apiGet } from "../api/client.js";
import { motion } from "framer-motion";
import { BarChart3, AlertCircle, Loader } from "lucide-react";
import KpiCards from "../components/KpiCards.jsx";
import OccupancyChart from "../components/OccupancyChart.jsx";
import RoomsStatus from "../components/RoomsStatus.jsx";
import RecentBookings from "../components/RecentBookings.jsx";
import PaymentsDue from "../components/PaymentsDue.jsx";
import StaffOnDuty from "../components/StaffOnDuty.jsx";

const emptyDashboard = {
  kpis: [],
  occupancyTrend: [],
  roomsStatus: [],
  recentBookings: [],
  paymentsDue: [],
  staffOnDuty: []
};

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.1, delayChildren: 0.2 }
  }
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { type: "spring", stiffness: 100 }
  }
};

export default function Dashboard() {
  const [dashboard, setDashboard] = useState(emptyDashboard);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    let isMounted = true;

    apiGet("/dashboard")
      .then((dashboardData) => {
        if (isMounted) {
          setDashboard(dashboardData);
        }
      })
      .catch((err) => {
        if (isMounted) {
          setError(err.message);
        }
      })
      .finally(() => {
        if (isMounted) {
          setLoading(false);
        }
      });

    return () => {
      isMounted = false;
    };
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center px-4 py-8">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="glass-dark rounded-2xl p-12 max-w-md w-full"
        >
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ repeat: Infinity, duration: 2 }}
            className="w-12 h-12 border-4 border-purple-500/30 border-t-purple-500 rounded-full mx-auto"
          />
          <p className="text-center text-slate-300 mt-4">Loading dashboard data...</p>
        </motion.div>
      </div>
    );
  }

  return (
    <motion.section
      initial="hidden"
      animate="visible"
      variants={containerVariants}
      className="min-h-screen py-8 md:py-12"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <motion.header variants={itemVariants} className="mb-12">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-purple-600 to-blue-600 flex items-center justify-center">
              <BarChart3 size={24} className="text-white" />
            </div>
            <div>
              <h1 className="text-4xl md:text-5xl font-bold text-gradient">Dashboard</h1>
              <p className="text-slate-400 mt-1">Overview of operations and daily activity</p>
            </div>
          </div>
        </motion.header>

        {/* Error Alert */}
        {error && (
          <motion.div
            variants={itemVariants}
            className="glass-dark rounded-2xl p-6 border-l-4 border-red-500 mb-8"
          >
            <div className="flex items-start gap-4">
              <AlertCircle size={24} className="text-red-400 flex-shrink-0 mt-1" />
              <div>
                <h3 className="text-lg font-bold text-red-300 mb-1">Error</h3>
                <p className="text-slate-300">Unable to load dashboard data: {error}</p>
              </div>
            </div>
          </motion.div>
        )}

        {/* KPI Cards */}
        <motion.div variants={itemVariants} className="mb-12">
          <KpiCards kpis={dashboard.kpis} />
        </motion.div>

        {/* Charts Row */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-12"
        >
          <motion.div variants={itemVariants} className="lg:col-span-2">
            <OccupancyChart occupancyTrend={dashboard.occupancyTrend} />
          </motion.div>
          <motion.div variants={itemVariants}>
            <RoomsStatus roomsStatus={dashboard.roomsStatus} />
          </motion.div>
        </motion.div>

        {/* Bottom Widgets */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-4 gap-6"
        >
          <motion.div variants={itemVariants} className="lg:col-span-2 xl:col-span-2">
            <RecentBookings recentBookings={dashboard.recentBookings} />
          </motion.div>
          <motion.div variants={itemVariants}>
            <PaymentsDue paymentsDue={dashboard.paymentsDue} />
          </motion.div>
          <motion.div variants={itemVariants}>
            <StaffOnDuty staffOnDuty={dashboard.staffOnDuty} />
          </motion.div>
        </motion.div>
      </div>
    </motion.section>
  );
}
