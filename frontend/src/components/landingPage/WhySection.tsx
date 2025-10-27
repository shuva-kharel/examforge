import { motion } from 'framer-motion';
import { useInView } from 'framer-motion';
import { useRef } from 'react';
import { Target, Users, Shield, Lightbulb } from 'lucide-react';

const reasons = [
  {
    icon: Target,
    title: 'Helps you practice, not cheat',
    description: 'Build genuine understanding through structured practice',
  },
  {
    icon: Lightbulb,
    title: 'Encourages critical thinking',
    description: 'Develop problem-solving skills that matter in exams and beyond',
  },
  {
    icon: Shield,
    title: 'Avoids copyright issues',
    description: 'Original, ethically-sourced content you can trust',
  },
  {
    icon: Users,
    title: 'Builds peer-to-peer learning',
    description: 'Learn from fellow students and grow together',
  },
];

const WhySection = () => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: '-100px' });

  return (
    <section className="py-24 px-6 bg-gradient-to-br from-blue-50 via-purple-50 to-white">
      <div className="max-w-6xl mx-auto">
        <motion.div
          ref={ref}
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl md:text-5xl font-bold mb-6 bg-gradient-to-r from-gray-900 via-blue-900 to-purple-900 bg-clip-text text-transparent">
            No more spoon-feeding — just smart practice.
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            ExamForge is built on principles that foster real learning and ethical education.
          </p>
        </motion.div>

        <div className="grid md:grid-cols-2 gap-8">
          {reasons.map((reason, index) => {
            const itemRef = useRef(null);
            const itemInView = useInView(itemRef, { once: true, margin: '-50px' });

            return (
              <motion.div
                key={index}
                ref={itemRef}
                initial={{ opacity: 0, x: index % 2 === 0 ? -50 : 50 }}
                animate={itemInView ? { opacity: 1, x: 0 } : { opacity: 0, x: index % 2 === 0 ? -50 : 50 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                className="flex gap-6 p-6 bg-white rounded-2xl shadow-md hover:shadow-xl transition-all duration-300 border border-gray-100 group"
              >
                <motion.div
                  whileHover={{ scale: 1.1, rotate: 5 }}
                  transition={{ type: "spring", stiffness: 300 }}
                  className="flex-shrink-0 w-14 h-14 rounded-xl bg-gradient-to-br from-blue-500 to-purple-500 flex items-center justify-center shadow-lg"
                >
                  <reason.icon className="text-white" size={28} strokeWidth={2} />
                </motion.div>

                <div>
                  <h3 className="text-xl font-bold mb-2 text-gray-900 group-hover:text-blue-600 transition-colors">
                    {reason.title}
                  </h3>
                  <p className="text-gray-600 leading-relaxed">{reason.description}</p>
                </div>
              </motion.div>
            );
          })}
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
          transition={{ duration: 0.6, delay: 0.6 }}
          className="mt-16 text-center"
        >
          <div className="inline-block bg-gradient-to-r from-blue-100 to-purple-100 rounded-2xl p-8 border-2 border-blue-200">
            <p className="text-2xl font-semibold text-gray-800 leading-relaxed">
              "Education is not about grades — it's about growth."
            </p>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default WhySection;
