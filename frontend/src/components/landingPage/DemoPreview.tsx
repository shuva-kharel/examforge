import { motion } from 'framer-motion';
import { useInView } from 'framer-motion';
import { useRef } from 'react';
import { Play, Sparkles } from 'lucide-react';

const DemoPreview = () => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: '-100px' });

  return (
    <section className="py-24 px-6 bg-white">
      <div className="max-w-6xl mx-auto">
        <motion.div
          ref={ref}
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-12"
        >
          <h2 className="text-4xl md:text-5xl font-bold mb-4 bg-gradient-to-r from-gray-900 to-purple-900 bg-clip-text text-transparent">
            See it in action
          </h2>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Watch how ExamForge transforms the way you prepare for exams.
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={isInView ? { opacity: 1, scale: 1 } : { opacity: 0, scale: 0.95 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="relative"
        >
          {/* Mock device frame */}
          <div className="relative bg-gradient-to-br from-gray-900 via-blue-900 to-purple-900 rounded-3xl shadow-2xl overflow-hidden p-1">
            {/* Screen content */}
            <div className="bg-white rounded-2xl p-8 min-h-[500px] flex flex-col items-center justify-center relative overflow-hidden">
              {/* Gradient background effect */}
              <div className="absolute inset-0 bg-gradient-to-br from-blue-100 via-purple-100 to-pink-100 opacity-40" />

              {/* Coming Soon Badge */}
              <motion.div
                initial={{ scale: 0, rotate: -10 }}
                animate={isInView ? { scale: 1, rotate: 0 } : { scale: 0, rotate: -10 }}
                transition={{ duration: 0.5, delay: 0.5, type: "spring" }}
                className="relative z-10 inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white font-bold text-xl rounded-full shadow-lg mb-8"
              >
                <Sparkles size={24} />
                Coming Soon
                <Sparkles size={24} />
              </motion.div>

              {/* Floating elements */}
              <motion.div
                animate={{
                  y: [0, -10, 0],
                }}
                transition={{
                  duration: 3,
                  repeat: Infinity,
                  ease: "easeInOut",
                }}
                className="relative z-10 mb-8"
              >
                <div className="w-32 h-32 bg-gradient-to-br from-blue-400 to-purple-400 rounded-3xl flex items-center justify-center shadow-xl">
                  <div className="w-24 h-24 bg-white rounded-2xl flex items-center justify-center">
                    <div className="space-y-2">
                      <div className="h-2 w-16 bg-gray-300 rounded" />
                      <div className="h-2 w-12 bg-gray-300 rounded" />
                      <div className="h-2 w-14 bg-gray-300 rounded" />
                    </div>
                  </div>
                </div>
              </motion.div>

              <p className="relative z-10 text-gray-600 text-lg text-center max-w-md">
                Our team is crafting an amazing experience for you. Get ready to revolutionize your exam prep!
              </p>

              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="relative z-10 mt-8 px-8 py-4 bg-gradient-to-r from-blue-600 to-purple-600 text-white font-semibold rounded-full shadow-xl hover:shadow-2xl transition-all flex items-center gap-3 group"
              >
                <Play size={20} className="group-hover:scale-110 transition-transform" />
                See How It Works
              </motion.button>
            </div>
          </div>

          {/* Decorative glow effects */}
          <div className="absolute -inset-4 bg-gradient-to-r from-blue-500 to-purple-500 opacity-20 blur-3xl -z-10 rounded-3xl" />
        </motion.div>

        {/* Feature highlights below preview */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
          transition={{ duration: 0.6, delay: 0.8 }}
          className="mt-16 grid md:grid-cols-3 gap-6 text-center"
        >
          {[
            { label: 'NEB-Style Questions', value: '1000+' },
            { label: 'Active Students', value: '500+' },
            { label: 'Success Rate', value: '95%' },
          ].map((stat, index) => (
            <div key={index} className="p-6 bg-gradient-to-br from-gray-50 to-blue-50 rounded-2xl border border-gray-200">
              <div className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent mb-2">
                {stat.value}
              </div>
              <div className="text-gray-600 font-medium">{stat.label}</div>
            </div>
          ))}
        </motion.div>
      </div>
    </section>
  );
};

export default DemoPreview;
