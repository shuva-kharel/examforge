import { motion } from 'framer-motion';
import { useInView } from 'framer-motion';
import { useRef } from 'react';
import { Brain, MessageSquare, Zap } from 'lucide-react';

const features = [
  {
    icon: Brain,
    title: 'Smart Paper Generator',
    description: 'Create question papers by subject, chapter, year & difficulty.',
    gradient: 'from-blue-500 to-cyan-500',
  },
  {
    icon: MessageSquare,
    title: 'Community Answer Board',
    description: 'Upload your answers, get reviews, and learn from others.',
    gradient: 'from-purple-500 to-pink-500',
  },
  {
    icon: Zap,
    title: 'Gamified Practice',
    description: 'Earn XP, streaks, and tackle daily challenges to stay consistent.',
    gradient: 'from-orange-500 to-red-500',
  },
];

const FeatureCard = ({ feature, index }: { feature: typeof features[0]; index: number }) => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: '-100px' });

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 50 }}
      animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 50 }}
      transition={{ duration: 0.6, delay: index * 0.2 }}
      className="bg-white rounded-3xl p-8 shadow-lg hover:shadow-2xl transition-all duration-300 border border-gray-100 group"
    >
      <motion.div
        whileHover={{ scale: 1.1, rotate: 5 }}
        transition={{ type: "spring", stiffness: 300 }}
        className={`w-16 h-16 rounded-2xl bg-gradient-to-br ${feature.gradient} flex items-center justify-center mb-6 shadow-lg`}
      >
        <feature.icon className="text-white" size={32} strokeWidth={2} />
      </motion.div>

      <h3 className="text-2xl font-bold mb-4 text-gray-900">{feature.title}</h3>
      <p className="text-gray-600 leading-relaxed text-lg">{feature.description}</p>

      <motion.div
        initial={{ width: 0 }}
        whileInView={{ width: '100%' }}
        transition={{ duration: 0.8, delay: 0.5 + index * 0.2 }}
        className={`h-1 bg-gradient-to-r ${feature.gradient} rounded-full mt-6`}
      />
    </motion.div>
  );
};

const Features = () => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: '-100px' });

  return (
    <section className="py-24 px-6 bg-gradient-to-b from-white to-gray-50">
      <div className="max-w-7xl mx-auto">
        <motion.div
          ref={ref}
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl md:text-5xl font-bold mb-4 bg-gradient-to-r from-gray-900 to-blue-900 bg-clip-text text-transparent">
            Everything you need to excel
          </h2>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Powerful tools designed to make your exam preparation smarter, faster, and more effective.
          </p>
        </motion.div>

        <div className="grid md:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <FeatureCard key={index} feature={feature} index={index} />
          ))}
        </div>
      </div>
    </section>
  );
};

export default Features;
