import { useState } from "react";
import { Plus, BookOpen, Clock, FileText } from "lucide-react";

interface GeneratedItem {
  id: string;
  class: string;
  difficulty: string;
  subject: string;
  title: string;
  date: string;
  questions: number;
  duration: string;
}

const HomePage = () => {
  const [showGenerator, setShowGenerator] = useState(false);
  const [generatedItems, setGeneratedItems] = useState<GeneratedItem[]>([]);
  const [formData, setFormData] = useState({
    class: "",
    difficulty: "",
    subject: "",
  });

  const classes = ["Class 9", "Class 10", "Class 11", "Class 12"];
  const difficulties = ["Easy", "Medium", "Hard"];
  const subjects = [
    "Mathematics",
    "Science",
    "English",
    "History",
    "Geography",
  ];

  const handleGenerate = () => {
    if (!formData.class || !formData.difficulty || !formData.subject) {
      alert("Please fill all fields");
      return;
    }

    const newItem: GeneratedItem = {
      id: Date.now().toString(),
      class: formData.class,
      difficulty: formData.difficulty,
      subject: formData.subject,
      title: `${formData.subject} - ${formData.class}`,
      date: new Date().toLocaleDateString(),
      questions: Math.floor(Math.random() * 20) + 10,
      duration: `${Math.floor(Math.random() * 60) + 30} mins`,
    };

    setGeneratedItems((prev) => [newItem, ...prev]);
    setShowGenerator(false);
    setFormData({ class: "", difficulty: "", subject: "" });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <header className="mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">
            Welcome to ExamForge
          </h1>
          <p className="text-gray-600">
            Create and manage your examination papers with ease
          </p>
        </header>

        {/* Main Content */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {/* Add New Tile */}
          <div
            onClick={() => setShowGenerator(true)}
            className="aspect-square bg-white rounded-2xl shadow-lg border-2 border-dashed border-gray-300 hover:border-blue-500 hover:shadow-xl transition-all duration-300 cursor-pointer group flex items-center justify-center"
          >
            <div className="text-center">
              <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-3 group-hover:bg-blue-500 transition-colors">
                <Plus className="w-8 h-8 text-blue-600 group-hover:text-white transition-colors" />
              </div>
              <p className="text-lg font-semibold text-gray-700 group-hover:text-blue-600 transition-colors">
                Create New
              </p>
            </div>
          </div>

          {/* Generator Menu */}
          {showGenerator && (
            <div className="aspect-square bg-white rounded-2xl shadow-xl border border-gray-200 p-6 col-span-1 md:col-span-2 lg:col-span-3">
              <h3 className="text-xl font-bold text-gray-900 mb-6">
                Create New Exam Paper
              </h3>

              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
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
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    <option value="">Select Class</option>
                    {classes.map((cls) => (
                      <option key={cls} value={cls}>
                        {cls}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
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
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    <option value="">Select Difficulty</option>
                    {difficulties.map((diff) => (
                      <option key={diff} value={diff}>
                        {diff}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
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
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    <option value="">Select Subject</option>
                    {subjects.map((sub) => (
                      <option key={sub} value={sub}>
                        {sub}
                      </option>
                    ))}
                  </select>
                </div>

                <button
                  onClick={handleGenerate}
                  className="w-full bg-gradient-to-r from-blue-500 to-purple-600 text-white py-3 rounded-lg font-semibold hover:shadow-lg transition-all duration-300 mt-4"
                >
                  Generate Exam Paper
                </button>
              </div>
            </div>
          )}

          {/* Generated Items */}
          {generatedItems.map((item) => (
            <div
              key={item.id}
              className="aspect-square bg-white rounded-2xl shadow-lg border border-gray-200 hover:shadow-xl transition-all duration-300 p-6 flex flex-col"
            >
              {/* Header */}
              <div className="flex justify-between items-start mb-4">
                <div>
                  <h3 className="font-bold text-gray-900 text-lg truncate">
                    {item.title}
                  </h3>
                  <p className="text-sm text-gray-500">{item.date}</p>
                </div>
                <span
                  className={`px-2 py-1 rounded-full text-xs font-medium ${
                    item.difficulty === "Easy"
                      ? "bg-green-100 text-green-800"
                      : item.difficulty === "Medium"
                      ? "bg-yellow-100 text-yellow-800"
                      : "bg-red-100 text-red-800"
                  }`}
                >
                  {item.difficulty}
                </span>
              </div>

              {/* Content */}
              <div className="flex-1 space-y-3">
                <div className="flex items-center text-gray-600">
                  <BookOpen className="w-4 h-4 mr-2" />
                  <span className="text-sm">{item.class}</span>
                </div>

                <div className="flex items-center text-gray-600">
                  <FileText className="w-4 h-4 mr-2" />
                  <span className="text-sm">{item.questions} Questions</span>
                </div>

                <div className="flex items-center text-gray-600">
                  <Clock className="w-4 h-4 mr-2" />
                  <span className="text-sm">{item.duration}</span>
                </div>
              </div>

              {/* Actions */}
              <div className="flex space-x-2 mt-4">
                <button className="flex-1 bg-blue-500 text-white py-2 rounded-lg text-sm font-medium hover:bg-blue-600 transition-colors">
                  Edit
                </button>
                <button className="flex-1 bg-gray-100 text-gray-700 py-2 rounded-lg text-sm font-medium hover:bg-gray-200 transition-colors">
                  View
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* Empty State */}
        {generatedItems.length === 0 && !showGenerator && (
          <div className="text-center py-12">
            <BookOpen className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-500 mb-2">
              No exam papers yet
            </h3>
            <p className="text-gray-400">
              Click the + tile to create your first exam paper
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default HomePage;
