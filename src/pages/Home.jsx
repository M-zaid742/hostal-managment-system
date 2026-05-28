import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { Heart, Search, MapPin, DollarSign, Users, ChevronRight } from "lucide-react";
import { apiDelete, apiGet, apiPost } from "../api/client.js";
import HeroBio from "../components/HeroBio.jsx";
import { getUser } from "../utils/auth.js";

const LoadingSkeleton = () => (
  <div className="space-y-4">
    {[1, 2, 3, 4, 5, 6].map((i) => (
      <motion.div
        key={i}
        className="skeleton h-64 rounded-2xl"
        animate={{ opacity: [0.5, 1, 0.5] }}
        transition={{ duration: 2, repeat: Infinity }}
      />
    ))}
  </div>
);

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

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.5, ease: "easeOut" },
  },
};

const cardVariants = {
  hidden: { opacity: 0, scale: 0.9 },
  visible: {
    opacity: 1,
    scale: 1,
    transition: { duration: 0.4, ease: "easeOut" },
  },
  hover: {
    y: -8,
    boxShadow: "0 20px 40px rgba(139, 92, 246, 0.2)",
    transition: { duration: 0.3 },
  },
};

export default function Home() {
  const [hostels, setHostels] = useState([]);
  const [favorites, setFavorites] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [filters, setFilters] = useState({
    city: "",
    area: "",
    roomType: "all",
    minRent: "",
    maxRent: ""
  });

  const user = getUser();
  const favoriteIds = useMemo(() => new Set(favorites.map((item) => item.id)), [favorites]);

  const loadHostels = async () => {
    setLoading(true);
    setError("");

    try {
      const params = new URLSearchParams();

      if (filters.city.trim()) {
        params.set("city", filters.city.trim());
      }
      if (filters.area.trim()) {
        params.set("area", filters.area.trim());
      }
      if (filters.roomType !== "all") {
        params.set("roomType", filters.roomType);
      }
      if (filters.minRent) {
        params.set("minRent", filters.minRent);
      }
      if (filters.maxRent) {
        params.set("maxRent", filters.maxRent);
      }

      const data = await apiGet(`/hostels${params.toString() ? `?${params.toString()}` : ""}`);
      setHostels(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const loadFavorites = async () => {
    if (!user) {
      setFavorites([]);
      return;
    }

    try {
      const data = await apiGet("/users/favorites");
      setFavorites(data);
    } catch {
      setFavorites([]);
    }
  };

  useEffect(() => {
    loadHostels();
    loadFavorites();
  }, []);

  const onFilterChange = (event) => {
    const { name, value } = event.target;
    setFilters((prev) => ({ ...prev, [name]: value }));
  };

  const applyFilters = async (event) => {
    event.preventDefault();
    await loadHostels();
  };

  const resetFilters = async () => {
    const reset = { city: "", area: "", roomType: "all", minRent: "", maxRent: "" };
    setFilters(reset);
    setTimeout(() => {
      loadHostels();
    }, 0);
  };

  const toggleFavorite = async (hostelId) => {
    if (!user) {
      setError("Please login to save favorites.");
      return;
    }

    try {
      if (favoriteIds.has(hostelId)) {
        await apiDelete(`/users/favorites/${hostelId}`);
      } else {
        await apiPost(`/users/favorites/${hostelId}`, {});
      }

      await loadFavorites();
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <motion.div
      className="container-modern"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      {/* Bio Section */}
      <HeroBio />

      {/* Hero Section */}
      <motion.section
        className="mb-16 md:mb-24"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        <div className="grid grid-cols-1 lg:grid-cols-5 gap-8 items-center mb-12">
          {/* Hero Content */}
          <motion.div className="lg:col-span-3" variants={itemVariants}>
            <motion.span
              className="badge-modern mb-4"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.2 }}
            >
              ✨ Verified Hostels
            </motion.span>
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-gradient mb-6 leading-tight">
              Find Your Perfect Hostel
            </h1>
            <p className="text-lg text-slate-600 dark:text-slate-300 mb-8 leading-relaxed">
              Discover verified hostels with real reviews, transparent pricing, and curated amenities. Search by location, filter by your budget, and book with confidence.
            </p>
            <motion.div
              className="flex flex-wrap gap-4"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
            >
              <motion.div
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <Link to="/subscribe" className="btn-primary">
                  List Your Hostel
                  <ChevronRight className="inline-block ml-2" size={20} />
                </Link>
              </motion.div>
            </motion.div>
          </motion.div>

          {/* Stats Card */}
          <motion.div
            className="lg:col-span-2"
            variants={itemVariants}
          >
            <motion.div
              className="glass rounded-3xl p-8 h-full flex flex-col justify-center items-center text-center hover-lift"
              whileHover={{ scale: 1.05 }}
            >
              <motion.div
                className="text-5xl md:text-6xl font-bold text-gradient mb-3"
                animate={{ scale: [1, 1.1, 1] }}
                transition={{ duration: 2, repeat: Infinity }}
              >
                {hostels.length}
              </motion.div>
              <p className="text-slate-600 dark:text-slate-300 font-medium mb-2">
                Active Hostels
              </p>
              <p className="text-sm text-slate-500 dark:text-slate-400">
                Verified listings from trusted owners
              </p>
            </motion.div>
          </motion.div>
        </div>
      </motion.section>

      {/* Search & Filter Section */}
      <motion.section
        className="mb-16"
        variants={itemVariants}
        initial="hidden"
        animate="visible"
      >
        <motion.div
          className="glass-dark rounded-3xl p-8 md:p-12 border border-slate-700/30"
          whileHover={{ boxShadow: "0 20px 60px rgba(139, 92, 246, 0.15)" }}
        >
          <div className="flex items-center gap-3 mb-8">
            <Search className="text-purple-500" size={24} />
            <h2 className="text-2xl font-bold text-slate-900 dark:text-white">
              Search Hostels
            </h2>
          </div>

          <form onSubmit={applyFilters} className="space-y-6">
            {/* Filter Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
              {/* City Input */}
              <motion.div whileFocus={{ scale: 1.02 }}>
                <label className="block text-sm font-semibold text-slate-700 dark:text-slate-200 mb-2">
                  City
                </label>
                <input
                  type="text"
                  name="city"
                  value={filters.city}
                  onChange={onFilterChange}
                  placeholder="Lahore"
                  className="input-modern"
                />
              </motion.div>

              {/* Area Input */}
              <motion.div whileFocus={{ scale: 1.02 }}>
                <label className="block text-sm font-semibold text-slate-700 dark:text-slate-200 mb-2">
                  Area
                </label>
                <input
                  type="text"
                  name="area"
                  value={filters.area}
                  onChange={onFilterChange}
                  placeholder="Johar Town"
                  className="input-modern"
                />
              </motion.div>

              {/* Min Rent */}
              <motion.div whileFocus={{ scale: 1.02 }}>
                <label className="block text-sm font-semibold text-slate-700 dark:text-slate-200 mb-2">
                  Min Rent
                </label>
                <input
                  type="number"
                  name="minRent"
                  value={filters.minRent}
                  onChange={onFilterChange}
                  placeholder="3000"
                  className="input-modern"
                />
              </motion.div>

              {/* Max Rent */}
              <motion.div whileFocus={{ scale: 1.02 }}>
                <label className="block text-sm font-semibold text-slate-700 dark:text-slate-200 mb-2">
                  Max Rent
                </label>
                <input
                  type="number"
                  name="maxRent"
                  value={filters.maxRent}
                  onChange={onFilterChange}
                  placeholder="10000"
                  className="input-modern"
                />
              </motion.div>

              {/* Room Type */}
              <motion.div whileFocus={{ scale: 1.02 }}>
                <label className="block text-sm font-semibold text-slate-700 dark:text-slate-200 mb-2">
                  Room Type
                </label>
                <select
                  name="roomType"
                  value={filters.roomType}
                  onChange={onFilterChange}
                  className="input-modern"
                >
                  <option value="all">All Types</option>
                  <option value="single">Single</option>
                  <option value="shared">Shared</option>
                  <option value="private">Private</option>
                </select>
              </motion.div>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row gap-3 pt-4">
              <motion.button
                type="submit"
                className="btn-primary flex-1 flex items-center justify-center gap-2"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <Search size={20} />
                Apply Filters
              </motion.button>
              <motion.button
                type="button"
                onClick={resetFilters}
                className="btn-secondary flex-1 flex items-center justify-center gap-2"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                Reset
              </motion.button>
            </div>
          </form>
        </motion.div>
      </motion.section>

      {/* Error Alert */}
      {error && (
        <motion.div
          className="glass-dark border-l-4 border-red-500 p-6 rounded-xl mb-8"
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
        >
          <p className="text-red-300">⚠️ {error}</p>
        </motion.div>
      )}

      {/* Login Reminder */}
      {error === "Please login to save favorites." && (
        <motion.div
          className="glass-dark border-l-4 border-blue-500 p-6 rounded-xl mb-8"
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
        >
          <Link to="/login" className="text-blue-300 hover:text-blue-200 font-semibold">
            → Login to save your favorite hostels
          </Link>
        </motion.div>
      )}

      {/* Loading State */}
      {loading && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <motion.div
                key={i}
                className="skeleton h-80 rounded-2xl"
                animate={{ opacity: [0.5, 1, 0.5] }}
                transition={{ duration: 2, repeat: Infinity }}
              />
            ))}
          </div>
        </motion.div>
      )}

      {/* Hostels Grid */}
      {!loading && !error && hostels.length > 0 && (
        <motion.section
          className="mb-16"
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          <div className="mb-8">
            <h2 className="text-3xl font-bold text-slate-900 dark:text-white mb-2">
              Available Hostels
            </h2>
            <p className="text-slate-600 dark:text-slate-400">
              Showing {hostels.length} hostel{hostels.length !== 1 ? "s" : ""} matching your criteria
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {hostels.map((hostel) => (
              <motion.div
                key={hostel.id}
                variants={cardVariants}
                whileHover="hover"
                className="group relative"
              >
                <motion.div
                  className="card-dark rounded-2xl overflow-hidden h-full flex flex-col cursor-pointer"
                  layoutId={`card-${hostel.id}`}
                >
                  {/* Header with location badge */}
                  <div className="p-6 pb-4">
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex-1">
                        <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-2 group-hover:text-gradient transition-all">
                          {hostel.name}
                        </h3>
                        <div className="flex items-center gap-2 text-slate-600 dark:text-slate-400 mb-3">
                          <MapPin size={18} className="text-purple-500" />
                          <span className="text-sm">
                            {hostel.area}
                            {hostel.city ? `, ${hostel.city}` : ""}
                          </span>
                        </div>
                      </div>
                      <motion.button
                        onClick={() => toggleFavorite(hostel.id)}
                        className="p-2 rounded-lg bg-white/10 hover:bg-white/20 transition-all"
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.9 }}
                      >
                        <Heart
                          size={20}
                          className={
                            favoriteIds.has(hostel.id)
                              ? "fill-red-500 text-red-500"
                              : "text-slate-400"
                          }
                        />
                      </motion.button>
                    </div>

                    {/* Gender Badge */}
                    {hostel.gender && (
                      <motion.span
                        className="inline-block px-3 py-1 rounded-full text-xs font-semibold bg-gradient-to-r from-blue-500/20 to-cyan-500/20 text-blue-300 border border-blue-500/30 mb-4"
                        initial={{ opacity: 0, scale: 0.8 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ delay: 0.2 }}
                      >
                        {hostel.gender.toUpperCase()}
                      </motion.span>
                    )}
                  </div>

                  {/* Stats */}
                  <div className="px-6 py-4 grid grid-cols-3 gap-3 border-t border-slate-700/30 mb-auto">
                    {/* Beds Available */}
                    {hostel.beds_available > 0 && (
                      <motion.div
                        className="flex flex-col items-center text-center"
                        whileHover={{ scale: 1.05 }}
                      >
                        <Users size={20} className="text-cyan-400 mb-1" />
                        <span className="text-sm font-semibold text-slate-900 dark:text-white">
                          {hostel.beds_available}
                        </span>
                        <span className="text-xs text-slate-500 dark:text-slate-400">
                          Beds
                        </span>
                      </motion.div>
                    )}

                    {/* Rent Range */}
                    {hostel.min_rent && (
                      <motion.div
                        className="flex flex-col items-center text-center"
                        whileHover={{ scale: 1.05 }}
                      >
                        <DollarSign size={20} className="text-green-400 mb-1" />
                        <span className="text-sm font-semibold text-slate-900 dark:text-white">
                          {hostel.min_rent}
                        </span>
                        <span className="text-xs text-slate-500 dark:text-slate-400">
                          PKR+
                        </span>
                      </motion.div>
                    )}

                    {/* Room Types */}
                    {hostel.room_types && hostel.room_types.length > 0 && (
                      <motion.div
                        className="flex flex-col items-center text-center"
                        whileHover={{ scale: 1.05 }}
                      >
                        <Users size={20} className="text-purple-400 mb-1" />
                        <span className="text-sm font-semibold text-slate-900 dark:text-white">
                          {hostel.room_types.length}
                        </span>
                        <span className="text-xs text-slate-500 dark:text-slate-400">
                          Types
                        </span>
                      </motion.div>
                    )}
                  </div>

                  {/* Action Buttons */}
                  <div className="p-6 pt-4 flex gap-3">
                    <Link
                      to={`/hostels/${hostel.id}`}
                      className="flex-1 btn-primary text-center flex items-center justify-center gap-2"
                    >
                      View Details
                      <ChevronRight size={18} />
                    </Link>
                  </div>
                </motion.div>
              </motion.div>
            ))}
          </div>
        </motion.section>
      )}

      {/* No Results */}
      {!loading && !error && hostels.length === 0 && (
        <motion.div
          className="glass-dark rounded-2xl p-12 text-center"
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
        >
          <motion.div
            animate={{ rotate: [0, 5, -5, 0] }}
            transition={{ duration: 2, repeat: Infinity }}
            className="text-5xl mb-4"
          >
            🏠
          </motion.div>
          <h3 className="text-2xl font-bold text-slate-900 dark:text-white mb-2">
            No hostels found
          </h3>
          <p className="text-slate-600 dark:text-slate-400 mb-6">
            Try adjusting your filters or reset them to see all available hostels.
          </p>
          <motion.button
            onClick={resetFilters}
            className="btn-primary"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            View All Hostels
          </motion.button>
        </motion.div>
      )}
    </motion.div>
  );
}
