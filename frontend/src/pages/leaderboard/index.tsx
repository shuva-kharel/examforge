"use client";
import { useState } from "react";
import {
  Trophy,
  Users,
  School,
  Globe,
  Crown,
  TrendingUp,
  Award,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useTheme } from "@/context/theme-provider.tsx"; // Adjust the import path as needed

interface LeaderboardUser {
  id: string;
  name: string;
  score: number;
  rank: number;
  avatar?: string;
  progress: number; // percentage change
  subjects: string[];
}

const mockGlobalUsers: LeaderboardUser[] = [
  {
    id: "1",
    name: "Alex Chen",
    score: 2845,
    rank: 1,
    progress: 12,
    subjects: ["Math", "Physics", "Programming"],
  },
  {
    id: "2",
    name: "Sarah Johnson",
    score: 2760,
    rank: 2,
    progress: 8,
    subjects: ["Biology", "Chemistry", "Writing"],
  },
  {
    id: "3",
    name: "Marcus Rivera",
    score: 2690,
    rank: 3,
    progress: -2,
    subjects: ["History", "Literature", "Art"],
  },
  {
    id: "4",
    name: "Priya Patel",
    score: 2540,
    rank: 4,
    progress: 15,
    subjects: ["Computer Science", "Math", "Physics"],
  },
  {
    id: "5",
    name: "David Kim",
    score: 2480,
    rank: 5,
    progress: 5,
    subjects: ["Music", "Art", "Literature"],
  },
  {
    id: "6",
    name: "Emma Wilson",
    score: 2350,
    rank: 6,
    progress: 9,
    subjects: ["Biology", "Chemistry", "Physics"],
  },
  {
    id: "7",
    name: "James Brown",
    score: 2280,
    rank: 7,
    progress: -3,
    subjects: ["Math", "Programming", "Web Development"],
  },
  {
    id: "8",
    name: "Lisa Zhang",
    score: 2150,
    rank: 8,
    progress: 7,
    subjects: ["Writing", "History", "Art"],
  },
  {
    id: "9",
    name: "Ryan Cooper",
    score: 2020,
    rank: 9,
    progress: 4,
    subjects: ["Physical Education", "Biology", "Chemistry"],
  },
  {
    id: "10",
    name: "Maya Rodriguez",
    score: 1980,
    rank: 10,
    progress: 11,
    subjects: ["Math", "Physics", "Computer Science"],
  },
];

const mockCommunityUsers: LeaderboardUser[] = [
  {
    id: "c1",
    name: "You",
    score: 2150,
    rank: 3,
    progress: 18,
    subjects: ["Math", "Programming", "Web Development"],
  },
  {
    id: "c2",
    name: "Tom Wilson",
    score: 2840,
    rank: 1,
    progress: 5,
    subjects: ["Physics", "Math", "Chemistry"],
  },
  {
    id: "c3",
    name: "Jessica Lee",
    score: 2760,
    rank: 2,
    progress: 12,
    subjects: ["Biology", "Writing", "Literature"],
  },
  {
    id: "c4",
    name: "Mike Davis",
    score: 1980,
    rank: 4,
    progress: -2,
    subjects: ["History", "Art", "Music"],
  },
  {
    id: "c5",
    name: "Sophia Martinez",
    score: 1850,
    rank: 5,
    progress: 8,
    subjects: ["Computer Science", "Math", "Physics"],
  },
];

const getRankColor = (rank: number) => {
  switch (rank) {
    case 1:
      return "bg-yellow-100 text-yellow-800 border-yellow-200 dark:bg-yellow-900 dark:text-yellow-200 dark:border-yellow-700";
    case 2:
      return "bg-gray-100 text-gray-800 border-gray-200 dark:bg-gray-700 dark:text-gray-200 dark:border-gray-600";
    case 3:
      return "bg-orange-100 text-orange-800 border-orange-200 dark:bg-orange-900 dark:text-orange-200 dark:border-orange-700";
    default:
      return "bg-blue-100 text-blue-800 border-blue-200 dark:bg-blue-900 dark:text-blue-200 dark:border-blue-700";
  }
};

const getRankIcon = (rank: number) => {
  switch (rank) {
    case 1:
      return <Crown className="w-5 h-5 fill-yellow-500 text-yellow-500" />;
    case 2:
      return <Trophy className="w-5 h-5 fill-gray-400 text-gray-400" />;
    case 3:
      return <Award className="w-5 h-5 fill-orange-500 text-orange-500" />;
    default:
      return null;
  }
};

const Leaderboard = () => {
  useTheme();
  const [activeCategory, setActiveCategory] = useState<"global" | "community">(
    "global"
  );
  const [timeFilter, setTimeFilter] = useState<"all" | "month" | "week">("all");

  const currentUsers =
    activeCategory === "global" ? mockGlobalUsers : mockCommunityUsers;

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800">
      <div className="max-w-6xl mx-auto px-6 py-12">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="flex items-center justify-center mb-4">
            <Trophy className="w-12 h-12 text-yellow-500 mr-4" />
            <h1 className="text-4xl font-bold text-gray-900 dark:text-white">
              Leaderboard
            </h1>
          </div>
          <p className="text-lg text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
            Compete with learners worldwide and in your community. Track your
            progress and climb the ranks!
          </p>
        </div>

        {/* Category Tabs */}
        <div className="flex flex-col sm:flex-row justify-between items-center mb-8 gap-4">
          <div className="flex bg-white dark:bg-gray-800 rounded-2xl border border-gray-200 dark:border-gray-700 p-1 shadow-sm">
            <button
              onClick={() => setActiveCategory("global")}
              className={`flex items-center px-6 py-3 rounded-xl font-semibold transition-all ${
                activeCategory === "global"
                  ? "bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-300 shadow-sm"
                  : "text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white"
              }`}
            >
              <Globe className="w-5 h-5 mr-2" />
              Global
            </button>
            <button
              onClick={() => setActiveCategory("community")}
              className={`flex items-center px-6 py-3 rounded-xl font-semibold transition-all ${
                activeCategory === "community"
                  ? "bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-300 shadow-sm"
                  : "text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white"
              }`}
            >
              <Users className="w-5 h-5 mr-2" />
              Community
            </button>
          </div>

          {/* Time Filter */}
          <div className="flex bg-white dark:bg-gray-800 rounded-2xl border border-gray-200 dark:border-gray-700 p-1 shadow-sm">
            {["all", "month", "week"].map((filter) => (
              <button
                key={filter}
                onClick={() => setTimeFilter(filter as any)}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                  timeFilter === filter
                    ? "bg-gray-100 text-gray-900 dark:bg-gray-700 dark:text-white"
                    : "text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white"
                }`}
              >
                {filter === "all"
                  ? "All Time"
                  : filter === "month"
                  ? "This Month"
                  : "This Week"}
              </button>
            ))}
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-200 dark:border-gray-700 p-6 shadow-lg"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  Your Rank
                </p>
                <p className="text-2xl font-bold text-gray-900 dark:text-white mt-1">
                  #{mockCommunityUsers.find((u) => u.name === "You")?.rank}
                </p>
              </div>
              <div className="p-3 bg-blue-100 dark:bg-blue-900 rounded-xl">
                <Trophy className="w-6 h-6 text-blue-600 dark:text-blue-400" />
              </div>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-200 dark:border-gray-700 p-6 shadow-lg"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  Your Score
                </p>
                <p className="text-2xl font-bold text-gray-900 dark:text-white mt-1">
                  {mockCommunityUsers.find((u) => u.name === "You")?.score}
                </p>
              </div>
              <div className="p-3 bg-green-100 dark:bg-green-900 rounded-xl">
                <TrendingUp className="w-6 h-6 text-green-600 dark:text-green-400" />
              </div>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-200 dark:border-gray-700 p-6 shadow-lg"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  Progress
                </p>
                <p className="text-2xl font-bold text-green-600 dark:text-green-400 mt-1">
                  +{mockCommunityUsers.find((u) => u.name === "You")?.progress}%
                </p>
              </div>
              <div className="p-3 bg-orange-100 dark:bg-orange-900 rounded-xl">
                <School className="w-6 h-6 text-orange-600 dark:text-orange-400" />
              </div>
            </div>
          </motion.div>
        </div>

        {/* Leaderboard Table */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-200 dark:border-gray-700 shadow-lg overflow-hidden"
        >
          {/* Table Header */}
          <div className="grid grid-cols-12 gap-4 px-6 py-4 border-b border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-900">
            <div className="col-span-1 text-sm font-semibold text-gray-600 dark:text-gray-400">
              Rank
            </div>
            <div className="col-span-4 text-sm font-semibold text-gray-600 dark:text-gray-400">
              Learner
            </div>
            <div className="col-span-3 text-sm font-semibold text-gray-600 dark:text-gray-400">
              Subjects
            </div>
            <div className="col-span-2 text-sm font-semibold text-gray-600 dark:text-gray-400 text-right">
              Score
            </div>
            <div className="col-span-2 text-sm font-semibold text-gray-600 dark:text-gray-400 text-right">
              Progress
            </div>
          </div>

          {/* Table Body */}
          <div className="divide-y divide-gray-200 dark:divide-gray-700">
            <AnimatePresence>
              {currentUsers.map((user, index) => (
                <motion.div
                  key={user.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.05 }}
                  className={`grid grid-cols-12 gap-4 px-6 py-4 items-center transition-all ${
                    user.name === "You"
                      ? "bg-blue-50 dark:bg-blue-900/20 border-l-4 border-l-blue-500"
                      : "hover:bg-gray-50 dark:hover:bg-gray-700/50"
                  }`}
                >
                  {/* Rank */}
                  <div className="col-span-1 flex items-center">
                    <span
                      className={`inline-flex items-center justify-center w-8 h-8 rounded-full text-sm font-bold border ${getRankColor(
                        user.rank
                      )}`}
                    >
                      {getRankIcon(user.rank)}
                      {user.rank}
                    </span>
                  </div>

                  {/* User Info */}
                  <div className="col-span-4 flex items-center">
                    <div className="flex-shrink-0 w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white font-semibold text-sm mr-3">
                      {user.name
                        .split(" ")
                        .map((n) => n[0])
                        .join("")}
                    </div>
                    <div>
                      <p
                        className={`font-semibold ${
                          user.name === "You"
                            ? "text-blue-600 dark:text-blue-400"
                            : "text-gray-900 dark:text-white"
                        }`}
                      >
                        {user.name}
                      </p>
                    </div>
                  </div>

                  {/* Subjects */}
                  <div className="col-span-3">
                    <div className="flex flex-wrap gap-1">
                      {user.subjects.slice(0, 2).map((subject, idx) => (
                        <span
                          key={idx}
                          className="px-2 py-1 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 text-xs rounded-full"
                        >
                          {subject}
                        </span>
                      ))}
                      {user.subjects.length > 2 && (
                        <span className="px-2 py-1 bg-gray-100 dark:bg-gray-700 text-gray-500 dark:text-gray-400 text-xs rounded-full">
                          +{user.subjects.length - 2}
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Score */}
                  <div className="col-span-2 text-right">
                    <p className="font-bold text-gray-900 dark:text-white">
                      {user.score}
                    </p>
                  </div>

                  {/* Progress */}
                  <div className="col-span-2 text-right">
                    <div className="flex items-center justify-end">
                      <TrendingUp
                        className={`w-4 h-4 mr-1 ${
                          user.progress >= 0
                            ? "text-green-500"
                            : "text-red-500 rotate-180"
                        }`}
                      />
                      <span
                        className={`font-semibold ${
                          user.progress >= 0
                            ? "text-green-600 dark:text-green-400"
                            : "text-red-600 dark:text-red-400"
                        }`}
                      >
                        {user.progress >= 0 ? "+" : ""}
                        {user.progress}%
                      </span>
                    </div>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        </motion.div>

        {/* Additional Info */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="mt-8 text-center text-sm text-gray-500 dark:text-gray-400"
        >
          <p>
            Leaderboard updates every 24 hours. Scores are based on completed
            lessons, quizzes, and active learning time.
          </p>
        </motion.div>
      </div>
    </div>
  );
};

export default Leaderboard;
