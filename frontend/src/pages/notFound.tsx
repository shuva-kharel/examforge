'use client';

import { motion, useInView, Variants } from 'framer-motion';
import { useRef } from 'react';
import {
    Home,
    Search,
    Compass,
    ArrowRight,
    FileQuestion,
    Globe,
    Layers,
    Sparkles,
    ArrowDown,
    ExternalLink,
    BookOpen,
    Mail
} from 'lucide-react';

export default function NotFound() {
    const containerRef = useRef<HTMLDivElement>(null);

    // Refs for scroll-triggered animations
    const headerRef = useRef<HTMLDivElement>(null);
    const actionsRef = useRef<HTMLDivElement>(null);
    const helpRef = useRef<HTMLDivElement>(null);
    const footerRef = useRef<HTMLDivElement>(null);

    // InView hooks for scroll triggers
    const headerInView = useInView(headerRef, { once: true, amount: 0.8 });
    const actionsInView = useInView(actionsRef, { once: true, amount: 0.3 });
    const helpInView = useInView(helpRef, { once: true, amount: 0.5 });
    const footerInView = useInView(footerRef, { once: true, amount: 0.5 });

    const quickActions = [
        {
            icon: Home,
            title: 'Go Home',
            description: 'Return to the homepage and start fresh',
            href: '/',
            gradient: 'from-blue-500 to-purple-600'
        },
        {
            icon: Search,
            title: 'Search Content',
            description: 'Find exactly what you\'re looking for',
            href: '/search',
            gradient: 'from-purple-500 to-pink-600'
        },
        {
            icon: Compass,
            title: 'Explore',
            description: 'Discover new pages and content',
            href: '/explore',
            gradient: 'from-cyan-500 to-blue-600'
        }
    ];

    const helpActions = [
        {
            icon: BookOpen,
            title: 'Documentation',
            description: 'Browse our comprehensive guides',
            href: '/docs'
        },
        {
            icon: Mail,
            title: 'Contact Support',
            description: 'Get help from our team',
            href: '/support'
        }
    ];

    // Properly typed variants
    const containerVariants: Variants = {
        hidden: { opacity: 0 },
        visible: {
            opacity: 1,
            transition: {
                staggerChildren: 0.2
            }
        }
    };

    const itemVariants: Variants = {
        hidden: { opacity: 0, y: 30 },
        visible: {
            opacity: 1,
            y: 0,
            transition: {
                duration: 0.6,
                ease: "easeOut"
            }
        }
    };

    const cardVariants: Variants = {
        hidden: { opacity: 0, y: 20, scale: 0.95 },
        visible: {
            opacity: 1,
            y: 0,
            scale: 1,
            transition: {
                duration: 0.5,
                ease: "easeOut"
            }
        }
    };

    return (
        <div
            ref={containerRef}
            className="min-h-screen bg-white overflow-hidden"
        >
            {/* Main Content */}
            <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-20">

                {/* Header Section - Always visible */}
                <motion.section
                    ref={headerRef}
                    initial={{ opacity: 0, y: 40 }}
                    animate={headerInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 40 }}
                    transition={{ duration: 0.8, ease: "easeOut" }}
                    className="min-h-[70vh] flex items-center justify-center text-center mb-20"
                >
                    <div className="space-y-8">
                        {/* Animated Icon */}
                        <motion.div
                            initial={{ scale: 0, rotate: -180 }}
                            animate={headerInView ? { scale: 1, rotate: 0 } : { scale: 0, rotate: -180 }}
                            transition={{
                                duration: 0.8,
                                type: "spring",
                                stiffness: 100
                            }}
                            className="flex justify-center"
                        >
                            <div className="relative">
                                <div className="w-24 h-24 bg-gradient-to-br from-blue-500 to-purple-600 rounded-3xl flex items-center justify-center shadow-xl">
                                    <FileQuestion className="w-12 h-12 text-white" />
                                </div>
                                <motion.div
                                    animate={{
                                        rotate: 360,
                                        scale: [1, 1.2, 1]
                                    }}
                                    transition={{
                                        rotate: { duration: 20, repeat: Infinity, ease: "linear" },
                                        scale: { duration: 3, repeat: Infinity, ease: "easeInOut" }
                                    }}
                                    className="absolute -top-3 -right-3"
                                >
                                    <Sparkles className="w-8 h-8 text-purple-500" />
                                </motion.div>
                            </div>
                        </motion.div>

                        {/* Main Text */}
                        <div className="space-y-6">
                            <motion.h1
                                initial={{ opacity: 0, y: 30 }}
                                animate={headerInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
                                transition={{ delay: 0.3, duration: 0.6 }}
                                className="text-7xl sm:text-8xl lg:text-9xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent"
                            >
                                404
                            </motion.h1>

                            <motion.p
                                initial={{ opacity: 0, y: 20 }}
                                animate={headerInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
                                transition={{ delay: 0.5, duration: 0.6 }}
                                className="text-2xl sm:text-3xl lg:text-4xl text-gray-700 font-medium"
                            >
                                Page not found
                            </motion.p>

                            <motion.p
                                initial={{ opacity: 0, y: 20 }}
                                animate={headerInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
                                transition={{ delay: 0.7, duration: 0.6 }}
                                className="text-lg sm:text-xl text-gray-500 max-w-2xl mx-auto leading-relaxed"
                            >
                                The page you're looking for doesn't exist or has been moved.
                                Don't worry—let's find our way back together.
                            </motion.p>
                        </div>

                        {/* Scroll Indicator */}
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={headerInView ? { opacity: 1 } : { opacity: 0 }}
                            transition={{ delay: 1.2, duration: 0.6 }}
                            className="pt-12"
                        >
                            <motion.div
                                animate={{ y: [0, 10, 0] }}
                                transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
                                className="flex flex-col items-center space-y-2 text-gray-400"
                            >
                                <span className="text-sm font-medium">Scroll to explore</span>
                                <ArrowDown className="w-5 h-5" />
                            </motion.div>
                        </motion.div>
                    </div>
                </motion.section>

                {/* Quick Actions Section - Reveals on scroll */}
                <motion.section
                    ref={actionsRef}
                    variants={containerVariants}
                    initial="hidden"
                    animate={actionsInView ? "visible" : "hidden"}
                    className="mb-32"
                >
                    <motion.div
                        variants={itemVariants}
                        className="text-center mb-16"
                    >
                        <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4">
                            Quick Actions
                        </h2>
                        <p className="text-xl text-gray-600 max-w-2xl mx-auto">
                            Here are some helpful links to get you back on track
                        </p>
                    </motion.div>

                    <motion.div
                        variants={containerVariants}
                        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8"
                    >
                        {quickActions.map((action, _index) => (
                            <motion.div
                                key={action.title}
                                variants={cardVariants}
                                whileHover={{
                                    y: -8,
                                    scale: 1.02,
                                    transition: { duration: 0.2 }
                                }}
                                className="group"
                            >
                                <a
                                    href={action.href}
                                    className="block p-8 bg-white rounded-2xl shadow-sm border border-gray-100 hover:shadow-xl transition-all duration-300 group-hover:border-transparent h-full"
                                >
                                    <div className={`w-16 h-16 bg-gradient-to-r ${action.gradient} rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300 shadow-lg`}>
                                        <action.icon className="w-8 h-8 text-white" />
                                    </div>
                                    <h3 className="text-xl font-semibold text-gray-900 mb-3 group-hover:text-gray-700 transition-colors">
                                        {action.title}
                                    </h3>
                                    <p className="text-gray-500 text-base mb-6 leading-relaxed">
                                        {action.description}
                                    </p>
                                    <div className="flex items-center text-base font-medium text-gray-600 group-hover:text-gray-900 transition-colors">
                                        Take me there
                                        <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
                                    </div>
                                </a>
                            </motion.div>
                        ))}
                    </motion.div>
                </motion.section>

                {/* Help Section - Reveals on scroll */}
                <motion.section
                    ref={helpRef}
                    variants={containerVariants}
                    initial="hidden"
                    animate={helpInView ? "visible" : "hidden"}
                    className="mb-32"
                >
                    <motion.div
                        variants={itemVariants}
                        className="bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50 rounded-3xl p-8 sm:p-12 lg:p-16 border border-blue-100 shadow-sm"
                    >
                        <div className="text-center space-y-8">
                            <motion.div
                                variants={itemVariants}
                                className="flex justify-center space-x-6"
                            >
                                <Globe className="w-8 h-8 text-blue-600" />
                                <Layers className="w-8 h-8 text-purple-600" />
                                <Sparkles className="w-8 h-8 text-pink-600" />
                            </motion.div>

                            <motion.div variants={itemVariants} className="space-y-4">
                                <h3 className="text-3xl sm:text-4xl font-bold text-gray-900">
                                    Need more help?
                                </h3>
                                <p className="text-xl text-gray-600 max-w-2xl mx-auto">
                                    Our support team is here to help you get where you need to go
                                </p>
                            </motion.div>

                            <motion.div
                                variants={containerVariants}
                                className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-2xl mx-auto pt-8"
                            >
                                {helpActions.map((action, _index) => (
                                    <motion.div
                                        key={action.title}
                                        variants={cardVariants}
                                        whileHover={{ scale: 1.05 }}
                                        className="group"
                                    >
                                        <a
                                            href={action.href}
                                            className="flex items-center p-6 bg-white rounded-2xl shadow-sm border border-gray-200 hover:shadow-lg transition-all duration-300 group-hover:border-blue-200"
                                        >
                                            <div className="w-12 h-12 bg-gradient-to-r from-gray-100 to-gray-200 rounded-xl flex items-center justify-center mr-4 group-hover:from-blue-100 group-hover:to-purple-100 transition-all duration-300">
                                                <action.icon className="w-6 h-6 text-gray-600 group-hover:text-blue-600 transition-colors" />
                                            </div>
                                            <div className="flex-1">
                                                <h4 className="font-semibold text-gray-900 group-hover:text-gray-700 transition-colors">
                                                    {action.title}
                                                </h4>
                                                <p className="text-sm text-gray-500 mt-1">
                                                    {action.description}
                                                </p>
                                            </div>
                                            <ExternalLink className="w-5 h-5 text-gray-400 group-hover:text-blue-500 transition-colors" />
                                        </a>
                                    </motion.div>
                                ))}
                            </motion.div>
                        </div>
                    </motion.div>
                </motion.section>

                {/* Footer Section - Reveals on scroll */}
                <motion.section
                    ref={footerRef}
                    initial={{ opacity: 0, y: 30 }}
                    animate={footerInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
                    transition={{ duration: 0.8 }}
                    className="text-center"
                >
                    <div className="space-y-4">
                        <motion.p
                            initial={{ opacity: 0 }}
                            animate={footerInView ? { opacity: 1 } : { opacity: 0 }}
                            transition={{ delay: 0.3 }}
                            className="text-gray-400 text-lg"
                        >
                            Error code: 404 • Page not found
                        </motion.p>
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={footerInView ? { opacity: 1 } : { opacity: 0 }}
                            transition={{ delay: 0.5 }}
                            className="flex justify-center space-x-6 text-gray-400"
                        >
                            <button className="hover:text-gray-600 transition-colors text-sm">
                                Privacy Policy
                            </button>
                            <button className="hover:text-gray-600 transition-colors text-sm">
                                Terms of Service
                            </button>
                            <button className="hover:text-gray-600 transition-colors text-sm">
                                Status
                            </button>
                        </motion.div>
                    </div>
                </motion.section>
            </div>
        </div>
    );
}