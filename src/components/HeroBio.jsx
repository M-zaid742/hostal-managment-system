import { motion } from "framer-motion";
import { Users, Globe, Award, Zap } from "lucide-react";

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.2,
      delayChildren: 0.3,
    },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.6, ease: "easeOut" },
  },
};

const floatingVariants = {
  float: {
    y: [0, -10, 0],
    transition: {
      duration: 3,
      repeat: Infinity,
      ease: "easeInOut",
    },
  },
};

export default function HeroBio() {
  const features = [
    {
      icon: <Globe size={24} />,
      title: "Global Network",
      description: "Connect with travelers and hostels worldwide",
    },
    {
      icon: <Users size={24} />,
      title: "Community First",
      description: "Join a vibrant community of adventurers",
    },
    {
      icon: <Award size={24} />,
      title: "Verified Reviews",
      description: "Trust real guest experiences and ratings",
    },
    {
      icon: <Zap size={24} />,
      title: "Instant Booking",
      description: "Reserve your perfect room instantly",
    },
  ];

  return (
    <motion.section
      className="py-16 md:py-24 px-4 sm:px-6 lg:px-8 overflow-hidden"
      initial={{ opacity: 0 }}
      whileInView={{ opacity: 1 }}
      viewport={{ once: true }}
      transition={{ duration: 0.6 }}
    >
      {/* Animated Background Elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <motion.div
          className="absolute -top-40 -left-40 w-80 h-80 bg-purple-500/20 rounded-full blur-3xl"
          animate={{ x: [0, 50, 0], y: [0, 30, 0] }}
          transition={{ duration: 8, repeat: Infinity }}
        />
        <motion.div
          className="absolute -bottom-40 -right-40 w-80 h-80 bg-blue-500/20 rounded-full blur-3xl"
          animate={{ x: [0, -50, 0], y: [0, -30, 0] }}
          transition={{ duration: 8, repeat: Infinity, delay: 1 }}
        />
      </div>

      <div className="max-w-7xl mx-auto relative z-10">
        {/* Header Section */}
        <motion.div
          className="text-center mb-16 md:mb-20"
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
        >
          <motion.h2
            className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6"
            variants={itemVariants}
          >
            <span className="bg-gradient-to-r from-purple-600 via-blue-500 to-cyan-500 bg-clip-text text-transparent">
              Welcome to RoomFlow
            </span>
          </motion.h2>

          <motion.p
            className="text-lg md:text-xl text-slate-600 dark:text-slate-300 max-w-3xl mx-auto leading-relaxed"
            variants={itemVariants}
          >
            Your ultimate destination for finding the perfect hostel experience. 
            Discover unique accommodations, connect with fellow travelers, and create 
            unforgettable memories around the world.
          </motion.p>

          {/* Floating Icons */}
          <motion.div
            className="mt-12 flex justify-center gap-8 flex-wrap"
            variants={itemVariants}
          >
            {[
              { emoji: "🌍", label: "Global" },
              { emoji: "✈️", label: "Travel" },
              { emoji: "🤝", label: "Community" },
              { emoji: "⭐", label: "Quality" },
            ].map((item, idx) => (
              <motion.div
                key={idx}
                className="text-4xl md:text-5xl"
                variants={floatingVariants}
                animate="float"
                transition={{ delay: idx * 0.1 }}
              >
                {item.emoji}
              </motion.div>
            ))}
          </motion.div>
        </motion.div>

        {/* Features Grid */}
        <motion.div
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 md:gap-8"
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
        >
          {features.map((feature, idx) => (
            <motion.div
              key={idx}
              className="group glass-dark rounded-2xl p-6 md:p-8 border border-slate-700/30 hover:border-purple-500/50 transition-all duration-300"
              variants={itemVariants}
              whileHover={{
                y: -8,
                boxShadow: "0 20px 40px rgba(139, 92, 246, 0.2)",
              }}
            >
              {/* Icon */}
              <motion.div
                className="inline-block p-3 rounded-xl bg-gradient-to-r from-purple-500/20 to-blue-500/20 group-hover:from-purple-500/30 group-hover:to-blue-500/30 transition-colors mb-4"
                whileHover={{ rotate: 360, scale: 1.1 }}
                transition={{ duration: 0.6 }}
              >
                <div className="text-purple-400 group-hover:text-purple-300 transition-colors">
                  {feature.icon}
                </div>
              </motion.div>

              {/* Content */}
              <h3 className="text-lg md:text-xl font-bold text-slate-900 dark:text-white mb-2 group-hover:text-purple-400 transition-colors">
                {feature.title}
              </h3>
              <p className="text-sm md:text-base text-slate-600 dark:text-slate-400 leading-relaxed">
                {feature.description}
              </p>

              {/* Hover Effect Line */}
              <motion.div
                className="mt-4 h-1 bg-gradient-to-r from-purple-500 to-blue-500 rounded-full"
                initial={{ scaleX: 0 }}
                whileHover={{ scaleX: 1 }}
                transition={{ duration: 0.3 }}
              />
            </motion.div>
          ))}
        </motion.div>

        {/* CTA Section */}
        <motion.div
          className="mt-16 md:mt-20 text-center"
          variants={itemVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
        >
          <p className="text-slate-600 dark:text-slate-400 text-lg mb-8">
            Ready to find your perfect stay?
          </p>

          <motion.div
            className="flex flex-col sm:flex-row gap-4 justify-center"
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
          >
            <motion.button
              className="px-8 py-3 rounded-xl bg-gradient-to-r from-purple-600 to-blue-600 text-white font-semibold hover:shadow-lg transition-shadow"
              variants={itemVariants}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              Explore Hostels
            </motion.button>

            <motion.button
              className="px-8 py-3 rounded-xl border border-purple-500/50 text-purple-400 font-semibold hover:bg-purple-500/10 transition-colors"
              variants={itemVariants}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              List Your Hostel
            </motion.button>
          </motion.div>
        </motion.div>

        {/* Stats Section */}
        <motion.div
          className="mt-16 md:mt-20 grid grid-cols-2 md:grid-cols-4 gap-6 md:gap-8"
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
        >
          {[
            { number: "50K+", label: "Happy Travelers" },
            { number: "1200+", label: "Verified Hostels" },
            { number: "180+", label: "Countries" },
            { number: "4.8★", label: "Average Rating" },
          ].map((stat, idx) => (
            <motion.div
              key={idx}
              className="text-center"
              variants={itemVariants}
            >
              <motion.p
                className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent mb-2"
                initial={{ scale: 0 }}
                whileInView={{ scale: 1 }}
                viewport={{ once: true }}
                transition={{ type: "spring", stiffness: 100, delay: idx * 0.1 }}
              >
                {stat.number}
              </motion.p>
              <p className="text-slate-600 dark:text-slate-400 text-sm md:text-base">
                {stat.label}
              </p>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </motion.section>
  );
}
