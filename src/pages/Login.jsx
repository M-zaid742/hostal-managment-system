import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { Mail, Lock, ArrowRight, Loader } from "lucide-react";
import { apiPost } from "../api/client.js";
import { GoogleLogin, GoogleOAuthProvider } from "@react-oauth/google";
import { setSession } from "../utils/auth.js";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [status, setStatus] = useState("");
  const [loading, setLoading] = useState(false);
  const googleClientId = import.meta.env.VITE_GOOGLE_CLIENT_ID || "";
  const navigate = useNavigate();

  const handleSubmit = async (event) => {
    event.preventDefault();
    setStatus("");
    setLoading(true);

    try {
      const data = await apiPost("/auth/login", { email, password });
      setSession(data.token, data.user);
      setStatus("Logged in successfully.");
      setTimeout(() => {
        if (data.user.role === "owner") {
          navigate("/owner/dashboard");
        } else if (data.user.role === "admin") {
          navigate("/admin/dashboard");
        } else {
          navigate("/");
        }
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
          className="absolute top-20 left-10 w-72 h-72 bg-purple-500/20 rounded-full blur-3xl opacity-50"
          animate={{ y: [0, 50, 0], x: [0, 50, 0] }}
          transition={{ duration: 8, repeat: Infinity }}
        />
        <motion.div
          className="absolute bottom-10 right-10 w-72 h-72 bg-blue-500/20 rounded-full blur-3xl opacity-50"
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
              className="inline-block mb-4 p-4 bg-gradient-to-r from-purple-500/20 to-blue-500/20 rounded-2xl"
              whileHover={{ scale: 1.05 }}
            >
              <Lock size={32} className="text-purple-400" />
            </motion.div>
            <h1 className="text-3xl md:text-4xl font-bold text-slate-900 dark:text-white mb-2">
              Welcome Back
            </h1>
            <p className="text-slate-600 dark:text-slate-400">
              Sign in to access your account
            </p>
          </motion.div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-5">
            {/* Email Field */}
            <motion.div variants={itemVariants}>
              <label className="block text-sm font-semibold text-slate-700 dark:text-slate-200 mb-2">
                Email Address
              </label>
              <motion.div
                className="relative"
                whileFocus={{ scale: 1.02 }}
              >
                <Mail className="absolute left-4 top-3.5 text-purple-400" size={20} />
                <input
                  type="email"
                  value={email}
                  onChange={(event) => setEmail(event.target.value)}
                  placeholder="you@example.com"
                  required
                  className="input-modern pl-12"
                />
              </motion.div>
            </motion.div>

            {/* Password Field */}
            <motion.div variants={itemVariants}>
              <div className="flex justify-between items-center mb-2">
                <label className="block text-sm font-semibold text-slate-700 dark:text-slate-200">
                  Password
                </label>
                <Link
                  to="#"
                  className="text-sm text-purple-600 dark:text-purple-400 hover:text-purple-700 dark:hover:text-purple-300 transition-colors"
                >
                  Forgot?
                </Link>
              </div>
              <motion.div
                className="relative"
                whileFocus={{ scale: 1.02 }}
              >
                <Lock className="absolute left-4 top-3.5 text-purple-400" size={20} />
                <input
                  type="password"
                  value={password}
                  onChange={(event) => setPassword(event.target.value)}
                  placeholder="••••••••"
                  required
                  className="input-modern pl-12"
                />
              </motion.div>
            </motion.div>

            {/* Status Message */}
            {status && (
              <motion.div
                className={`p-4 rounded-lg border-l-4 ${
                  status.includes("success") || status.includes("Successfully")
                    ? "glass bg-green-500/10 border-green-500 text-green-300"
                    : "glass bg-red-500/10 border-red-500 text-red-300"
                }`}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
              >
                {status}
              </motion.div>
            )}

            {/* Login Button */}
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
                  Signing In...
                </>
              ) : (
                <>
                  Sign In
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
                or continue with
              </span>
            </div>
          </motion.div>

          {/* Google Login */}
          {googleClientId ? (
            <motion.div
              className="w-full overflow-hidden rounded-lg"
              variants={itemVariants}
            >
              <GoogleOAuthProvider clientId={googleClientId}>
                <div className="flex justify-center">
                  <GoogleLogin
                    onSuccess={async (credentialResponse) => {
                      setLoading(true);
                      try {
                        const data = await apiPost("/auth/google", {
                          credential: credentialResponse.credential
                        });
                        setSession(data.token, data.user);
                        setStatus("✓ Logged in with Google");
                        setTimeout(() => {
                          navigate("/");
                        }, 500);
                      } catch (error) {
                        setStatus(error.message);
                      } finally {
                        setLoading(false);
                      }
                    }}
                    onError={() => {
                      setStatus("Google login failed. Please try again.");
                    }}
                  />
                </div>
              </GoogleOAuthProvider>
            </motion.div>
          ) : (
            <motion.div
              className="glass rounded-lg p-4 text-center text-sm text-slate-500 dark:text-slate-400"
              variants={itemVariants}
            >
              Add VITE_GOOGLE_CLIENT_ID to enable Google login.
            </motion.div>
          )}

          {/* Signup Link */}
          <motion.p
            className="text-center text-sm text-slate-600 dark:text-slate-400 mt-8"
            variants={itemVariants}
          >
            Don't have an account?{" "}
            <Link
              to="/register"
              className="font-semibold text-purple-600 dark:text-purple-400 hover:text-purple-700 dark:hover:text-purple-300 transition-colors"
            >
              Create one
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
            className="text-sm text-slate-600 dark:text-slate-400 hover:text-purple-600 dark:hover:text-purple-400 transition-colors inline-flex items-center gap-2"
          >
            ← Back to Home
          </Link>
        </motion.div>
      </div>
    </motion.div>
  );
}
