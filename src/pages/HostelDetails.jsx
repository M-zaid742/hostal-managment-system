import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { MapContainer, Marker, Popup, TileLayer } from "react-leaflet";
import { motion } from "framer-motion";
import { ArrowLeft, MapPin, Users, Home, Wifi, Coffee, UtensilsCrossed, Heart, Share2, Phone, Mail, MessageCircle } from "lucide-react";
import { apiGet } from "../api/client.js";
import ChatWidget from "../components/ChatWidget.jsx";

const DetailSkeleton = () => (
  <motion.div
    className="container-modern"
    initial={{ opacity: 0 }}
    animate={{ opacity: 1 }}
  >
    <div className="skeleton h-12 w-32 rounded-lg mb-6" />
    <div className="skeleton h-64 w-full rounded-2xl mb-6" />
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      {[1, 2, 3].map((i) => (
        <div key={i} className="skeleton h-40 rounded-2xl" />
      ))}
    </div>
  </motion.div>
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

export default function HostelDetails() {
  const { hostelId } = useParams();
  const [hostel, setHostel] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    let isMounted = true;

    apiGet(`/hostels/${hostelId}`)
      .then((data) => {
        if (isMounted) {
          setHostel(data);
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
  }, [hostelId]);

  if (loading) {
    return <DetailSkeleton />;
  }

  if (error || !hostel) {
    return (
      <motion.div
        className="container-modern py-20 text-center"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
      >
        <motion.div
          className="glass-dark rounded-2xl p-12"
          initial={{ scale: 0.9 }}
          animate={{ scale: 1 }}
        >
          <div className="text-5xl mb-4">⚠️</div>
          <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-2">
            Unable to load hostel
          </h2>
          <p className="text-slate-600 dark:text-slate-400 mb-6">{error}</p>
          <Link to="/" className="btn-primary">
            <ArrowLeft className="inline-block mr-2" size={18} />
            Back to Listings
          </Link>
        </motion.div>
      </motion.div>
    );
  }

  const facilityIcons = {
    wifi: <Wifi size={20} />,
    coffee: <Coffee size={20} />,
    kitchen: <UtensilsCrossed size={20} />,
    default: <Home size={20} />,
  };

  return (
    <motion.div
      className="container-modern"
      variants={containerVariants}
      initial="hidden"
      animate="visible"
    >
      {/* Back Button */}
      <motion.div
        variants={itemVariants}
        className="mb-8"
      >
        <Link
          to="/"
          className="inline-flex items-center gap-2 px-4 py-2 rounded-lg glass hover:bg-white/20 dark:hover:bg-slate-800/50 transition-all group"
        >
          <ArrowLeft size={18} className="group-hover:-translate-x-1 transition-transform" />
          <span className="font-medium">Back to Listings</span>
        </Link>
      </motion.div>

      {/* Header Section */}
      <motion.section
        variants={itemVariants}
        className="mb-12"
      >
        <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-6 mb-6">
          <div className="flex-1">
            <h1 className="text-4xl md:text-5xl font-bold text-slate-900 dark:text-white mb-2">
              {hostel.name}
            </h1>
            <div className="flex items-center gap-2 text-slate-600 dark:text-slate-400 mb-4">
              <MapPin size={20} className="text-purple-500" />
              <span className="text-lg">
                {hostel.area} • {hostel.address}
              </span>
            </div>

            {/* Badges */}
            <div className="flex flex-wrap gap-3">
              {hostel.gender && (
                <motion.span
                  className="badge-modern"
                  whileHover={{ scale: 1.05 }}
                >
                  👥 {hostel.gender.toUpperCase()}
                </motion.span>
              )}
              {hostel.beds_available > 0 && (
                <motion.span
                  className="badge-modern"
                  whileHover={{ scale: 1.05 }}
                >
                  🛏️ {hostel.beds_available} Beds Available
                </motion.span>
              )}
            </div>
          </div>

          {/* Action Buttons */}
          <motion.div
            className="flex gap-3"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.3 }}
          >
            <motion.button
              className="p-3 rounded-lg glass hover:bg-white/20 dark:hover:bg-slate-800/50 transition-all"
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.95 }}
            >
              <Heart size={20} className="text-red-500" />
            </motion.button>
            <motion.button
              className="p-3 rounded-lg glass hover:bg-white/20 dark:hover:bg-slate-800/50 transition-all"
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.95 }}
            >
              <Share2 size={20} className="text-blue-500" />
            </motion.button>
          </motion.div>
        </div>
      </motion.section>

      {/* Images Section */}
      {hostel.images.length > 0 && (
        <motion.section
          variants={itemVariants}
          className="mb-12"
        >
          <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-6">
            Photo Gallery
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {hostel.images.map((image, idx) => (
              <motion.div
                key={image.id}
                className="relative overflow-hidden rounded-2xl glass-dark h-64 cursor-pointer group"
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: idx * 0.1 }}
                whileHover={{ scale: 1.05 }}
              >
                <img
                  src={image.url}
                  alt={`${hostel.name} - Gallery`}
                  className="w-full h-full object-cover group-hover:brightness-110 transition-all duration-300"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/30 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-all" />
              </motion.div>
            ))}
          </div>
        </motion.section>
      )}

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-12">
        {/* Rooms Table */}
        <motion.section
          variants={itemVariants}
          className="lg:col-span-2"
        >
          <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-6">
            Available Rooms
          </h2>

          {hostel.rooms.length > 0 ? (
            <motion.div
              className="glass-dark rounded-2xl overflow-hidden"
              whileHover={{ boxShadow: "0 20px 60px rgba(139, 92, 246, 0.15)" }}
            >
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-slate-700/30 bg-gradient-to-r from-purple-500/10 to-blue-500/10">
                      <th className="px-6 py-4 text-left text-sm font-semibold text-slate-900 dark:text-white">
                        Room Type
                      </th>
                      <th className="px-6 py-4 text-left text-sm font-semibold text-slate-900 dark:text-white">
                        Capacity
                      </th>
                      <th className="px-6 py-4 text-left text-sm font-semibold text-slate-900 dark:text-white">
                        Available
                      </th>
                      <th className="px-6 py-4 text-left text-sm font-semibold text-slate-900 dark:text-white">
                        Dates
                      </th>
                      <th className="px-6 py-4 text-right text-sm font-semibold text-slate-900 dark:text-white">
                        Rent
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-700/30">
                    {hostel.rooms.map((room, idx) => (
                      <motion.tr
                        key={room.id}
                        className="hover:bg-white/5 dark:hover:bg-slate-800/30 transition-colors"
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: idx * 0.05 }}
                        whileHover={{ scale: 1.01 }}
                      >
                        <td className="px-6 py-4 font-semibold text-slate-900 dark:text-white capitalize">
                          {room.room_type}
                        </td>
                        <td className="px-6 py-4 text-slate-600 dark:text-slate-400">
                          {room.occupants_per_room} {room.occupants_per_room === 1 ? "person" : "people"}
                        </td>
                        <td className="px-6 py-4">
                          <motion.span
                            className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-green-500/20 text-green-600 dark:text-green-400 text-sm font-semibold border border-green-500/30"
                            whileHover={{ scale: 1.05 }}
                          >
                            <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
                            {room.beds_available} beds
                          </motion.span>
                        </td>
                        <td className="px-6 py-4 text-sm text-slate-600 dark:text-slate-400">
                          {new Date(room.available_from).toLocaleDateString()} -{" "}
                          {new Date(room.available_to).toLocaleDateString()}
                        </td>
                        <td className="px-6 py-4 text-right font-bold text-gradient">
                          PKR {parseFloat(room.rent).toLocaleString()}
                        </td>
                      </motion.tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </motion.div>
          ) : (
            <motion.div
              className="glass-dark rounded-2xl p-12 text-center"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
            >
              <p className="text-slate-600 dark:text-slate-400">No rooms listed yet.</p>
            </motion.div>
          )}
        </motion.section>

        {/* Sidebar - Facilities & Rules */}
        <motion.div
          className="lg:col-span-1 space-y-6"
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          {/* Facilities */}
          <motion.div
            variants={itemVariants}
            className="glass-dark rounded-2xl p-8"
          >
            <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-6 flex items-center gap-2">
              <Wifi size={24} className="text-cyan-500" />
              Facilities
            </h3>

            {hostel.facilities.length > 0 ? (
              <motion.div
                className="space-y-3"
                variants={containerVariants}
                initial="hidden"
                animate="visible"
              >
                {hostel.facilities.map((facility, idx) => (
                  <motion.div
                    key={facility.id}
                    className="flex items-center gap-3 p-3 rounded-lg bg-white/5 dark:bg-slate-800/30 hover:bg-white/10 dark:hover:bg-slate-800/50 transition-all cursor-pointer"
                    variants={itemVariants}
                    whileHover={{ x: 4 }}
                  >
                    <div className="p-2 rounded-lg bg-gradient-to-r from-purple-500/20 to-blue-500/20">
                      {facilityIcons[facility.name?.toLowerCase()] || facilityIcons.default}
                    </div>
                    <span className="font-medium text-slate-900 dark:text-white">
                      {facility.name}
                    </span>
                  </motion.div>
                ))}
              </motion.div>
            ) : (
              <p className="text-slate-600 dark:text-slate-400 text-sm">No facilities listed.</p>
            )}
          </motion.div>

          {/* Rules */}
          <motion.div
            variants={itemVariants}
            className="glass-dark rounded-2xl p-8"
          >
            <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-6 flex items-center gap-2">
              📋 House Rules
            </h3>

            {hostel.rules.length > 0 ? (
              <motion.ul
                className="space-y-3"
                variants={containerVariants}
                initial="hidden"
                animate="visible"
              >
                {hostel.rules.map((rule, idx) => (
                  <motion.li
                    key={rule.id}
                    className="flex gap-3 text-slate-700 dark:text-slate-300 text-sm"
                    variants={itemVariants}
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: idx * 0.05 }}
                  >
                    <span className="text-purple-500 font-bold flex-shrink-0 mt-0.5">
                      ✓
                    </span>
                    <span>{rule.rule}</span>
                  </motion.li>
                ))}
              </motion.ul>
            ) : (
              <p className="text-slate-600 dark:text-slate-400 text-sm">No rules listed yet.</p>
            )}
          </motion.div>
        </motion.div>
      </div>

      {/* Contact Section */}
      <motion.section
        variants={itemVariants}
        className="mb-12 glass-dark rounded-2xl p-8 border border-slate-700/30"
      >
        <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-6">
          Contact Hostel
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Call Button */}
          <motion.a
            href={`tel:${hostel.phone}`}
            className="flex flex-col items-center p-6 rounded-xl bg-gradient-to-br from-green-500/10 to-emerald-500/10 border border-green-500/30 hover:border-green-500/60 transition-all cursor-pointer group"
            whileHover={{ scale: 1.05, boxShadow: "0 10px 30px rgba(16, 185, 129, 0.2)" }}
            whileTap={{ scale: 0.95 }}
          >
            <motion.div
              className="p-4 rounded-full bg-green-500/20 group-hover:bg-green-500/30 mb-4 transition-all"
              whileHover={{ rotate: 10 }}
            >
              <Phone size={24} className="text-green-400" />
            </motion.div>
            <h3 className="font-bold text-slate-900 dark:text-white mb-1">Call</h3>
            <p className="text-sm text-slate-600 dark:text-slate-400">{hostel.phone}</p>
            <p className="text-xs text-slate-500 mt-2 group-hover:text-slate-400 transition-colors">
              Tap to call
            </p>
          </motion.a>

          {/* Email Button */}
          <motion.a
            href={`mailto:${hostel.email}`}
            className="flex flex-col items-center p-6 rounded-xl bg-gradient-to-br from-blue-500/10 to-cyan-500/10 border border-blue-500/30 hover:border-blue-500/60 transition-all cursor-pointer group"
            whileHover={{ scale: 1.05, boxShadow: "0 10px 30px rgba(59, 130, 246, 0.2)" }}
            whileTap={{ scale: 0.95 }}
          >
            <motion.div
              className="p-4 rounded-full bg-blue-500/20 group-hover:bg-blue-500/30 mb-4 transition-all"
              whileHover={{ rotate: 10 }}
            >
              <Mail size={24} className="text-blue-400" />
            </motion.div>
            <h3 className="font-bold text-slate-900 dark:text-white mb-1">Email</h3>
            <p className="text-sm text-slate-600 dark:text-slate-400 truncate max-w-xs">{hostel.email}</p>
            <p className="text-xs text-slate-500 mt-2 group-hover:text-slate-400 transition-colors">
              Send an email
            </p>
          </motion.a>

          {/* WhatsApp Button */}
          <motion.a
            href={`https://wa.me/${hostel.phone?.replace(/\D/g, '')}?text=Hi, I'm interested in your hostel ${hostel.name}`}
            target="_blank"
            rel="noopener noreferrer"
            className="flex flex-col items-center p-6 rounded-xl bg-gradient-to-br from-emerald-500/10 to-teal-500/10 border border-emerald-500/30 hover:border-emerald-500/60 transition-all cursor-pointer group"
            whileHover={{ scale: 1.05, boxShadow: "0 10px 30px rgba(16, 185, 129, 0.2)" }}
            whileTap={{ scale: 0.95 }}
          >
            <motion.div
              className="p-4 rounded-full bg-emerald-500/20 group-hover:bg-emerald-500/30 mb-4 transition-all"
              whileHover={{ rotate: 10 }}
            >
              <MessageCircle size={24} className="text-emerald-400" />
            </motion.div>
            <h3 className="font-bold text-slate-900 dark:text-white mb-1">WhatsApp</h3>
            <p className="text-sm text-slate-600 dark:text-slate-400">Message on WhatsApp</p>
            <p className="text-xs text-slate-500 mt-2 group-hover:text-slate-400 transition-colors">
              Quick chat
            </p>
          </motion.a>
        </div>
      </motion.section>

      {/* Location Map */}
      <motion.section
        variants={itemVariants}
      >
        <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-6">
          Location
        </h2>
        <motion.div
          className="glass-dark rounded-2xl overflow-hidden h-96 border border-slate-700/30"
          whileHover={{ boxShadow: "0 20px 60px rgba(139, 92, 246, 0.15)" }}
        >
          <MapContainer
            center={[Number(hostel.lat), Number(hostel.lng)]}
            zoom={15}
            style={{ width: "100%", height: "100%" }}
            className="rounded-2xl"
          >
            <TileLayer
              attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
              url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            />
            <Marker position={[Number(hostel.lat), Number(hostel.lng)]}>
              <Popup>{hostel.name}</Popup>
            </Marker>
          </MapContainer>
        </motion.div>
        <p className="text-sm text-slate-500 dark:text-slate-400 mt-3">
          📍 Click the map to explore nearby amenities and attractions
        </p>
      </motion.section>

      {/* Chat Widget */}
      <ChatWidget 
        hostelId={hostel.id} 
        hostelName={hostel.name}
        hostelPhone={hostel.phone}
        hostelOwnerName="Hostel Owner"
      />
    </motion.div>
  );
}
