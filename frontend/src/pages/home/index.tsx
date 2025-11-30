"use client";
import { useState } from "react";
import { Plus, BookOpen, Target, Award } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useTheme } from "@/context/theme-provider.tsx"; // Adjust the import path as needed

interface Tile {
  id: string;
  class: string;
  subject: string;
  difficulty: string;
  createdAt: Date;
}

const classOptions = [
  "Math",
  "Science",
  "English",
  "History",
  "Art",
  "Music",
  "Physical Education",
  "Computer Science",
];

const subjectOptions = [
  "Algebra",
  "Geometry",
  "Biology",
  "Chemistry",
  "Physics",
  "Literature",
  "Writing",
  "World History",
  "US History",
  "Painting",
  "Sculpture",
  "Piano",
  "Guitar",
  "Basketball",
  "Soccer",
  "Programming",
  "Web Development",
];

const difficultyOptions = ["Beginner", "Intermediate", "Advanced", "Expert"];

const difficultyColors = {
  Beginner:
    "bg-green-100 text-green-800 border-green-200 dark:bg-green-900 dark:text-green-200 dark:border-green-700",
  Intermediate:
    "bg-blue-100 text-blue-800 border-blue-200 dark:bg-blue-900 dark:text-blue-200 dark:border-blue-700",
  Advanced:
    "bg-orange-100 text-orange-800 border-orange-200 dark:bg-orange-900 dark:text-orange-200 dark:border-orange-700",
  Expert:
    "bg-red-100 text-red-800 border-red-200 dark:bg-red-900 dark:text-red-200 dark:border-red-700",
};

const Home = () => {
  useTheme();
  const [tiles, setTiles] = useState<Tile[]>([]);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [formData, setFormData] = useState({
    class: "",
    subject: "",
    difficulty: "",
  });

  const handleGenerateTile = () => {
    if (!formData.class || !formData.subject || !formData.difficulty) return;

    const newTile: Tile = {
      id: Date.now().toString(),
      class: formData.class,
      subject: formData.subject,
      difficulty: formData.difficulty,
      createdAt: new Date(),
    };

    setTiles((prev) => [newTile, ...prev]);
    setFormData({ class: "", subject: "", difficulty: "" });
    setIsFormOpen(false);
  };

  const getSubjectIcon = (subject: string) => {
    if (
      subject.includes("Math") ||
      subject.includes("Algebra") ||
      subject.includes("Geometry")
    ) {
      return <Target className="w-6 h-6" />;
    }
    if (
      subject.includes("Science") ||
      subject.includes("Biology") ||
      subject.includes("Chemistry") ||
      subject.includes("Physics")
    ) {
      return <BookOpen className="w-6 h-6" />;
    }
    if (
      subject.includes("Programming") ||
      subject.includes("Computer") ||
      subject.includes("Web")
    ) {
      return <Award className="w-6 h-6" />;
    }
    return <BookOpen className="w-6 h-6" />;
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800">
      <div className="max-w-5xl mx-auto px-6 py-12">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">
            Learning Dashboard
          </h1>
          <p className="text-lg text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
            Create and organize your learning materials. Click the plus tile to
            begin.
          </p>
        </div>

        {/* Tile Grid */}
        <motion.div
          className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 mb-8"
          layout
        >
          {/* + Tile */}
          <motion.div
            layout
            whileHover={{ scale: 1.02, y: -2 }}
            whileTap={{ scale: 0.98 }}
            className="aspect-square bg-white dark:bg-gray-800 rounded-2xl border-2 border-dashed border-gray-300 dark:border-gray-600
                     hover:border-blue-400 dark:hover:border-blue-500 hover:shadow-lg transition-all duration-300 cursor-pointer
                     flex items-center justify-center group"
            onClick={() => setIsFormOpen(true)}
          >
            <Plus className="w-12 h-12 text-gray-400 dark:text-gray-500 group-hover:text-blue-500 dark:group-hover:text-blue-400 transition-colors duration-300" />
          </motion.div>

          {/* Generated Tiles */}
          <AnimatePresence>
            {tiles.map((tile) => (
              <motion.div
                key={tile.id}
                layout
                initial={{ opacity: 0, scale: 0.8, y: 20 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.8, y: -20 }}
                whileHover={{ y: -4 }}
                className="aspect-square bg-white dark:bg-gray-800 rounded-2xl border border-gray-200 dark:border-gray-700 shadow-md
                         hover:shadow-xl dark:hover:shadow-2xl transition-all duration-300 p-6 flex flex-col justify-between
                         cursor-pointer group"
              >
                <div className="flex items-start justify-between">
                  <div className="text-gray-500 dark:text-gray-400">
                    {getSubjectIcon(tile.subject)}
                  </div>
                  <span
                    className={`text-xs px-2 py-1 rounded-full border ${
                      difficultyColors[
                        tile.difficulty as keyof typeof difficultyColors
                      ]
                    }`}
                  >
                    {tile.difficulty}
                  </span>
                </div>

                <div className="flex-1 flex flex-col justify-center">
                  <h3 className="font-bold text-gray-900 dark:text-white text-lg mb-1 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                    {tile.class}
                  </h3>
                  <p className="text-gray-600 dark:text-gray-300 text-sm">
                    {tile.subject}
                  </p>
                </div>

                <div className="text-xs text-gray-400 dark:text-gray-500 mt-2">
                  {tile.createdAt.toLocaleDateString()}
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </motion.div>

        {/* Create Tile Form */}
        <AnimatePresence>
          {isFormOpen && (
            <motion.div
              initial={{ opacity: 0, height: 0, y: -20 }}
              animate={{ opacity: 1, height: "auto", y: 0 }}
              exit={{ opacity: 0, height: 0, y: -20 }}
              transition={{ duration: 0.3 }}
              className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-200 dark:border-gray-700 shadow-lg p-8 mb-8 overflow-hidden"
            >
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
                  Create New Tile
                </h2>
                <button
                  onClick={() => setIsFormOpen(false)}
                  className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition"
                >
                  <Plus className="w-6 h-6 rotate-45" />
                </button>
              </div>

              {/* Inputs */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Class
                  </label>
                  <select
                    value={formData.class}
                    onChange={(e) =>
                      setFormData((prev) => ({
                        ...prev,
                        class: e.target.value,
                      }))
                    }
                    className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-xl focus:ring-2
                             focus:ring-blue-500 focus:border-blue-500 transition bg-white dark:bg-gray-700
                             text-gray-900 dark:text-white"
                  >
                    <option
                      value=""
                      className="text-gray-500 dark:text-gray-400"
                    >
                      Select a class
                    </option>
                    {classOptions.map((o) => (
                      <option key={o} className="text-gray-900 dark:text-white">
                        {o}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Subject
                  </label>
                  <select
                    value={formData.subject}
                    onChange={(e) =>
                      setFormData((prev) => ({
                        ...prev,
                        subject: e.target.value,
                      }))
                    }
                    className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-xl focus:ring-2
                             focus:ring-blue-500 focus:border-blue-500 transition bg-white dark:bg-gray-700
                             text-gray-900 dark:text-white"
                  >
                    <option
                      value=""
                      className="text-gray-500 dark:text-gray-400"
                    >
                      Select a subject
                    </option>
                    {subjectOptions.map((o) => (
                      <option key={o} className="text-gray-900 dark:text-white">
                        {o}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Difficulty
                  </label>
                  <select
                    value={formData.difficulty}
                    onChange={(e) =>
                      setFormData((prev) => ({
                        ...prev,
                        difficulty: e.target.value,
                      }))
                    }
                    className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-xl focus:ring-2
                             focus:ring-blue-500 focus:border-blue-500 transition bg-white dark:bg-gray-700
                             text-gray-900 dark:text-white"
                  >
                    <option
                      value=""
                      className="text-gray-500 dark:text-gray-400"
                    >
                      Select difficulty
                    </option>
                    {difficultyOptions.map((o) => (
                      <option key={o} className="text-gray-900 dark:text-white">
                        {o}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Generate */}
              <div className="flex justify-end">
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={handleGenerateTile}
                  disabled={
                    !formData.class || !formData.subject || !formData.difficulty
                  }
                  className="px-8 py-3 bg-blue-600 text-white font-semibold rounded-xl
                           hover:bg-blue-700 disabled:bg-gray-300 dark:disabled:bg-gray-600 disabled:cursor-not-allowed
                           transition shadow-lg"
                >
                  Generate Tile
                </motion.button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Empty state */}
        {tiles.length === 0 && !isFormOpen && (
          <div className="text-center py-16 text-gray-600 dark:text-gray-400">
            No tiles yet. Click the + button above to create one.
          </div>
        )}
      </div>
    </div>
  );
};

export default Home;
