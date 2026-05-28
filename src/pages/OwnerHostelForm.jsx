import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { apiGet, apiPost, apiPut } from "../api/client.js";
import { motion } from "framer-motion";
import { Building2, MapPin, Phone, Mail, Users, AlertCircle, ArrowLeft, Loader } from "lucide-react";

const initialState = {
  name: "",
  city: "",
  area: "",
  address: "",
  gender: "co-ed",
  description: "",
  phone: "",
  email: "",
  lat: "31.5204",
  lng: "74.3587",
  facilitiesText: "WiFi, Mess"
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

export default function OwnerHostelForm() {
  const { hostelId } = useParams();
  const navigate = useNavigate();
  const [formState, setFormState] = useState(initialState);
  const [status, setStatus] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const isEdit = Boolean(hostelId);

  useEffect(() => {
    if (!isEdit) {
      setIsLoading(false);
      return;
    }

    setIsLoading(true);
    apiGet(`/hostels/${hostelId}`)
      .then((data) => {
        setFormState({
          name: data.name || "",
          city: data.city || "",
          area: data.area || "",
          address: data.address || "",
          gender: data.gender || "co-ed",
          description: data.description || "",
          phone: data.phone || "",
          email: data.email || "",
          lat: String(data.lat || "31.5204"),
          lng: String(data.lng || "74.3587"),
          facilitiesText: (data.facilities || []).map((item) => item.name).join(", ")
        });
        setIsLoading(false);
      })
      .catch((error) => {
        setStatus(error.message);
        setIsLoading(false);
      });
  }, [hostelId, isEdit]);

  const handleChange = (event) => {
    const { name, value } = event.target;
    setFormState((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setStatus("");
    setIsSubmitting(true);

    const payload = {
      ...formState,
      facilities: formState.facilitiesText
        .split(",")
        .map((item) => item.trim())
        .filter(Boolean)
    };

    try {
      if (isEdit) {
        await apiPut(`/hostels/${hostelId}`, payload);
      } else {
        await apiPost("/hostels", payload);
      }
      navigate("/owner/dashboard");
    } catch (error) {
      setStatus(error.message);
      setIsSubmitting(false);
    }
  };

  if (isLoading) {
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
          <p className="text-center text-slate-300 mt-4">Loading hostel data...</p>
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
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <motion.div variants={itemVariants} className="mb-8">
          <button
            onClick={() => navigate("/owner/dashboard")}
            className="inline-flex items-center gap-2 text-purple-400 hover:text-purple-300 mb-4"
          >
            <ArrowLeft size={20} />
            Back to Dashboard
          </button>
          <h1 className="text-4xl md:text-5xl font-bold text-gradient mb-2">
            {isEdit ? "Edit Hostel" : "Add Hostel"}
          </h1>
          <p className="text-slate-400">
            {isEdit ? "Update your hostel information" : "Create your first hostel listing"}
          </p>
        </motion.div>

        {/* Error Alert */}
        {status && (
          <motion.div
            variants={itemVariants}
            className="glass-dark rounded-2xl p-6 border-l-4 border-red-500 mb-8"
          >
            <div className="flex items-start gap-4">
              <AlertCircle size={24} className="text-red-400 flex-shrink-0 mt-1" />
              <div>
                <h3 className="text-lg font-bold text-red-300 mb-1">Error</h3>
                <p className="text-slate-300">{status}</p>
              </div>
            </div>
          </motion.div>
        )}

        {/* Form Card */}
        <motion.div
          variants={itemVariants}
          className="glass-dark rounded-3xl p-8 md:p-12 border-t border-purple-500/30"
        >
          <form onSubmit={handleSubmit} className="space-y-8">
            {/* Basic Information */}
            <motion.div
              variants={containerVariants}
              initial="hidden"
              animate="visible"
              className="space-y-6"
            >
              <div>
                <label className="block text-sm font-semibold text-slate-300 mb-2">
                  <div className="flex items-center gap-2 mb-2">
                    <Building2 size={18} className="text-purple-400" />
                    Hostel Name *
                  </div>
                </label>
                <input
                  type="text"
                  name="name"
                  value={formState.name}
                  onChange={handleChange}
                  required
                  placeholder="Enter hostel name"
                  className="input-modern"
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div>
                  <label className="block text-sm font-semibold text-slate-300 mb-2">
                    City *
                  </label>
                  <input
                    type="text"
                    name="city"
                    value={formState.city}
                    onChange={handleChange}
                    required
                    placeholder="e.g., Lahore"
                    className="input-modern"
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-slate-300 mb-2">
                    Area *
                  </label>
                  <input
                    type="text"
                    name="area"
                    value={formState.area}
                    onChange={handleChange}
                    required
                    placeholder="e.g., DHA"
                    className="input-modern"
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-slate-300 mb-2">
                    <div className="flex items-center gap-2">
                      <Users size={16} className="text-purple-400" />
                      Gender
                    </div>
                  </label>
                  <select
                    name="gender"
                    value={formState.gender}
                    onChange={handleChange}
                    className="input-modern"
                  >
                    <option value="co-ed">Co-ed</option>
                    <option value="boys">Boys</option>
                    <option value="girls">Girls</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-sm font-semibold text-slate-300 mb-2">
                  <div className="flex items-center gap-2">
                    <MapPin size={18} className="text-purple-400" />
                    Address *
                  </div>
                </label>
                <input
                  type="text"
                  name="address"
                  value={formState.address}
                  onChange={handleChange}
                  required
                  placeholder="Full address"
                  className="input-modern"
                />
              </div>
            </motion.div>

            {/* Location */}
            <motion.div variants={containerVariants} className="space-y-6 pt-6 border-t border-slate-700/30">
              <h3 className="text-lg font-bold text-slate-50">Location Coordinates</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-semibold text-slate-300 mb-2">
                    Latitude *
                  </label>
                  <input
                    type="number"
                    step="0.00001"
                    name="lat"
                    value={formState.lat}
                    onChange={handleChange}
                    required
                    placeholder="31.5204"
                    className="input-modern"
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-slate-300 mb-2">
                    Longitude *
                  </label>
                  <input
                    type="number"
                    step="0.00001"
                    name="lng"
                    value={formState.lng}
                    onChange={handleChange}
                    required
                    placeholder="74.3587"
                    className="input-modern"
                  />
                </div>
              </div>
            </motion.div>

            {/* Contact Information */}
            <motion.div variants={containerVariants} className="space-y-6 pt-6 border-t border-slate-700/30">
              <h3 className="text-lg font-bold text-slate-50">Contact Information</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-semibold text-slate-300 mb-2">
                    <div className="flex items-center gap-2">
                      <Phone size={16} className="text-purple-400" />
                      Phone
                    </div>
                  </label>
                  <input
                    type="tel"
                    name="phone"
                    value={formState.phone}
                    onChange={handleChange}
                    placeholder="+92 XXX XXXXXXX"
                    className="input-modern"
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-slate-300 mb-2">
                    <div className="flex items-center gap-2">
                      <Mail size={16} className="text-purple-400" />
                      Email
                    </div>
                  </label>
                  <input
                    type="email"
                    name="email"
                    value={formState.email}
                    onChange={handleChange}
                    placeholder="contact@hostel.com"
                    className="input-modern"
                  />
                </div>
              </div>
            </motion.div>

            {/* Facilities & Description */}
            <motion.div variants={containerVariants} className="space-y-6 pt-6 border-t border-slate-700/30">
              <div>
                <label className="block text-sm font-semibold text-slate-300 mb-2">
                  Facilities (comma separated)
                </label>
                <input
                  type="text"
                  name="facilitiesText"
                  value={formState.facilitiesText}
                  onChange={handleChange}
                  placeholder="WiFi, Mess, Parking, Kitchen"
                  className="input-modern"
                />
                <p className="text-xs text-slate-400 mt-2">
                  Separate facilities with commas
                </p>
              </div>

              <div>
                <label className="block text-sm font-semibold text-slate-300 mb-2">
                  Description
                </label>
                <textarea
                  name="description"
                  value={formState.description}
                  onChange={handleChange}
                  rows={5}
                  placeholder="Tell guests about your hostel..."
                  className="w-full px-4 py-3 rounded-lg bg-white dark:bg-slate-800 border-2 border-slate-200 dark:border-slate-700 text-slate-900 dark:text-slate-50 placeholder-slate-500 dark:placeholder-slate-400 focus:outline-none focus:border-purple-500 focus:ring-2 focus:ring-purple-500/30 transition-all duration-200 resize-none"
                />
              </div>
            </motion.div>

            {/* Submit Button */}
            <motion.div variants={itemVariants} className="flex gap-4 pt-6 border-t border-slate-700/30">
              <button
                type="button"
                onClick={() => navigate("/owner/dashboard")}
                className="flex-1 px-6 py-3 rounded-lg border-2 border-slate-600 text-slate-300 font-semibold hover:border-slate-500 hover:bg-slate-700/30 transition-all"
              >
                Cancel
              </button>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                disabled={isSubmitting}
                type="submit"
                className="flex-1 inline-flex items-center justify-center px-6 py-3 rounded-lg bg-gradient-to-r from-purple-600 to-blue-600 text-white font-semibold hover:shadow-lg hover:shadow-purple-500/50 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isSubmitting ? (
                  <>
                    <motion.div
                      animate={{ rotate: 360 }}
                      transition={{ repeat: Infinity, duration: 1 }}
                      className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full mr-2"
                    />
                    {isEdit ? "Updating..." : "Creating..."}
                  </>
                ) : (
                  isEdit ? "Update Hostel" : "Create Hostel"
                )}
              </motion.button>
            </motion.div>
          </form>
        </motion.div>
      </div>
    </motion.section>
  );
}
