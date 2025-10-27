import { motion } from 'framer-motion';
import { BookOpen, Mail, Shield } from 'lucide-react';

const Footer = () => {
  return (
    <footer className="bg-gray-900 text-gray-300 py-16 px-6">
      <div className="max-w-6xl mx-auto">
        <div className="grid md:grid-cols-2 gap-12 mb-12">
          {/* Brand section */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
          >
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-500 rounded-xl flex items-center justify-center">
                <BookOpen className="text-white" size={24} />
              </div>
              <span className="text-2xl font-bold text-white">ExamForge</span>
            </div>
            <p className="text-gray-400 leading-relaxed max-w-md">
              Empowering Nepali students with smart tools for exam preparation. Built for learners like you.
            </p>
          </motion.div>

          {/* Links section */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            viewport={{ once: true }}
            className="grid grid-cols-2 gap-8"
          >
            <div>
              <h4 className="text-white font-semibold mb-4">Product</h4>
              <ul className="space-y-2">
                <li>
                  <a href="#" className="hover:text-blue-400 transition-colors">
                    Features
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-blue-400 transition-colors">
                    How it Works
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-blue-400 transition-colors">
                    Pricing
                  </a>
                </li>
              </ul>
            </div>

            <div>
              <h4 className="text-white font-semibold mb-4">Company</h4>
              <ul className="space-y-2">
                <li>
                  <a href="#" className="hover:text-blue-400 transition-colors flex items-center gap-2">
                    <Mail size={16} />
                    About
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-blue-400 transition-colors flex items-center gap-2">
                    <Mail size={16} />
                    Contact
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-blue-400 transition-colors flex items-center gap-2">
                    <Shield size={16} />
                    Privacy
                  </a>
                </li>
              </ul>
            </div>
          </motion.div>
        </div>

        {/* Divider */}
        <div className="border-t border-gray-800 pt-8">
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            viewport={{ once: true }}
            className="flex flex-col md:flex-row justify-between items-center gap-4 text-sm text-gray-500"
          >
            <p>© 2025 ExamForge. Built for Nepali students by learners like you.</p>

            <div className="flex gap-6">
              <a href="#" className="hover:text-blue-400 transition-colors">
                Terms
              </a>
              <a href="#" className="hover:text-blue-400 transition-colors">
                Privacy
              </a>
              <a href="#" className="hover:text-blue-400 transition-colors">
                Cookies
              </a>
            </div>
          </motion.div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
