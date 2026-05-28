import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { apiDelete, apiGet } from "../api/client.js";
import { motion } from "framer-motion";
import { Building2, CreditCard, Plus, Edit2, Trash2, MapPin, AlertCircle } from "lucide-react";

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

export default function OwnerDashboard() {
  const [hostels, setHostels] = useState([]);
  const [subscription, setSubscription] = useState(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);
  const [deleting, setDeleting] = useState(null);

  const loadData = async () => {
    setError("");

    try {
      const [myHostels, mySubscription] = await Promise.all([
        apiGet("/hostels/owner/mine"),
        apiGet("/subscriptions/me")
      ]);

      setHostels(myHostels);
      setSubscription(mySubscription);
      setLoading(false);
    } catch (err) {
      setError(err.message);
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleDelete = async (hostelId) => {
    if (!window.confirm("Are you sure you want to delete this hostel?")) return;

    setDeleting(hostelId);
    try {
      await apiDelete(`/hostels/${hostelId}`);
      await loadData();
    } catch (err) {
      setError(err.message);
    }
    setDeleting(null);
  };

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
          <p className="text-center text-slate-300 mt-4">Loading your dashboard...</p>
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
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div>
              <h1 className="text-4xl md:text-5xl font-bold text-gradient mb-2">
                Owner Dashboard
              </h1>
              <p className="text-slate-400">
                Manage your hostels and subscription
              </p>
            </div>
            <div className="flex flex-col sm:flex-row gap-3">
              <Link
                to="/subscribe"
                className="inline-flex items-center justify-center px-6 py-3 rounded-lg bg-gradient-to-r from-cyan-600 to-blue-600 text-white font-semibold hover:shadow-lg hover:shadow-cyan-500/50 transition-all"
              >
                <CreditCard size={20} className="mr-2" />
                Subscription
              </Link>
              <Link
                to="/owner/hostels/new"
                className="inline-flex items-center justify-center px-6 py-3 rounded-lg bg-gradient-to-r from-purple-600 to-blue-600 text-white font-semibold hover:shadow-lg hover:shadow-purple-500/50 transition-all"
              >
                <Plus size={20} className="mr-2" />
                Add Hostel
              </Link>
            </div>
          </div>
        </motion.div>

        {/* Subscription Card */}
        <motion.div variants={itemVariants} className="mb-12">
          {subscription ? (
            <div className="glass-dark rounded-3xl p-8 border-t border-cyan-500/30">
              <div className="flex items-center gap-4 mb-4">
                <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-cyan-600 to-blue-600 flex items-center justify-center">
                  <CreditCard size={24} className="text-white" />
                </div>
                <div>
                  <h2 className="text-2xl font-bold text-slate-50">Subscription Status</h2>
                  <p className="text-slate-400">Your current plan and billing information</p>
                </div>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="bg-slate-700/30 rounded-lg p-4">
                  <p className="text-slate-400 text-sm mb-1">Status</p>
                  <p className="text-lg font-bold text-slate-50">
                    {subscription.hasActive ? "✓ Active" : "Inactive"}
                  </p>
                </div>
                {subscription.subscription && (
                  <>
                    <div className="bg-slate-700/30 rounded-lg p-4">
                      <p className="text-slate-400 text-sm mb-1">Plan</p>
                      <p className="text-lg font-bold text-slate-50">
                        {subscription.subscription.planId}
                      </p>
                    </div>
                    <div className="bg-slate-700/30 rounded-lg p-4">
                      <p className="text-slate-400 text-sm mb-1">Renewal</p>
                      <p className="text-lg font-bold text-slate-50">
                        {new Date(subscription.subscription.renewalDate).toLocaleDateString()}
                      </p>
                    </div>
                  </>
                )}
              </div>
            </div>
          ) : (
            <div className="glass-dark rounded-3xl p-8 border-l-4 border-yellow-500">
              <div className="flex items-center gap-4">
                <AlertCircle size={32} className="text-yellow-400 flex-shrink-0" />
                <div>
                  <h3 className="text-xl font-bold text-yellow-300 mb-1">No Active Subscription</h3>
                  <p className="text-slate-300">Subscribe to unlock hosting features and reach more guests</p>
                  <Link
                    to="/subscribe"
                    className="inline-flex items-center mt-3 px-4 py-2 rounded-lg bg-yellow-500/20 text-yellow-300 font-semibold hover:bg-yellow-500/30 transition-all"
                  >
                    View Plans
                  </Link>
                </div>
              </div>
            </div>
          )}
        </motion.div>

        {/* Hostels Section */}
        <motion.div variants={itemVariants}>
          <h2 className="text-2xl md:text-3xl font-bold text-slate-900 dark:text-slate-50 mb-6 flex items-center gap-2">
            <Building2 size={28} className="text-purple-500" />
            Your Hostels
          </h2>

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

          {hostels.length > 0 ? (
            <motion.div
              variants={containerVariants}
              initial="hidden"
              animate="visible"
              className="grid grid-cols-1 md:grid-cols-2 gap-6"
            >
              {hostels.map((hostel) => (
                <motion.div
                  key={hostel.id}
                  variants={cardVariants}
                  whileHover="hover"
                  className="glass-dark rounded-2xl p-6 border-l-4 border-purple-500/50"
                >
                  <h3 className="text-xl font-bold text-slate-50 mb-2">
                    {hostel.name}
                  </h3>
                  <div className="flex items-center gap-2 text-slate-300 mb-6">
                    <MapPin size={18} className="text-cyan-400" />
                    <span className="text-sm">
                      {hostel.area}, {hostel.city}
                    </span>
                  </div>

                  <div className="flex gap-3">
                    <Link
                      to={`/owner/hostels/${hostel.id}/edit`}
                      className="flex-1 inline-flex items-center justify-center px-4 py-2 rounded-lg bg-blue-500/20 text-blue-300 font-semibold hover:bg-blue-500/30 transition-all"
                    >
                      <Edit2 size={18} className="mr-2" />
                      Edit
                    </Link>
                    <button
                      onClick={() => handleDelete(hostel.id)}
                      disabled={deleting === hostel.id}
                      className="flex-1 inline-flex items-center justify-center px-4 py-2 rounded-lg bg-red-500/20 text-red-300 font-semibold hover:bg-red-500/30 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      {deleting === hostel.id ? (
                        <>
                          <motion.div
                            animate={{ rotate: 360 }}
                            transition={{ repeat: Infinity, duration: 1 }}
                            className="w-4 h-4 border-2 border-red-300/30 border-t-red-300 rounded-full mr-2"
                          />
                          Deleting...
                        </>
                      ) : (
                        <>
                          <Trash2 size={18} className="mr-2" />
                          Delete
                        </>
                      )}
                    </button>
                  </div>
                </motion.div>
              ))}
            </motion.div>
          ) : (
            <motion.div
              variants={itemVariants}
              className="glass-dark rounded-2xl p-12 text-center border-2 border-dashed border-slate-700/50"
            >
              <Building2 size={48} className="text-slate-500 mx-auto mb-4 opacity-50" />
              <p className="text-slate-400 text-lg mb-6">
                No hostels listed yet
              </p>
              <Link
                to="/owner/hostels/new"
                className="inline-flex items-center px-6 py-3 rounded-lg bg-gradient-to-r from-purple-600 to-blue-600 text-white font-semibold hover:shadow-lg hover:shadow-purple-500/50 transition-all"
              >
                <Plus size={20} className="mr-2" />
                Add Your First Hostel
              </Link>
            </motion.div>
          )}
        </motion.div>
      </div>
    </motion.section>
  );
}
