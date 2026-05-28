import { useEffect, useState } from "react";
import { apiGet } from "../api/client.js";
import { motion } from "framer-motion";
import { Wrench, AlertTriangle, Home, AlertCircle, Plus } from "lucide-react";

const statusConfig = {
  Open: { bg: "bg-red-500/20", border: "border-red-500/50", text: "text-red-300" },
  "In Progress": { bg: "bg-yellow-500/20", border: "border-yellow-500/50", text: "text-yellow-300" },
  Resolved: { bg: "bg-green-500/20", border: "border-green-500/50", text: "text-green-300" }
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

const rowVariants = {
  hidden: { opacity: 0, x: -20 },
  visible: {
    opacity: 1,
    x: 0,
    transition: { type: "spring", stiffness: 100 }
  },
  hover: { 
    scale: 1.02,
    backgroundColor: "rgba(139, 92, 246, 0.1)",
    transition: { duration: 0.2 }
  }
};

export default function Maintenance() {
  const [tickets, setTickets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    let isMounted = true;

    apiGet("/maintenance")
      .then((data) => {
        if (isMounted) {
          setTickets(data);
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
          <p className="text-center text-slate-300 mt-4">Loading maintenance tickets...</p>
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
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <motion.div variants={itemVariants} className="mb-8">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div>
              <h1 className="text-4xl md:text-5xl font-bold text-gradient mb-2">
                Maintenance
              </h1>
              <p className="text-slate-400">
                Track open tickets and repair tasks
              </p>
            </div>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="inline-flex items-center px-6 py-3 rounded-lg bg-gradient-to-r from-purple-600 to-blue-600 text-white font-semibold hover:shadow-lg hover:shadow-purple-500/50 transition-all"
            >
              <Plus size={20} className="mr-2" />
              New Ticket
            </motion.button>
          </div>
        </motion.div>

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
                <p className="text-slate-300">Unable to load tickets: {error}</p>
              </div>
            </div>
          </motion.div>
        )}

        {/* Maintenance Tickets Table */}
        <motion.div variants={itemVariants}>
          {tickets.length > 0 ? (
            <div className="glass-dark rounded-2xl overflow-hidden border border-slate-700/30">
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-slate-700/30 bg-gradient-to-r from-purple-600/10 to-blue-600/10">
                      <th className="px-6 py-4 text-left text-sm font-semibold text-slate-300">
                        <div className="flex items-center gap-2">
                          <AlertTriangle size={18} className="text-purple-400" />
                          Issue
                        </div>
                      </th>
                      <th className="px-6 py-4 text-left text-sm font-semibold text-slate-300">
                        <div className="flex items-center gap-2">
                          <Home size={18} className="text-purple-400" />
                          Room
                        </div>
                      </th>
                      <th className="px-6 py-4 text-left text-sm font-semibold text-slate-300">Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {tickets.map((ticket, index) => {
                      const statusStyle = statusConfig[ticket.status] || statusConfig.Open;
                      return (
                        <motion.tr
                          key={`${ticket.issue}-${ticket.room}-${index}`}
                          variants={rowVariants}
                          whileHover="hover"
                          className="border-b border-slate-700/30 transition-all duration-200"
                        >
                          <td className="px-6 py-4">
                            <div className="flex items-center gap-3">
                              <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-orange-600 to-red-600 flex items-center justify-center flex-shrink-0">
                                <Wrench size={20} className="text-white" />
                              </div>
                              <span className="font-semibold text-slate-50">
                                {ticket.issue}
                              </span>
                            </div>
                          </td>
                          <td className="px-6 py-4">
                            <div className="flex items-center gap-2 text-slate-300">
                              <Home size={16} className="text-cyan-400" />
                              {ticket.room}
                            </div>
                          </td>
                          <td className="px-6 py-4">
                            <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-semibold border ${statusStyle.bg} ${statusStyle.border} ${statusStyle.text}`}>
                              {ticket.status}
                            </span>
                          </td>
                        </motion.tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>
          ) : (
            <motion.div
              variants={itemVariants}
              className="glass-dark rounded-2xl p-12 text-center border-2 border-dashed border-slate-700/50"
            >
              <Wrench size={48} className="text-slate-500 mx-auto mb-4 opacity-50" />
              <p className="text-slate-400 text-lg mb-6">
                No maintenance tickets found
              </p>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="inline-flex items-center px-6 py-3 rounded-lg bg-gradient-to-r from-purple-600 to-blue-600 text-white font-semibold hover:shadow-lg hover:shadow-purple-500/50 transition-all"
              >
                <Plus size={20} className="mr-2" />
                Create Your First Ticket
              </motion.button>
            </motion.div>
          )}
        </motion.div>
      </div>
    </motion.section>
  );
}
