import { motion } from "framer-motion";
import { Mail, Phone, MapPin, MessageSquare, Heart, Share2 } from "lucide-react";
import { Link } from "react-router-dom";

const footerVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { type: "spring", stiffness: 100 }
  }
};

export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <motion.footer
      variants={footerVariants}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true }}
      className="glass-dark border-t border-slate-700/30 mt-20"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 md:py-20">
        {/* Main Footer Content */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-12">
          {/* Brand Section */}
          <motion.div variants={footerVariants}>
            <h3 className="text-2xl font-bold text-gradient mb-4">RoomFlow</h3>
            <p className="text-slate-400 text-sm leading-relaxed mb-6">
              Connecting travelers with verified hostels worldwide. Find your perfect stay and make lasting memories.
            </p>
            <div className="flex gap-4">
              <motion.a
                whileHover={{ scale: 1.2 }}
                href="#facebook"
                className="w-10 h-10 rounded-full bg-slate-700/50 hover:bg-purple-600 flex items-center justify-center transition-colors"
                aria-label="Facebook"
              >
                <Heart size={18} className="text-slate-300 hover:text-white" />
              </motion.a>
              <motion.a
                whileHover={{ scale: 1.2 }}
                href="#twitter"
                className="w-10 h-10 rounded-full bg-slate-700/50 hover:bg-blue-600 flex items-center justify-center transition-colors"
                aria-label="Twitter"
              >
                <Share2 size={18} className="text-slate-300 hover:text-white" />
              </motion.a>
              <motion.a
                whileHover={{ scale: 1.2 }}
                href="#instagram"
                className="w-10 h-10 rounded-full bg-slate-700/50 hover:bg-pink-600 flex items-center justify-center transition-colors"
                aria-label="Instagram"
              >
                <MessageSquare size={18} className="text-slate-300 hover:text-white" />
              </motion.a>
              <motion.a
                whileHover={{ scale: 1.2 }}
                href="#linkedin"
                className="w-10 h-10 rounded-full bg-slate-700/50 hover:bg-cyan-600 flex items-center justify-center transition-colors"
                aria-label="LinkedIn"
              >
                <Mail size={18} className="text-slate-300 hover:text-white" />
              </motion.a>
            </div>
          </motion.div>

          {/* Quick Links */}
          <motion.div variants={footerVariants}>
            <h4 className="text-lg font-semibold text-slate-50 mb-6">Quick Links</h4>
            <ul className="space-y-3">
              {[
                { label: "Find Hostels", href: "/" },
                { label: "How It Works", href: "#how-it-works" },
                { label: "For Owners", href: "/subscribe" },
                { label: "About Us", href: "#about" }
              ].map((link) => (
                <li key={link.href}>
                  <Link
                    to={link.href}
                    className="text-slate-400 hover:text-purple-400 transition-colors text-sm"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </motion.div>

          {/* Support */}
          <motion.div variants={footerVariants}>
            <h4 className="text-lg font-semibold text-slate-50 mb-6">Support</h4>
            <ul className="space-y-3">
              {[
                { label: "Help Center", href: "#help" },
                { label: "FAQs", href: "#faq" },
                { label: "Contact Us", href: "#contact" },
                { label: "Privacy Policy", href: "#privacy" },
                { label: "Terms & Conditions", href: "#terms" }
              ].map((link) => (
                <li key={link.href}>
                  <Link
                    to={link.href}
                    className="text-slate-400 hover:text-purple-400 transition-colors text-sm"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </motion.div>

          {/* Contact Info */}
          <motion.div variants={footerVariants}>
            <h4 className="text-lg font-semibold text-slate-50 mb-6">Contact Us</h4>
            <div className="space-y-4">
              <a
                href="mailto:support@stayscout.com"
                className="flex items-start gap-3 text-slate-400 hover:text-purple-400 transition-colors group"
              >
                <Mail size={18} className="flex-shrink-0 mt-1 group-hover:scale-110 transition-transform" />
                <span className="text-sm">support@stayscout.com</span>
              </a>
              <a
                href="tel:+923001234567"
                className="flex items-start gap-3 text-slate-400 hover:text-purple-400 transition-colors group"
              >
                <Phone size={18} className="flex-shrink-0 mt-1 group-hover:scale-110 transition-transform" />
                <span className="text-sm">+92 (300) 123-4567</span>
              </a>
              <div className="flex items-start gap-3 text-slate-400">
                <MapPin size={18} className="flex-shrink-0 mt-1" />
                <span className="text-sm">
                  Lahore, Pakistan
                  <br />
                  DHA Phase 6
                </span>
              </div>
            </div>
          </motion.div>
        </div>

        {/* Divider */}
        <div className="h-px bg-gradient-to-r from-transparent via-slate-700/50 to-transparent mb-8" />

        {/* Bottom Footer */}
        <motion.div
          variants={footerVariants}
          className="flex flex-col md:flex-row justify-between items-center gap-4"
        >
          <p className="text-slate-400 text-sm">
            © {currentYear} StayScout. All rights reserved.
          </p>
          <p className="text-slate-400 text-sm">
            Made with <span className="text-red-500">❤️</span> for travelers and hostel owners
          </p>
          <div className="flex gap-6">
            <Link to="#privacy" className="text-slate-400 hover:text-slate-200 text-sm transition-colors">
              Privacy
            </Link>
            <Link to="#terms" className="text-slate-400 hover:text-slate-200 text-sm transition-colors">
              Terms
            </Link>
            <Link to="#cookies" className="text-slate-400 hover:text-slate-200 text-sm transition-colors">
              Cookies
            </Link>
          </div>
        </motion.div>
      </div>
    </motion.footer>
  );
}
