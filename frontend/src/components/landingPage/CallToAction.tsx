import { motion } from 'framer-motion';
import { useInView } from 'framer-motion';
import { useRef } from 'react';
import { ArrowRight, Star } from 'lucide-react';

const CallToAction = () => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: '-100px' });

  return (
    <section className="py-24 px-6 bg-gradient-to-br from-blue-600 via-purple-600 to-pink-600 relative overflow-hidden">
      {/* Animated background patterns */}
      <motion.div
        animate={{
          rotate: [0, 360],
        }}
        transition={{
          duration: 30,
          repeat: Infinity,
          ease: "linear",
        }}
        className="absolute top-0 right-0 w-96 h-96 bg-white opacity-5 rounded-full blur-3xl"
      />
      <motion.div
        animate={{
          rotate: [360, 0],
        }}
        transition={{
          duration: 25,
          repeat: Infinity,
          ease: "linear",
        }}
        className="absolute bottom-0 left-0 w-96 h-96 bg-white opacity-5 rounded-full blur-3xl"
      />

      <div className="max-w-4xl mx-auto text-center relative z-10">
        <motion.div
          ref={ref}
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
          transition={{ duration: 0.6 }}
        >
          <motion.div
            initial={{ scale: 0 }}
            animate={isInView ? { scale: 1 } : { scale: 0 }}
            transition={{ duration: 0.5, delay: 0.2, type: "spring" }}
            className="inline-flex items-center gap-2 mb-6"
          >
            <Star className="text-yellow-300 fill-yellow-300" size={24} />
            <Star className="text-yellow-300 fill-yellow-300" size={32} />
            <Star className="text-yellow-300 fill-yellow-300" size={24} />
          </motion.div>

          <h2 className="text-4xl md:text-6xl font-bold text-white mb-6 leading-tight">
            Start your journey to smarter revision.
          </h2>

          <p className="text-xl text-blue-100 mb-12 max-w-2xl mx-auto leading-relaxed">
            Join hundreds of students who are already transforming their exam preparation with ExamForge.
          </p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="flex flex-col sm:flex-row gap-4 justify-center items-center"
          >
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="px-8 py-4 bg-white text-purple-600 font-bold rounded-full shadow-2xl hover:shadow-white/50 transition-all flex items-center gap-2 group text-lg"
            >
              Try Demo
              <ArrowRight className="group-hover:translate-x-1 transition-transform" size={20} />
            </motion.button>

            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="px-8 py-4 bg-transparent text-white font-bold rounded-full border-2 border-white hover:bg-white hover:text-purple-600 transition-all text-lg"
            >
              Join Early Access
            </motion.button>
          </motion.div>

          <motion.div
            initial={{ opacity: 0 }}
            animate={isInView ? { opacity: 1 } : { opacity: 0 }}
            transition={{ duration: 0.6, delay: 0.8 }}
            className="mt-12 flex items-center justify-center gap-8 text-white/80 text-sm"
          >
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse" />
              No credit card required
            </div>
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse" />
              Free forever
            </div>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
};

export default CallToAction;
