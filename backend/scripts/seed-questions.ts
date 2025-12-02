// scripts/seed-questions.ts
import mongoose from "mongoose";
import QuestionModel from "../src/database/models/question.model";
import {
  QuestionType,
  Subject,
  ClassLevel,
  Difficulty,
  CompetencyLevel,
  TopicCategory,
} from "../src/database/models/question.model";
import dotenv from "dotenv";
import { config } from "../src/config/app.config";

dotenv.config();

const chemistryQuestions = [
  // MCQ Questions (1 mark each)
  {
    questionText: "Which of the following is a first-order reaction?",
    originalQuestionText: "Which of the following is a first-order reaction?",
    questionType: QuestionType.MCQ,
    subject: Subject.CHEMISTRY,
    classLevel: ClassLevel.TWELVE,
    chapter: "Chemical Kinetics",
    chapterNumber: 4,
    topic: "Order of Reaction",
    topicCategory: TopicCategory.PHYSICAL_CHEMISTRY,
    difficulty: Difficulty.EASY,
    competencyLevel: CompetencyLevel.REMEMBERING,
    year: 2023,
    marks: 1,
    options: [
      "Hydrolysis of ester",
      "Decomposition of N₂O₅",
      "Formation of HI from H₂ and I₂",
      "Hydrogenation of ethene",
    ],
    correctAnswer: "Decomposition of N₂O₅",
    explanation: "Decomposition of N₂O₅ is a well-known first-order reaction.",
    createdBy: new mongoose.Types.ObjectId(),
    isActive: true,
    tags: ["kinetics", "first-order", "decomposition"],
  },
  {
    questionText: "The rate constant of a reaction depends on:",
    originalQuestionText: "The rate constant of a reaction depends on:",
    questionType: QuestionType.MCQ,
    subject: Subject.CHEMISTRY,
    classLevel: ClassLevel.TWELVE,
    chapter: "Chemical Kinetics",
    chapterNumber: 4,
    topic: "Rate Constant",
    topicCategory: TopicCategory.PHYSICAL_CHEMISTRY,
    difficulty: Difficulty.MEDIUM,
    competencyLevel: CompetencyLevel.UNDERSTANDING,
    year: 2022,
    marks: 1,
    options: [
      "Concentration of reactants",
      "Temperature",
      "Pressure",
      "Volume",
    ],
    correctAnswer: "Temperature",
    explanation:
      "Rate constant depends on temperature according to Arrhenius equation.",
    createdBy: new mongoose.Types.ObjectId(),
    isActive: true,
  },
  // Short Answer Questions (5 marks each)
  {
    questionText:
      "Define activation energy. How does it affect the rate of reaction?",
    originalQuestionText:
      "Define activation energy. How does it affect the rate of reaction?",
    questionType: QuestionType.SHORT_ANSWER,
    subject: Subject.CHEMISTRY,
    classLevel: ClassLevel.TWELVE,
    chapter: "Chemical Kinetics",
    chapterNumber: 4,
    topic: "Activation Energy",
    topicCategory: TopicCategory.PHYSICAL_CHEMISTRY,
    difficulty: Difficulty.MEDIUM,
    competencyLevel: CompetencyLevel.UNDERSTANDING,
    year: 2021,
    marks: 5,
    correctAnswer:
      "Activation energy is the minimum energy required for a reaction to occur. Higher activation energy means slower reaction rate.",
    explanation:
      "According to Arrhenius equation, rate constant decreases exponentially with increasing activation energy.",
    createdBy: new mongoose.Types.ObjectId(),
    isActive: true,
  },
  // Long Answer Questions (8 marks each)
  {
    questionText:
      "Derive the integrated rate equation for a first-order reaction. Show that the half-life period is independent of initial concentration.",
    originalQuestionText:
      "Derive the integrated rate equation for a first-order reaction. Show that the half-life period is independent of initial concentration.",
    questionType: QuestionType.LONG_ANSWER,
    subject: Subject.CHEMISTRY,
    classLevel: ClassLevel.TWELVE,
    chapter: "Chemical Kinetics",
    chapterNumber: 4,
    topic: "First Order Reaction",
    topicCategory: TopicCategory.PHYSICAL_CHEMISTRY,
    difficulty: Difficulty.HARD,
    competencyLevel: CompetencyLevel.APPLYING,
    year: 2020,
    marks: 8,
    correctAnswer:
      "For first-order reaction: rate = -d[A]/dt = k[A]. Integrating gives ln[A] = -kt + ln[A]₀. Half-life t₁/₂ = 0.693/k.",
    explanation:
      "The derivation involves separation of variables and integration.",
    createdBy: new mongoose.Types.ObjectId(),
    isActive: true,
  },
  // Add more questions for different chapters...
  {
    questionText:
      "What is standard hydrogen electrode? Why is its potential taken as zero?",
    originalQuestionText:
      "What is standard hydrogen electrode? Why is its potential taken as zero?",
    questionType: QuestionType.SHORT_ANSWER,
    subject: Subject.CHEMISTRY,
    classLevel: ClassLevel.TWELVE,
    chapter: "Electrochemistry",
    chapterNumber: 3,
    topic: "Standard Hydrogen Electrode",
    topicCategory: TopicCategory.PHYSICAL_CHEMISTRY,
    difficulty: Difficulty.MEDIUM,
    competencyLevel: CompetencyLevel.UNDERSTANDING,
    year: 2022,
    marks: 5,
    correctAnswer:
      "Standard hydrogen electrode is a reference electrode with platinum foil coated with platinum black dipped in 1M HCl solution. Its potential is arbitrarily taken as zero for comparison.",
    createdBy: new mongoose.Types.ObjectId(),
    isActive: true,
  },
];

async function seedQuestions() {
  try {
    await mongoose.connect(config.MONGO_URI);
    console.log("✅ Connected to MongoDB");

    // Insert questions
    await QuestionModel.insertMany(chemistryQuestions);
    console.log(`✅ Inserted ${chemistryQuestions.length} chemistry questions`);

    // Count total questions
    const count = await QuestionModel.countDocuments();
    console.log(`📊 Total questions in database: ${count}`);

    // Show statistics
    const stats = await QuestionModel.aggregate([
      {
        $group: {
          _id: {
            subject: "$subject",
            classLevel: "$classLevel",
            questionType: "$questionType",
          },
          count: { $sum: 1 },
        },
      },
    ]);

    console.log("\n📋 Question Statistics:");
    stats.forEach((stat) => {
      console.log(
        `   - ${stat._id.subject} (Class ${stat._id.classLevel}) - ${stat._id.questionType}: ${stat.count}`
      );
    });

    process.exit(0);
  } catch (error) {
    console.error("❌ Error seeding questions:", error);
    process.exit(1);
  }
}

seedQuestions();
