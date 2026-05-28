import { useEffect, useState } from "react";
import { apiGet } from "../api/client.js";
import { motion } from "framer-motion";
import { Home, Users, AlertCircle, Plus } from "lucide-react";

const statusConfig = {
  Occupied: { bg: "bg-blue-500/20", border: "border-blue-500/50", text: "text-blue-300" },
  Available: { bg: "bg-green-500/20", border: "border-green-500/50", text: "text-green-300" },
  Maintenance: { bg: "bg-red-500/20", border: "border-red-500/50", text: "text-red-300" }
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

export default function Rooms() {
  const [rooms, setRooms] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    let isMounted = true;

    apiGet("/rooms")
      .then((data) => {
        if (isMounted) {
          setRooms(data);
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
          <p className="text-center text-slate-300 mt-4">Loading rooms...</p>
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
                Rooms
              </h1>
              <p className="text-slate-400">
                Live status for all rooms and beds
              </p>
            </div>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="inline-flex items-center px-6 py-3 rounded-lg bg-gradient-to-r from-purple-600 to-blue-600 text-white font-semibold hover:shadow-lg hover:shadow-purple-500/50 transition-all"
            >
              <Plus size={20} className="mr-2" />
              Add Room
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
                <p className="text-slate-300">Unable to load rooms: {error}</p>
              </div>
            </div>
          </motion.div>
        )}

        {/* Rooms Table */}
        <motion.div variants={itemVariants}>
          {rooms.length > 0 ? (
            <div className="glass-dark rounded-2xl overflow-hidden border border-slate-700/30">
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-slate-700/30 bg-gradient-to-r from-purple-600/10 to-blue-600/10">
                      <th className="px-6 py-4 text-left text-sm font-semibold text-slate-300">
                        <div className="flex items-center gap-2">
                          <Home size={18} className="text-purple-400" />
                          Room
                        </div>
                      </th>
                      <th className="px-6 py-4 text-left text-sm font-semibold text-slate-300">Type</th>
                      <th className="px-6 py-4 text-left text-sm font-semibold text-slate-300">
                        <div className="flex items-center gap-2">
                          <Users size={18} className="text-purple-400" />
                          Beds
                        </div>
                      </th>
                      <th className="px-6 py-4 text-left text-sm font-semibold text-slate-300">Occupied</th>
                      <th className="px-6 py-4 text-left text-sm font-semibold text-slate-300">Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {rooms.map((room, index) => {
                      const statusStyle = statusConfig[room.status] || statusConfig.Available;
                      return (
                        <motion.tr
                          key={`${room.number}-${index}`}
                          variants={rowVariants}
                          whileHover="hover"
                          className="border-b border-slate-700/30 transition-all duration-200"
                        >
                          <td className="px-6 py-4">
                            <span className="font-semibold text-slate-50">
                              {room.number}
                            </span>
                          </td>
                          <td className="px-6 py-4 text-slate-300">
                            {room.type}
                          </td>
                          <td className="px-6 py-4">
                            <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-semibold bg-slate-700/50 text-slate-300">
                              {room.beds}
                            </span>
                          </td>
                          <td className="px-6 py-4 text-slate-300">
                            {room.occupied}
                          </td>
                          <td className="px-6 py-4">
                            <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-semibold border ${statusStyle.bg} ${statusStyle.border} ${statusStyle.text}`}>
                              {room.status}
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
              <Home size={48} className="text-slate-500 mx-auto mb-4 opacity-50" />
              <p className="text-slate-400 text-lg mb-6">
                No rooms found
              </p>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="inline-flex items-center px-6 py-3 rounded-lg bg-gradient-to-r from-purple-600 to-blue-600 text-white font-semibold hover:shadow-lg hover:shadow-purple-500/50 transition-all"
              >
                <Plus size={20} className="mr-2" />
                Add Your First Room
              </motion.button>
            </motion.div>
          )}
        </motion.div>
      </div>
    </motion.section>
  );
}
