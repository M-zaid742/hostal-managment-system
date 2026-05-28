import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { User, Mail, Lock, Briefcase, ArrowRight, Loader, UserCheck } from "lucide-react";
import { apiPost } from "../api/client.js";
import { setSession } from "../utils/auth.js";

export default function Register() {
  const [formState, setFormState] = useState({
    name: "",
    email: "",
    password: "",
    role: "user"
  });
  const [status, setStatus] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleChange = (event) => {
    setFormState((prev) => ({
      ...prev,
      [event.target.name]: event.target.value
    }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setStatus("");
    setLoading(true);

    try {
      const data = await apiPost("/auth/register", formState);
      setSession(data.token, data.user);
      setStatus("✓ Account created successfully");
      setTimeout(() => {
        navigate(data.user.role === "owner" ? "/subscribe" : "/");
      }, 500);
    } catch (error) {
      setStatus(error.message);
    } finally {
      setLoading(false);
    }
  };

  const containerVariants = {
    hidden: { opacity: 0, y: 40 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.6,
        ease: "easeOut",
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 10 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.4, ease: "easeOut" },
    },
  };

  const roleOptions = [
    {
      value: "user",
      label: "Resident",
      icon: <User size={20} />,
      description: "Find and book hostels"
    },
    {
      value: "owner",
      label: "Hostel Owner",
      icon: <Briefcase size={20} />,
      description: "Manage your property"
    }
  ];

  return (
    <motion.div
      className="min-h-screen flex items-center justify-center px-4 py-12 sm:px-6 lg:px-8"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      <div className="w-full max-w-md">
        {/* Animated Background Elements */}
        <motion.div
          className="absolute top-20 left-10 w-72 h-72 bg-cyan-500/20 rounded-full blur-3xl opacity-50"
          animate={{ y: [0, 50, 0], x: [0, 50, 0] }}
          transition={{ duration: 8, repeat: Infinity }}
        />
        <motion.div
          className="absolute bottom-10 right-10 w-72 h-72 bg-purple-500/20 rounded-full blur-3xl opacity-50"
          animate={{ y: [0, -50, 0], x: [0, -50, 0] }}
          transition={{ duration: 8, repeat: Infinity, delay: 1 }}
        />

        {/* Main Card */}
        <motion.div
          className="relative glass-dark rounded-3xl p-8 md:p-10 border border-slate-700/30 shadow-2xl"
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          {/* Header */}
          <motion.div
            className="mb-8 text-center"
            variants={itemVariants}
          >
            <motion.div
              className="inline-block mb-4 p-4 bg-gradient-to-r from-cyan-500/20 to-purple-500/20 rounded-2xl"
              whileHover={{ scale: 1.05 }}
            >
              <UserCheck size={32} className="text-cyan-400" />
            </motion.div>
            <h1 className="text-3xl md:text-4xl font-bold text-slate-900 dark:text-white mb-2">
              Get Started
            </h1>
            <p className="text-slate-600 dark:text-slate-400">
              Join our community of travelers and hosts
            </p>
          </motion.div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-5">
            {/* Name Field */}
            <motion.div variants={itemVariants}>
              <label className="block text-sm font-semibold text-slate-700 dark:text-slate-200 mb-2">
                Full Name
              </label>
              <motion.div
                className="relative"
                whileFocus={{ scale: 1.02 }}
              >
                <User className="absolute left-4 top-3.5 text-cyan-400" size={20} />
                <input
                  type="text"
                  name="name"
                  value={formState.name}
                  onChange={handleChange}
                  placeholder="John Doe"
                  required
                  className="input-modern pl-12"
                />
              </motion.div>
            </motion.div>

            {/* Email Field */}
            <motion.div variants={itemVariants}>
              <label className="block text-sm font-semibold text-slate-700 dark:text-slate-200 mb-2">
                Email Address
              </label>
              <motion.div
                className="relative"
                whileFocus={{ scale: 1.02 }}
              >
                <Mail className="absolute left-4 top-3.5 text-cyan-400" size={20} />
                <input
                  type="email"
                  name="email"
                  value={formState.email}
                  onChange={handleChange}
                  placeholder="you@example.com"
                  required
                  className="input-modern pl-12"
                />
              </motion.div>
            </motion.div>

            {/* Password Field */}
            <motion.div variants={itemVariants}>
              <label className="block text-sm font-semibold text-slate-700 dark:text-slate-200 mb-2">
                Password
              </label>
              <motion.div
                className="relative"
                whileFocus={{ scale: 1.02 }}
              >
                <Lock className="absolute left-4 top-3.5 text-cyan-400" size={20} />
                <input
                  type="password"
                  name="password"
                  value={formState.password}
                  onChange={handleChange}
                  placeholder="••••••••"
                  required
                  className="input-modern pl-12"
                />
              </motion.div>
            </motion.div>

            {/* Role Selection */}
            <motion.div variants={itemVariants}>
              <label className="block text-sm font-semibold text-slate-700 dark:text-slate-200 mb-3">
                Account Type
              </label>
              <div className="space-y-2">
                {roleOptions.map((option) => (
                  <motion.label
                    key={option.value}
                    className={`flex items-center p-4 rounded-lg cursor-pointer border-2 transition-all ${
                      formState.role === option.value
                        ? "glass-dark border-purple-500/50 bg-purple-500/10"
                        : "glass border-slate-700/30 hover:border-slate-600/50"
                    }`}
                    whileHover={{ scale: 1.02 }}
                  >
                    <input
                      type="radio"
                      name="role"
                      value={option.value}
                      checked={formState.role === option.value}
                      onChange={handleChange}
                      className="hidden"
                    />
                    <div className="p-2 rounded-lg bg-white/10 mr-3">
                      <motion.div
                        animate={formState.role === option.value ? { rotate: 360 } : { rotate: 0 }}
                        transition={{ duration: 0.5 }}
                        className="text-cyan-400"
                      >
                        {option.icon}
                      </motion.div>
                    </div>
                    <div className="flex-1">
                      <p className="font-semibold text-slate-900 dark:text-white">
                        {option.label}
                      </p>
                      <p className="text-xs text-slate-600 dark:text-slate-400">
                        {option.description}
                      </p>
                    </div>
                    {formState.role === option.value && (
                      <motion.div
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        className="w-5 h-5 rounded-full bg-gradient-to-r from-cyan-500 to-purple-500 flex items-center justify-center"
                      >
                        <span className="text-white text-xs">✓</span>
                      </motion.div>
                    )}
                  </motion.label>
                ))}
              </div>
            </motion.div>

            {/* Status Message */}
            {status && (
              <motion.div
                className={`p-4 rounded-lg border-l-4 ${
                  status.includes("success") || status.includes("successfully")
                    ? "glass bg-green-500/10 border-green-500 text-green-300"
                    : "glass bg-red-500/10 border-red-500 text-red-300"
                }`}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
              >
                {status}
              </motion.div>
            )}

            {/* Register Button */}
            <motion.button
              type="submit"
              disabled={loading}
              className="w-full btn-primary flex items-center justify-center gap-2 relative overflow-hidden"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              variants={itemVariants}
            >
              {loading ? (
                <>
                  <motion.div
                    animate={{ rotate: 360 }}
                    transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                  >
                    <Loader size={20} />
                  </motion.div>
                  Creating Account...
                </>
              ) : (
                <>
                  Create Account
                  <ArrowRight size={20} />
                </>
              )}
            </motion.button>
          </form>

          {/* Divider */}
          <motion.div
            className="relative my-6"
            variants={itemVariants}
          >
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-slate-700/30" />
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="px-3 bg-slate-800 dark:bg-slate-900 text-slate-500 dark:text-slate-400">
                or
              </span>
            </div>
          </motion.div>

          {/* Login Link */}
          <motion.p
            className="text-center text-sm text-slate-600 dark:text-slate-400"
            variants={itemVariants}
          >
            Already have an account?{" "}
            <Link
              to="/login"
              className="font-semibold text-cyan-600 dark:text-cyan-400 hover:text-cyan-700 dark:hover:text-cyan-300 transition-colors"
            >
              Sign in
            </Link>
          </motion.p>
        </motion.div>

        {/* Footer Link */}
        <motion.div
          className="text-center mt-8"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.6 }}
        >
          <Link
            to="/"
            className="text-sm text-slate-600 dark:text-slate-400 hover:text-cyan-600 dark:hover:text-cyan-400 transition-colors inline-flex items-center gap-2"
          >
            ← Back to Home
          </Link>
        </motion.div>
      </div>
    </motion.div>
  );
}
