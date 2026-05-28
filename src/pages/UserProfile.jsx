import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { apiGet } from "../api/client.js";
import { motion } from "framer-motion";
import { User, Mail, Heart, MapPin, ChevronRight } from "lucide-react";

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

export default function UserProfile() {
  const [profile, setProfile] = useState(null);
  const [favorites, setFavorites] = useState([]);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([apiGet("/users/me"), apiGet("/users/favorites")])
      .then(([me, favs]) => {
        setProfile(me);
        setFavorites(favs);
        setLoading(false);
      })
      .catch((err) => {
        setError(err.message);
        setLoading(false);
      });
  }, []);

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="glass-dark rounded-2xl p-8 max-w-md w-full border-l-4 border-red-500"
        >
          <h2 className="text-2xl font-bold text-red-400 mb-2">Error</h2>
          <p className="text-slate-300">{error}</p>
        </motion.div>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center px-4">
        <div className="glass-dark rounded-2xl p-12 max-w-md w-full">
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ repeat: Infinity, duration: 2 }}
            className="w-12 h-12 border-4 border-purple-500/30 border-t-purple-500 rounded-full mx-auto"
          />
          <p className="text-center text-slate-300 mt-4">Loading your profile...</p>
        </div>
      </div>
    );
  }

  if (!profile) {
    return (
      <div className="min-h-screen flex items-center justify-center px-4">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="glass-dark rounded-2xl p-8 max-w-md w-full text-center"
        >
          <p className="text-slate-400">Profile not found</p>
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
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Profile Header Card */}
        <motion.div
          variants={itemVariants}
          className="glass-dark rounded-3xl p-8 md:p-12 mb-8 border-t border-purple-500/30"
        >
          <div className="flex flex-col md:flex-row items-start md:items-center gap-6 md:gap-8">
            <div className="w-20 h-20 rounded-full bg-gradient-to-br from-purple-600 to-blue-600 flex items-center justify-center flex-shrink-0">
              <User size={48} className="text-white" />
            </div>
            <div className="flex-1">
              <h1 className="text-4xl md:text-5xl font-bold text-gradient mb-2">
                {profile.name}
              </h1>
              <div className="flex flex-col gap-2 text-slate-400">
                <div className="flex items-center gap-3">
                  <Mail size={18} className="text-purple-400" />
                  <span>{profile.email}</span>
                </div>
                <div className="inline-flex items-center px-4 py-2 rounded-full bg-purple-500/20 border border-purple-500/50 w-fit">
                  <span className="text-sm font-semibold text-purple-300 capitalize">
                    {profile.role || 'User'}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Saved Hostels Section */}
        <motion.div variants={itemVariants}>
          <h2 className="text-2xl md:text-3xl font-bold text-slate-900 dark:text-slate-50 mb-6 flex items-center gap-2">
            <Heart size={28} className="text-red-500" />
            Your Saved Hostels
          </h2>

          {favorites.length > 0 ? (
            <motion.div
              variants={containerVariants}
              initial="hidden"
              animate="visible"
              className="grid grid-cols-1 md:grid-cols-2 gap-6"
            >
              {favorites.map((hostel, index) => (
                <motion.div
                  key={hostel.id}
                  variants={cardVariants}
                  whileHover="hover"
                  className="glass-dark rounded-2xl p-6 border-l-4 border-purple-500/50 overflow-hidden group"
                >
                  <div className="flex justify-between items-start mb-4">
                    <h3 className="text-xl font-bold text-slate-50 group-hover:text-gradient transition-all">
                      {hostel.name}
                    </h3>
                    <Heart
                      size={24}
                      className="text-red-500 fill-red-500 flex-shrink-0"
                    />
                  </div>

                  <div className="space-y-3 mb-6">
                    <div className="flex items-center gap-2 text-slate-300">
                      <MapPin size={18} className="text-cyan-400 flex-shrink-0" />
                      <span className="text-sm">
                        {hostel.area}, {hostel.city}
                      </span>
                    </div>
                  </div>

                  <Link
                    to={`/hostels/${hostel.id}`}
                    className="inline-flex items-center px-4 py-2 rounded-lg bg-gradient-to-r from-purple-600 to-blue-600 text-white font-semibold hover:shadow-lg hover:shadow-purple-500/50 transition-all duration-200 group/btn"
                  >
                    View Details
                    <ChevronRight size={18} className="ml-2 group-hover/btn:translate-x-1 transition-transform" />
                  </Link>
                </motion.div>
              ))}
            </motion.div>
          ) : (
            <motion.div
              variants={itemVariants}
              className="glass-dark rounded-2xl p-12 text-center"
            >
              <Heart size={48} className="text-slate-500 mx-auto mb-4 opacity-50" />
              <p className="text-slate-400 text-lg mb-6">
                No saved hostels yet
              </p>
              <Link
                to="/"
                className="inline-flex items-center px-6 py-3 rounded-lg bg-gradient-to-r from-purple-600 to-blue-600 text-white font-semibold hover:shadow-lg hover:shadow-purple-500/50 transition-all"
              >
                Discover Hostels
                <ChevronRight size={20} className="ml-2" />
              </Link>
            </motion.div>
          )}
        </motion.div>
      </div>
    </motion.section>
  );
}
