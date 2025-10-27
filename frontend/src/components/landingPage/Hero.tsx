import { motion } from 'framer-motion';
import { ArrowRight, Brain, BookOpen, FileText } from 'lucide-react';
import { useNavigate } from "react-router-dom";

const Hero = () => {
    const navigate = useNavigate();

  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden bg-gradient-to-br from-white via-blue-50 to-purple-50">
      {/* Floating decorative elements */}
      <motion.div
        className="absolute top-20 left-10 text-blue-400 opacity-20"
        animate={{
          y: [0, -20, 0],
          rotate: [0, 5, 0],
        }}
        transition={{
          duration: 4,
          repeat: Infinity,
          ease: "easeInOut",
        }}
      >
        <BookOpen size={80} strokeWidth={1.5} />
      </motion.div>

      <motion.div
        className="absolute top-40 right-20 text-purple-400 opacity-20"
        animate={{
          y: [0, 20, 0],
          rotate: [0, -5, 0],
        }}
        transition={{
          duration: 5,
          repeat: Infinity,
          ease: "easeInOut",
        }}
      >
        <Brain size={100} strokeWidth={1.5} />
      </motion.div>

      <motion.div
        className="absolute bottom-32 left-1/4 text-blue-300 opacity-20"
        animate={{
          y: [0, -15, 0],
          x: [0, 10, 0],
        }}
        transition={{
          duration: 6,
          repeat: Infinity,
          ease: "easeInOut",
        }}
      >
        <FileText size={60} strokeWidth={1.5} />
      </motion.div>

      <div className="relative z-10 max-w-6xl mx-auto px-6 text-center">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="inline-block mb-6 px-4 py-2 bg-gradient-to-r from-blue-500 to-purple-500 text-white text-sm font-medium rounded-full shadow-lg"
          >
            For Nepali Students, By Learners Like You
          </motion.div>

          <h1 className="text-5xl md:text-7xl font-bold mb-6 bg-gradient-to-r from-gray-900 via-blue-900 to-purple-900 bg-clip-text text-transparent leading-tight">
            Empowering Nepali students to think, write, and win — one question at a time.
          </h1>

          <p className="text-xl md:text-2xl text-gray-600 mb-12 max-w-3xl mx-auto leading-relaxed">
            Generate custom mock exams, practice real NEB-style questions, and get peer feedback — all in one place.
          </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
                {/* Generate Paper → /dashboard */}
                <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => navigate("/dashboard")}
                    className="px-8 py-4 bg-gradient-to-r from-blue-600 to-purple-600 text-white font-semibold rounded-full shadow-xl hover:shadow-2xl transition-all flex items-center gap-2 group"
                >
                    Generate Paper
                    <ArrowRight
                        className="group-hover:translate-x-1 transition-transform"
                        size={20}
                    />
                </motion.button>

                {/* Join Community → /login */}
                <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => navigate("/login")}
                    className="px-8 py-4 bg-white text-gray-800 font-semibold rounded-full shadow-lg hover:shadow-xl transition-all border-2 border-gray-200"
                >
                    Join Community
                </motion.button>
            </div>
        </motion.div>

        {/* Scroll indicator */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.5 }}
          className="absolute bottom-10 left-1/2 transform -translate-x-1/2"
        >
          <motion.div
            animate={{ y: [0, 10, 0] }}
            transition={{ duration: 2, repeat: Infinity }}
            className="w-6 h-10 border-2 border-gray-400 rounded-full flex justify-center"
          >
            <motion.div
              animate={{ y: [0, 12, 0] }}
              transition={{ duration: 2, repeat: Infinity }}
              className="w-1.5 h-3 bg-gray-400 rounded-full mt-2"
            />
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
};

export default Hero;
