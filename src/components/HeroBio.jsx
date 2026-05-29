import { motion } from "framer-motion";
import { Globe, Users, Award, Zap, TrendingUp, Shield } from "lucide-react";

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.15, delayChildren: 0.3 }
  }
};

const itemVariants = {
  hidden: { opacity: 0, y: 30 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { type: "spring", stiffness: 100, damping: 15 }
  }
};

const featureCardVariants = {
  hidden: { opacity: 0, scale: 0.85 },
  visible: {
    opacity: 1,
    scale: 1,
    transition: { type: "spring", stiffness: 120 }
  },
  hover: {
    y: -12,
    boxShadow: "0 20px 40px rgba(139, 92, 246, 0.2)",
    transition: { duration: 0.3 }
  }
};

export default function HeroBio() {
  const features = [
    { icon: Globe, title: "Global Network", desc: "1,200+ verified hostels across 180+ countries" },
    { icon: Shield, title: "Verified Reviews", desc: "Authentic feedback from real travelers" },
    { icon: Zap, title: "Instant Booking", desc: "Quick and seamless reservation process" },
    { icon: TrendingUp, title: "Best Prices", desc: "Competitive rates and exclusive deals" }
  ];

  const stats = [
    { value: "50K+", label: "Active Travelers" },
    { value: "1,200+", label: "Quality Hostels" },
    { value: "180+", label: "Countries" },
    { value: "4.8★", label: "Average Rating" }
  ];

  return (
    <motion.section
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: "-100px" }}
      variants={containerVariants}
      className="py-20 px-4 sm:px-6 lg:px-8 relative overflow-hidden"
    >
      {/* Background gradient */}
      <div className="absolute inset-0 bg-gradient-to-r from-indigo-500/5 via-purple-500/5 to-blue-500/5 blur-3xl -z-10" />
      
      <div className="max-w-7xl mx-auto">
        {/* Main heading */}
        <motion.div variants={itemVariants} className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold bg-gradient-to-r from-indigo-600 via-purple-600 to-blue-600 bg-clip-text text-transparent mb-6">
            Welcome to RoomFlow
          </h2>
          <p className="text-lg md:text-xl text-slate-600 dark:text-slate-300 max-w-2xl mx-auto leading-relaxed">
            Discover authentic hostel experiences across the globe. Connect with fellow travelers, 
            find the perfect accommodation, and create unforgettable memories.
          </p>
        </motion.div>

        {/* Features Grid */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-20"
        >
          {features.map((feature, idx) => {
            const Icon = feature.icon;
            return (
              <motion.div
                key={idx}
                variants={featureCardVariants}
                whileHover="hover"
                className="glass-dark rounded-2xl p-6 border border-slate-700/30 cursor-pointer group"
              >
                <div className="mb-4 inline-flex p-3 rounded-xl bg-gradient-to-br from-indigo-600/20 to-purple-600/20 group-hover:from-indigo-600/40 group-hover:to-purple-600/40 transition-colors">
                  <Icon className="w-6 h-6 text-indigo-600 dark:text-indigo-400" />
                </div>
                <h3 className="text-lg font-semibold text-slate-50 mb-2">{feature.title}</h3>
                <p className="text-slate-400 text-sm">{feature.desc}</p>
              </motion.div>
            );
          })}
        </motion.div>

        {/* Statistics */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-20"
        >
          {stats.map((stat, idx) => (
            <motion.div
              key={idx}
              variants={itemVariants}
              className="glass-dark rounded-xl p-6 border border-slate-700/30 text-center"
            >
              <div className="text-2xl md:text-3xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent mb-2">
                {stat.value}
              </div>
              <div className="text-sm text-slate-400">{stat.label}</div>
            </motion.div>
          ))}
        </motion.div>

        {/* CTA Buttons */}
        <motion.div
          variants={itemVariants}
          className="flex flex-col sm:flex-row gap-4 justify-center items-center"
        >
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="px-8 py-3 rounded-xl font-semibold bg-gradient-to-r from-indigo-600 to-purple-600 text-white shadow-lg hover:shadow-indigo-500/50 transition-all"
          >
            Explore Hostels
          </motion.button>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="px-8 py-3 rounded-xl font-semibold border border-slate-300 dark:border-slate-600 text-slate-900 dark:text-slate-50 hover:bg-slate-100 dark:hover:bg-slate-800 transition-all"
          >
            Learn More
          </motion.button>
        </motion.div>
      </div>
    </motion.section>
  );
}
