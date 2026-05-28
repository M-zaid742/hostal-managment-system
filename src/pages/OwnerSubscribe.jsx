import { useEffect, useState } from "react";
import { apiGet, apiPost } from "../api/client.js";
import { getUser } from "../utils/auth.js";
import { motion } from "framer-motion";
import { CreditCard, Check, AlertCircle, ArrowRight, Zap } from "lucide-react";

const plans = [
  {
    id: "starter",
    label: "Starter",
    price: 3500,
    description: "Perfect for getting started",
    features: ["Basic listing", "1 hostel", "Email support"],
    color: "from-blue-600 to-cyan-600"
  },
  {
    id: "pro",
    label: "Pro",
    price: 6500,
    description: "Most popular choice",
    features: ["Priority listing", "3 hostels", "WhatsApp support"],
    color: "from-purple-600 to-blue-600",
    popular: true
  },
  {
    id: "elite",
    label: "Elite",
    price: 9800,
    description: "For serious hosts",
    features: ["Featured listing", "Unlimited hostels", "Dedicated manager"],
    color: "from-orange-600 to-pink-600"
  }
];

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
  hover: { scale: 1.05, transition: { duration: 0.2 } }
};

export default function OwnerSubscribe() {
  const [selectedPlan, setSelectedPlan] = useState(plans[1]);
  const [paymentMethod, setPaymentMethod] = useState("jazzcash");
  const [transactionRef, setTransactionRef] = useState("");
  const [status, setStatus] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const token = localStorage.getItem("auth_token");
  const user = getUser();

  useEffect(() => {
    if (!token || user?.role !== "owner") {
      return;
    }

    apiGet("/subscriptions/me")
      .then((data) => {
        if (data.hasActive) {
          setStatus("success:Your subscription is already active.");
        }
      })
      .catch(() => {});
  }, [token, user?.role]);

  if (!token || user?.role !== "owner") {
    return (
      <div className="min-h-screen flex items-center justify-center px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="glass-dark rounded-2xl p-8 max-w-md w-full border-l-4 border-yellow-500"
        >
          <h2 className="text-2xl font-bold text-yellow-400 mb-2">Login Required</h2>
          <p className="text-slate-300 mb-4">
            Please login as a hostel owner to view subscription plans.
          </p>
        </motion.div>
      </div>
    );
  }

  const handleSubmit = async () => {
    setStatus("");
    setIsSubmitting(true);

    try {
      const response = await apiPost("/payments/owner-subscription", {
        planId: selectedPlan.id,
        paymentMethod,
        transactionRef
      });
      setStatus(`success:${response.message || "Subscription submitted for review!"}`);
      setTransactionRef("");
    } catch (error) {
      setStatus(`error:${error.message}`);
    }
    setIsSubmitting(false);
  };

  const isSuccess = status.startsWith("success:");
  const isError = status.startsWith("error:");
  const statusMessage = status.replace(/^(success|error):/, "");

  return (
    <motion.section
      initial="hidden"
      animate="visible"
      variants={containerVariants}
      className="min-h-screen py-8 md:py-12"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <motion.div variants={itemVariants} className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-bold text-gradient mb-4">
            List Your Hostel
          </h1>
          <p className="text-slate-400 text-lg">
            Choose a subscription plan and get verified by our admin team
          </p>
        </motion.div>

        {/* Status Messages */}
        {isSuccess && (
          <motion.div
            variants={itemVariants}
            className="glass-dark rounded-2xl p-6 border-l-4 border-green-500 mb-8"
          >
            <div className="flex items-start gap-4">
              <Check size={24} className="text-green-400 flex-shrink-0 mt-1" />
              <div>
                <h3 className="text-lg font-bold text-green-300 mb-1">Success!</h3>
                <p className="text-slate-300">{statusMessage}</p>
              </div>
            </div>
          </motion.div>
        )}

        {isError && (
          <motion.div
            variants={itemVariants}
            className="glass-dark rounded-2xl p-6 border-l-4 border-red-500 mb-8"
          >
            <div className="flex items-start gap-4">
              <AlertCircle size={24} className="text-red-400 flex-shrink-0 mt-1" />
              <div>
                <h3 className="text-lg font-bold text-red-300 mb-1">Error</h3>
                <p className="text-slate-300">{statusMessage}</p>
              </div>
            </div>
          </motion.div>
        )}

        {/* Pricing Cards */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12"
        >
          {plans.map((plan) => (
            <motion.button
              key={plan.id}
              variants={cardVariants}
              whileHover="hover"
              onClick={() => setSelectedPlan(plan)}
              className="text-left focus:outline-none relative"
            >
              {plan.popular && (
                <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                  <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-sm font-bold bg-gradient-to-r from-orange-500 to-pink-500 text-white">
                    <Zap size={16} />
                    Most Popular
                  </span>
                </div>
              )}

              <div
                className={`glass-dark rounded-2xl p-8 h-full border-2 transition-all ${
                  selectedPlan.id === plan.id
                    ? "border-purple-500 ring-2 ring-purple-500/50"
                    : "border-slate-700/30"
                }`}
              >
                <div className={`w-12 h-12 rounded-lg bg-gradient-to-br ${plan.color} flex items-center justify-center mb-6`}>
                  <CreditCard size={24} className="text-white" />
                </div>

                <h3 className="text-2xl font-bold text-slate-50 mb-2">
                  {plan.label}
                </h3>
                <p className="text-slate-400 text-sm mb-6">
                  {plan.description}
                </p>

                <div className="mb-8">
                  <div className="text-4xl font-bold text-slate-50 mb-1">
                    PKR {plan.price.toLocaleString()}
                  </div>
                  <p className="text-slate-400 text-sm">per year</p>
                </div>

                <ul className="space-y-3 mb-8">
                  {plan.features.map((feature) => (
                    <li key={feature} className="flex items-center gap-3 text-slate-300">
                      <Check size={18} className="text-green-400 flex-shrink-0" />
                      <span>{feature}</span>
                    </li>
                  ))}
                </ul>

                <motion.div
                  whileHover={{ x: 4 }}
                  className="flex items-center gap-2 text-purple-400 font-semibold"
                >
                  Select Plan
                  <ArrowRight size={18} />
                </motion.div>
              </div>
            </motion.button>
          ))}
        </motion.div>

        {/* Payment Form */}
        <motion.div
          variants={itemVariants}
          className="glass-dark rounded-3xl p-8 md:p-12 border-t border-purple-500/30 max-w-2xl mx-auto"
        >
          <h2 className="text-2xl font-bold text-slate-50 mb-8">
            Complete Your Payment
          </h2>

          <div className="space-y-6">
            {/* Selected Plan Summary */}
            <div className="bg-slate-700/30 rounded-lg p-6 border border-slate-600/50">
              <div className="flex justify-between items-center">
                <div>
                  <p className="text-slate-400 text-sm">Selected Plan</p>
                  <p className="text-2xl font-bold text-slate-50">
                    {selectedPlan.label}
                  </p>
                </div>
                <div className="text-right">
                  <p className="text-slate-400 text-sm">Amount</p>
                  <p className="text-2xl font-bold text-purple-400">
                    PKR {selectedPlan.price.toLocaleString()}
                  </p>
                </div>
              </div>
            </div>

            {/* Payment Method */}
            <div>
              <label className="block text-sm font-semibold text-slate-300 mb-3">
                Payment Method
              </label>
              <select
                value={paymentMethod}
                onChange={(e) => setPaymentMethod(e.target.value)}
                className="input-modern"
              >
                <option value="jazzcash">JazzCash</option>
                <option value="easypaisa">EasyPaisa</option>
              </select>
              <p className="text-xs text-slate-400 mt-2">
                Send {selectedPlan.price} to the {paymentMethod.toUpperCase()} number provided and enter the transaction reference below.
              </p>
            </div>

            {/* Transaction Reference */}
            <div>
              <label className="block text-sm font-semibold text-slate-300 mb-3">
                Transaction Reference *
              </label>
              <input
                type="text"
                placeholder="e.g. JC-9021 or EP-5432"
                value={transactionRef}
                onChange={(e) => setTransactionRef(e.target.value)}
                className="input-modern"
              />
            </div>

            {/* Submit Button */}
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={handleSubmit}
              disabled={!transactionRef || isSubmitting}
              className="w-full inline-flex items-center justify-center px-6 py-4 rounded-lg bg-gradient-to-r from-purple-600 to-blue-600 text-white font-bold text-lg hover:shadow-lg hover:shadow-purple-500/50 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isSubmitting ? (
                <>
                  <motion.div
                    animate={{ rotate: 360 }}
                    transition={{ repeat: Infinity, duration: 1 }}
                    className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full mr-3"
                  />
                  Submitting...
                </>
              ) : (
                <>
                  <CreditCard size={20} className="mr-2" />
                  Submit Subscription
                </>
              )}
            </motion.button>
          </div>

          <p className="text-xs text-slate-400 text-center mt-6">
            Your subscription will be verified by our admin team within 24 hours
          </p>
        </motion.div>
      </div>
    </motion.section>
  );
}
