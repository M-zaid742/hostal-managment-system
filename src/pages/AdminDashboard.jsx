import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { apiGet, apiPut } from "../api/client.js";
import { CheckCircle, XCircle, Clock, Users, Building2, AlertCircle, Search } from "lucide-react";

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

const cardVariants = {
  hidden: { opacity: 0, scale: 0.95 },
  visible: {
    opacity: 1,
    scale: 1,
    transition: { type: "spring", stiffness: 100 }
  },
  hover: { scale: 1.02, transition: { duration: 0.2 } }
};

export default function AdminDashboard() {
  const [pendingHostels, setPendingHostels] = useState([]);
  const [approvedHostels, setApprovedHostels] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [filterStatus, setFilterStatus] = useState("pending");
  const [actingOnId, setActingOnId] = useState(null);

  useEffect(() => {
    loadHostels();
  }, []);

  const loadHostels = async () => {
    setError("");
    try {
      const [pending, approved] = await Promise.all([
        apiGet("/admin/hostels/pending"),
        apiGet("/admin/hostels/approved")
      ]);
      setPendingHostels(pending || []);
      setApprovedHostels(approved || []);
      setLoading(false);
    } catch (err) {
      setError(err.message);
      setLoading(false);
    }
  };

  const handleApproveHostel = async (hostelId) => {
    setActingOnId(hostelId);
    try {
      await apiPut(`/admin/hostels/${hostelId}/approve`, {});
      setPendingHostels(pendingHostels.filter(h => h.id !== hostelId));
      await loadHostels();
    } catch (err) {
      setError(err.message);
    }
    setActingOnId(null);
  };

  const handleRejectHostel = async (hostelId) => {
    if (!window.confirm("Are you sure you want to reject this hostel?")) return;
    
    setActingOnId(hostelId);
    try {
      await apiPut(`/admin/hostels/${hostelId}/reject`, {});
      setPendingHostels(pendingHostels.filter(h => h.id !== hostelId));
    } catch (err) {
      setError(err.message);
    }
    setActingOnId(null);
  };

  const hostelList = filterStatus === "pending" ? pendingHostels : approvedHostels;
  const filteredHostels = hostelList.filter(hostel =>
    hostel.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    hostel.city?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    hostel.area?.toLowerCase().includes(searchTerm.toLowerCase())
  );

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
          <p className="text-center text-slate-300 mt-4">Loading admin data...</p>
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
        <motion.div variants={itemVariants} className="mb-8">
          <h1 className="text-4xl md:text-5xl font-bold text-gradient mb-2">
            Admin Dashboard
          </h1>
          <p className="text-slate-400">
            Manage hostel approvals, subscriptions, and system overview
          </p>
        </motion.div>

        {/* Stats Cards */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12"
        >
          <motion.div variants={cardVariants} className="glass-dark rounded-2xl p-6 border-l-4 border-yellow-500">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-slate-400 text-sm">Pending Approval</p>
                <p className="text-4xl font-bold text-slate-50">{pendingHostels.length}</p>
              </div>
              <Clock size={32} className="text-yellow-500 opacity-50" />
            </div>
          </motion.div>

          <motion.div variants={cardVariants} className="glass-dark rounded-2xl p-6 border-l-4 border-green-500">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-slate-400 text-sm">Approved</p>
                <p className="text-4xl font-bold text-slate-50">{approvedHostels.length}</p>
              </div>
              <CheckCircle size={32} className="text-green-500 opacity-50" />
            </div>
          </motion.div>

          <motion.div variants={cardVariants} className="glass-dark rounded-2xl p-6 border-l-4 border-blue-500">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-slate-400 text-sm">Total Hostels</p>
                <p className="text-4xl font-bold text-slate-50">{pendingHostels.length + approvedHostels.length}</p>
              </div>
              <Building2 size={32} className="text-blue-500 opacity-50" />
            </div>
          </motion.div>

          <motion.div variants={cardVariants} className="glass-dark rounded-2xl p-6 border-l-4 border-purple-500">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-slate-400 text-sm">Subscriptions</p>
                <p className="text-4xl font-bold text-slate-50">{approvedHostels.length}</p>
              </div>
              <Users size={32} className="text-purple-500 opacity-50" />
            </div>
          </motion.div>
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
                <p className="text-slate-300">{error}</p>
              </div>
            </div>
          </motion.div>
        )}

        {/* Filter and Search */}
        <motion.div variants={itemVariants} className="mb-8 glass-dark rounded-2xl p-6">
          <div className="flex flex-col md:flex-row gap-4 items-end">
            <div className="flex-1">
              <label className="block text-sm font-semibold text-slate-300 mb-2">
                Search Hostels
              </label>
              <div className="relative">
                <Search size={18} className="absolute left-3 top-3 text-slate-500" />
                <input
                  type="text"
                  placeholder="Search by name, city, or area..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 rounded-lg bg-slate-700/50 border border-slate-600 text-slate-50 placeholder-slate-400 focus:outline-none focus:border-purple-500"
                />
              </div>
            </div>
            <div>
              <label className="block text-sm font-semibold text-slate-300 mb-2">
                Status
              </label>
              <select
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value)}
                className="px-4 py-2 rounded-lg bg-slate-700/50 border border-slate-600 text-slate-50 focus:outline-none focus:border-purple-500"
              >
                <option value="pending">Pending</option>
                <option value="approved">Approved</option>
              </select>
            </div>
          </div>
        </motion.div>

        {/* Hostels List */}
        <motion.div variants={itemVariants}>
          <h2 className="text-2xl font-bold text-slate-50 mb-6">
            {filterStatus === "pending" ? "Pending Approvals" : "Approved Hostels"}
          </h2>

          {filteredHostels.length > 0 ? (
            <motion.div
              variants={containerVariants}
              initial="hidden"
              animate="visible"
              className="grid grid-cols-1 md:grid-cols-2 gap-6"
            >
              {filteredHostels.map((hostel) => (
                <motion.div
                  key={hostel.id}
                  variants={cardVariants}
                  whileHover="hover"
                  className="glass-dark rounded-2xl p-6 border-l-4 border-purple-500/50"
                >
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex-1">
                      <h3 className="text-xl font-bold text-slate-50 mb-2">
                        {hostel.name}
                      </h3>
                      <p className="text-slate-400 text-sm">
                        {hostel.area}, {hostel.city}
                      </p>
                    </div>
                    {filterStatus === "pending" ? (
                      <Clock size={24} className="text-yellow-500 flex-shrink-0" />
                    ) : (
                      <CheckCircle size={24} className="text-green-500 flex-shrink-0" />
                    )}
                  </div>

                  <div className="bg-slate-700/30 rounded-lg p-4 mb-6 space-y-2">
                    <p className="text-sm text-slate-300">
                      <span className="text-slate-400">Owner:</span> {hostel.ownerName || "N/A"}
                    </p>
                    <p className="text-sm text-slate-300">
                      <span className="text-slate-400">Email:</span> {hostel.email || "N/A"}
                    </p>
                    <p className="text-sm text-slate-300">
                      <span className="text-slate-400">Phone:</span> {hostel.phone || "N/A"}
                    </p>
                    <p className="text-sm text-slate-300">
                      <span className="text-slate-400">Gender:</span> {hostel.gender || "Co-ed"}
                    </p>
                  </div>

                  {filterStatus === "pending" && (
                    <div className="flex gap-3">
                      <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={() => handleApproveHostel(hostel.id)}
                        disabled={actingOnId === hostel.id}
                        className="flex-1 inline-flex items-center justify-center px-4 py-2 rounded-lg bg-green-500/20 text-green-300 font-semibold hover:bg-green-500/30 transition-all disabled:opacity-50"
                      >
                        {actingOnId === hostel.id ? (
                          <>
                            <motion.div
                              animate={{ rotate: 360 }}
                              transition={{ repeat: Infinity, duration: 1 }}
                              className="w-4 h-4 border-2 border-green-300/30 border-t-green-300 rounded-full mr-2"
                            />
                            Approving...
                          </>
                        ) : (
                          <>
                            <CheckCircle size={18} className="mr-2" />
                            Approve
                          </>
                        )}
                      </motion.button>
                      <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={() => handleRejectHostel(hostel.id)}
                        disabled={actingOnId === hostel.id}
                        className="flex-1 inline-flex items-center justify-center px-4 py-2 rounded-lg bg-red-500/20 text-red-300 font-semibold hover:bg-red-500/30 transition-all disabled:opacity-50"
                      >
                        {actingOnId === hostel.id ? (
                          <>
                            <motion.div
                              animate={{ rotate: 360 }}
                              transition={{ repeat: Infinity, duration: 1 }}
                              className="w-4 h-4 border-2 border-red-300/30 border-t-red-300 rounded-full mr-2"
                            />
                            Rejecting...
                          </>
                        ) : (
                          <>
                            <XCircle size={18} className="mr-2" />
                            Reject
                          </>
                        )}
                      </motion.button>
                    </div>
                  )}
                </motion.div>
              ))}
            </motion.div>
          ) : (
            <motion.div
              variants={itemVariants}
              className="glass-dark rounded-2xl p-12 text-center border-2 border-dashed border-slate-700/50"
            >
              <Building2 size={48} className="text-slate-500 mx-auto mb-4 opacity-50" />
              <p className="text-slate-400 text-lg">
                {searchTerm
                  ? "No hostels found matching your search"
                  : `No ${filterStatus} hostels`}
              </p>
            </motion.div>
          )}
        </motion.div>
      </div>
    </motion.section>
  );
}
