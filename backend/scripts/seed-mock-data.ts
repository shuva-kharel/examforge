// scripts/seed-mock-data.ts
import mongoose from "mongoose";
import dotenv from "dotenv";
import { v4 as uuidv4 } from "uuid";

dotenv.config();

// Import models
import QuestionModel from "../src/database/models/question.model";
import PaperPatternModel from "../src/database/models/paper-pattern.model";
import GeneratedPaperModel from "../src/database/models/generated-paper.model";
import {
  QuestionType,
  Subject,
  ClassLevel,
  TopicCategory,
  CompetencyLevel,
  Difficulty,
} from "../src/database/models/question.model";
import { config } from "../src/config/app.config";

// Create a mock user ID (you can replace with actual user ID later)
const mockUserId = new mongoose.Types.ObjectId();

// Mock Paper Patterns
const mockPaperPatterns = [
  {
    _id: new mongoose.Types.ObjectId(),
    name: "NEB Chemistry Grade 12 - Mock Pattern",
    subject: Subject.CHEMISTRY,
    classLevel: "12",
    totalMarks: 75,
    totalQuestions: 22,
    duration: 180,
    sections: [
      {
        name: "Multiple Choice Questions (MCQ)",
        questionType: QuestionType.MCQ,
        marksPerQuestion: 1,
        numberOfQuestions: 11,
        totalMarks: 11,
        competencyDistribution: [
          { competencyLevel: CompetencyLevel.REMEMBERING, questions: 2 },
          { competencyLevel: CompetencyLevel.UNDERSTANDING, questions: 5 },
          { competencyLevel: CompetencyLevel.APPLYING, questions: 3 },
          { competencyLevel: CompetencyLevel.HIGHER_ABILITY, questions: 1 },
        ],
      },
      {
        name: "Short Answer Questions (SAQ)",
        questionType: QuestionType.SHORT_ANSWER,
        marksPerQuestion: 5,
        numberOfQuestions: 8,
        totalMarks: 40,
        topicDistribution: [
          {
            topicCategory: TopicCategory.PHYSICAL_CHEMISTRY,
            questions: 3,
            marks: 15,
          },
          {
            topicCategory: TopicCategory.INORGANIC_CHEMISTRY,
            questions: 2,
            marks: 10,
          },
          {
            topicCategory: TopicCategory.ORGANIC_CHEMISTRY,
            questions: 2,
            marks: 10,
          },
          {
            topicCategory: TopicCategory.APPLIED_CHEMISTRY,
            questions: 1,
            marks: 5,
          },
        ],
      },
      {
        name: "Long Answer Questions (LAQ)",
        questionType: QuestionType.LONG_ANSWER,
        marksPerQuestion: 8,
        numberOfQuestions: 3,
        totalMarks: 24,
        topicDistribution: [
          {
            topicCategory: TopicCategory.PHYSICAL_CHEMISTRY,
            questions: 1,
            marks: 8,
          },
          {
            topicCategory: TopicCategory.ORGANIC_CHEMISTRY,
            questions: 1,
            marks: 8,
          },
          {
            topicCategory: TopicCategory.INORGANIC_CHEMISTRY,
            questions: 1,
            marks: 8,
          },
        ],
      },
    ],
    instructions: [
      "Attempt all questions.",
      "Figures in the margin indicate full marks.",
      "Write answers in sequence.",
      "Draw neat diagrams where necessary.",
      "Use of calculator is permitted.",
    ],
    isActive: true,
    createdAt: new Date(),
    updatedAt: new Date(),
  },
];

// Mock Questions - Chemistry Class 12
const mockQuestions = [
  // ===== CHEMICAL KINETICS (Physical Chemistry) =====
  // MCQ - Remembering
  {
    _id: new mongoose.Types.ObjectId(),
    questionText:
      "What is the SI unit of rate constant for a zero-order reaction?",
    originalQuestionText:
      "What is the SI unit of rate constant for a zero-order reaction?",
    questionType: QuestionType.MCQ,
    subject: Subject.CHEMISTRY,
    classLevel: ClassLevel.TWELVE,
    chapter: "Chemical Kinetics",
    chapterNumber: 4,
    topic: "Rate Constant",
    topicCategory: TopicCategory.PHYSICAL_CHEMISTRY,
    difficulty: Difficulty.EASY,
    competencyLevel: CompetencyLevel.REMEMBERING,
    year: 2023,
    marks: 1,
    options: ["mol L⁻¹ s⁻¹", "s⁻¹", "L mol⁻¹ s⁻¹", "mol² L⁻² s⁻¹"],
    correctAnswer: "mol L⁻¹ s⁻¹",
    explanation:
      "For zero-order reaction: rate = k, so unit is concentration/time = mol L⁻¹ s⁻¹",
    markingScheme: "1 mark for correct option",
    createdBy: mockUserId,
    isActive: true,
    usageCount: 0,
    tags: ["kinetics", "zero-order", "rate-constant"],
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    _id: new mongoose.Types.ObjectId(),
    questionText: "Which of these is a first-order reaction?",
    originalQuestionText: "Which of these is a first-order reaction?",
    questionType: QuestionType.MCQ,
    subject: Subject.CHEMISTRY,
    classLevel: ClassLevel.TWELVE,
    chapter: "Chemical Kinetics",
    chapterNumber: 4,
    topic: "Order of Reaction",
    topicCategory: TopicCategory.PHYSICAL_CHEMISTRY,
    difficulty: Difficulty.EASY,
    competencyLevel: CompetencyLevel.REMEMBERING,
    year: 2022,
    marks: 1,
    options: [
      "Hydrolysis of sucrose",
      "Decomposition of N₂O₅",
      "Formation of HI",
      "Hydrogenation of ethene",
    ],
    correctAnswer: "Decomposition of N₂O₅",
    explanation:
      "Decomposition of N₂O₅ → 2NO₂ + ½O₂ is a well-known first-order reaction.",
    createdBy: mockUserId,
    isActive: true,
    usageCount: 0,
    tags: ["kinetics", "first-order", "decomposition"],
  },

  // MCQ - Understanding
  {
    _id: new mongoose.Types.ObjectId(),
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
    year: 2023,
    marks: 1,
    options: ["Concentration", "Temperature", "Pressure", "Volume"],
    correctAnswer: "Temperature",
    explanation:
      "Rate constant (k) depends on temperature according to Arrhenius equation: k = Ae^(-Ea/RT)",
    createdBy: mockUserId,
    isActive: true,
    usageCount: 0,
    tags: ["kinetics", "arrhenius", "temperature"],
  },

  // Short Answer Questions
  {
    _id: new mongoose.Types.ObjectId(),
    questionText: "Define activation energy. How does it affect reaction rate?",
    originalQuestionText:
      "Define activation energy. How does it affect reaction rate?",
    questionType: QuestionType.SHORT_ANSWER,
    subject: Subject.CHEMISTRY,
    classLevel: ClassLevel.TWELVE,
    chapter: "Chemical Kinetics",
    chapterNumber: 4,
    topic: "Activation Energy",
    topicCategory: TopicCategory.PHYSICAL_CHEMISTRY,
    difficulty: Difficulty.MEDIUM,
    competencyLevel: CompetencyLevel.UNDERSTANDING,
    year: 2022,
    marks: 5,
    correctAnswer:
      "Activation energy is the minimum energy required for a reaction to occur. Higher activation energy means slower reaction rate.",
    explanation:
      "According to Arrhenius equation, rate constant decreases exponentially with increasing activation energy.",
    markingScheme: "2 marks for definition + 3 marks for explanation",
    createdBy: mockUserId,
    isActive: true,
    usageCount: 0,
    tags: ["kinetics", "activation-energy", "arrhenius"],
  },

  // Long Answer Question
  {
    _id: new mongoose.Types.ObjectId(),
    questionText:
      "Derive integrated rate equation for first-order reaction and show that half-life is independent of initial concentration.",
    originalQuestionText:
      "Derive integrated rate equation for first-order reaction and show that half-life is independent of initial concentration.",
    questionType: QuestionType.LONG_ANSWER,
    subject: Subject.CHEMISTRY,
    classLevel: ClassLevel.TWELVE,
    chapter: "Chemical Kinetics",
    chapterNumber: 4,
    topic: "First Order Kinetics",
    topicCategory: TopicCategory.PHYSICAL_CHEMISTRY,
    difficulty: Difficulty.HARD,
    competencyLevel: CompetencyLevel.APPLYING,
    year: 2021,
    marks: 8,
    correctAnswer:
      "For first-order: rate = -d[A]/dt = k[A]. Integrating: ln[A] = -kt + ln[A]₀. At t₁/₂, [A] = [A]₀/2, so t₁/₂ = ln2/k = 0.693/k (independent of [A]₀).",
    explanation:
      "The derivation involves separation of variables and definite integration.",
    markingScheme:
      "3 marks derivation + 3 marks half-life proof + 2 marks conclusion",
    createdBy: mockUserId,
    isActive: true,
    usageCount: 0,
    tags: ["kinetics", "first-order", "integration", "half-life"],
  },

  // ===== ELECTROCHEMISTRY =====
  {
    _id: new mongoose.Types.ObjectId(),
    questionText:
      "What is standard hydrogen electrode (SHE)? Why is its potential taken as zero?",
    originalQuestionText:
      "What is standard hydrogen electrode (SHE)? Why is its potential taken as zero?",
    questionType: QuestionType.SHORT_ANSWER,
    subject: Subject.CHEMISTRY,
    classLevel: ClassLevel.TWELVE,
    chapter: "Electrochemistry",
    chapterNumber: 3,
    topic: "Standard Electrode Potential",
    topicCategory: TopicCategory.PHYSICAL_CHEMISTRY,
    difficulty: Difficulty.MEDIUM,
    competencyLevel: CompetencyLevel.UNDERSTANDING,
    year: 2023,
    marks: 5,
    correctAnswer:
      "SHE is reference electrode with Pt foil in 1M H⁺ solution at 1 atm H₂ gas. Its potential is arbitrarily taken as zero for comparison of other electrodes.",
    explanation:
      "SHE serves as universal reference point in electrochemical series.",
    createdBy: mockUserId,
    isActive: true,
    usageCount: 0,
    tags: ["electrochemistry", "she", "electrode-potential"],
  },

  // ===== ORGANIC CHEMISTRY =====
  {
    _id: new mongoose.Types.ObjectId(),
    questionText: "What is Markovnikov's rule? Give example.",
    originalQuestionText: "What is Markovnikov's rule? Give example.",
    questionType: QuestionType.SHORT_ANSWER,
    subject: Subject.CHEMISTRY,
    classLevel: ClassLevel.TWELVE,
    chapter: "Hydrocarbons",
    chapterNumber: 7,
    topic: "Markovnikov Rule",
    topicCategory: TopicCategory.ORGANIC_CHEMISTRY,
    difficulty: Difficulty.MEDIUM,
    competencyLevel: CompetencyLevel.UNDERSTANDING,
    year: 2022,
    marks: 5,
    correctAnswer:
      "In addition of unsymmetrical reagent to unsymmetrical alkene, negative part adds to carbon with fewer hydrogen atoms. Example: HBr to propene gives 2-bromopropane.",
    explanation: "Based on stability of carbocation intermediate.",
    createdBy: mockUserId,
    isActive: true,
    usageCount: 0,
    tags: ["organic", "markovnikov", "addition"],
  },

  // ===== INORGANIC CHEMISTRY =====
  {
    _id: new mongoose.Types.ObjectId(),
    questionText: "What is lanthanide contraction? Give its consequences.",
    originalQuestionText:
      "What is lanthanide contraction? Give its consequences.",
    questionType: QuestionType.LONG_ANSWER,
    subject: Subject.CHEMISTRY,
    classLevel: ClassLevel.TWELVE,
    chapter: "d and f Block Elements",
    chapterNumber: 8,
    topic: "Lanthanide Contraction",
    topicCategory: TopicCategory.INORGANIC_CHEMISTRY,
    difficulty: Difficulty.HARD,
    competencyLevel: CompetencyLevel.HIGHER_ABILITY,
    year: 2021,
    marks: 8,
    correctAnswer:
      "Gradual decrease in atomic/ionic radii of lanthanides due to poor shielding of 4f electrons. Consequences: similar size of post-lanthanides, difficulty in separation, similar chemical properties.",
    explanation:
      "Results from ineffective shielding of nuclear charge by 4f electrons.",
    createdBy: mockUserId,
    isActive: true,
    usageCount: 0,
    tags: ["inorganic", "lanthanide", "contraction", "periodic-table"],
  },

  // ===== APPLIED CHEMISTRY =====
  {
    _id: new mongoose.Types.ObjectId(),
    questionText: "What is cement? List its main ingredients.",
    originalQuestionText: "What is cement? List its main ingredients.",
    questionType: QuestionType.SHORT_ANSWER,
    subject: Subject.CHEMISTRY,
    classLevel: ClassLevel.TWELVE,
    chapter: "Chemistry in Everyday Life",
    chapterNumber: 16,
    topic: "Cement",
    topicCategory: TopicCategory.APPLIED_CHEMISTRY,
    difficulty: Difficulty.EASY,
    competencyLevel: CompetencyLevel.REMEMBERING,
    year: 2023,
    marks: 5,
    correctAnswer:
      "Cement is binding material used in construction. Main ingredients: limestone (CaCO₃), clay (SiO₂ + Al₂O₃), gypsum (CaSO₄·2H₂O).",
    explanation: "Portland cement is most common type.",
    createdBy: mockUserId,
    isActive: true,
    usageCount: 0,
    tags: ["applied", "cement", "construction", "materials"],
  },

  // Add more mock questions for variety (total 30+ questions)
  ...Array.from({ length: 25 }).map((_, i) => ({
    _id: new mongoose.Types.ObjectId(),
    questionText: `Sample Chemistry Question ${i + 1} on ${
      [
        "Chemical Kinetics",
        "Electrochemistry",
        "Organic Compounds",
        "Transition Metals",
      ][i % 4]
    }`,
    originalQuestionText: `Sample Chemistry Question ${i + 1}`,
    questionType: [
      QuestionType.MCQ,
      QuestionType.SHORT_ANSWER,
      QuestionType.LONG_ANSWER,
    ][i % 3],
    subject: Subject.CHEMISTRY,
    classLevel: ClassLevel.TWELVE,
    chapter: [
      "Chemical Kinetics",
      "Electrochemistry",
      "Hydrocarbons",
      "d and f Block Elements",
    ][i % 4],
    chapterNumber: [4, 3, 7, 8][i % 4],
    topic: ["Rate", "Electrode", "Reaction", "Elements"][i % 4],
    topicCategory: [
      TopicCategory.PHYSICAL_CHEMISTRY,
      TopicCategory.PHYSICAL_CHEMISTRY,
      TopicCategory.ORGANIC_CHEMISTRY,
      TopicCategory.INORGANIC_CHEMISTRY,
    ][i % 4],
    difficulty: [Difficulty.EASY, Difficulty.MEDIUM, Difficulty.HARD][i % 3],
    competencyLevel: [
      CompetencyLevel.REMEMBERING,
      CompetencyLevel.UNDERSTANDING,
      CompetencyLevel.APPLYING,
      CompetencyLevel.HIGHER_ABILITY,
    ][i % 4],
    year: 2020 + (i % 4),
    marks: [1, 5, 8][i % 3],
    options:
      i % 3 === 0
        ? ["Option A", "Option B", "Option C", "Option D"]
        : undefined,
    correctAnswer: `Correct Answer ${i + 1}`,
    explanation: `Explanation for question ${i + 1}`,
    createdBy: mockUserId,
    isActive: true,
    usageCount: 0,
    tags: [`tag${i + 1}`, `chapter${i % 4}`, "chemistry"],
    createdAt: new Date(),
    updatedAt: new Date(),
  })),
];

async function seedMockData() {
  try {
    // Connect to MongoDB
    await mongoose.connect(config.MONGO_URI);
    console.log("✅ Connected to MongoDB");

    // Clear existing data
    console.log("🗑️  Clearing existing data...");
    await QuestionModel.deleteMany({});
    await PaperPatternModel.deleteMany({});
    await GeneratedPaperModel.deleteMany({});
    console.log("✅ Cleared all collections");

    // Seed Paper Patterns
    console.log("📄 Seeding paper patterns...");
    await PaperPatternModel.insertMany(mockPaperPatterns);
    console.log(`✅ Inserted ${mockPaperPatterns.length} paper patterns`);

    // Seed Questions
    console.log("❓ Seeding questions...");
    await QuestionModel.insertMany(mockQuestions);
    console.log(`✅ Inserted ${mockQuestions.length} questions`);

    // Display summary
    console.log("\n📊 DATABASE SUMMARY:");
    console.log("===================");

    const patternCount = await PaperPatternModel.countDocuments();
    console.log(`📄 Paper Patterns: ${patternCount}`);

    const questionCount = await QuestionModel.countDocuments();
    console.log(`❓ Total Questions: ${questionCount}`);

    // Question breakdown
    const breakdown = await QuestionModel.aggregate([
      {
        $group: {
          _id: {
            subject: "$subject",
            questionType: "$questionType",
            marks: "$marks",
          },
          count: { $sum: 1 },
        },
      },
      { $sort: { "_id.marks": 1 } },
    ]);

    console.log("\n📋 Question Breakdown:");
    breakdown.forEach((item) => {
      console.log(
        `   - ${item._id.subject} | ${item._id.questionType} (${item._id.marks} marks): ${item.count} questions`
      );
    });

    // List available chapters
    const chapters = await QuestionModel.distinct("chapter");
    console.log("\n📚 Available Chapters:");
    chapters.forEach((chapter) => console.log(`   - ${chapter}`));

    console.log("\n🎉 Mock data seeded successfully!");
    console.log("\n🔗 You can now test these API endpoints:");
    console.log(
      "   1. GET  /api/v1/papers/filters/available?subject=chemistry&classLevel=12"
    );
    console.log("   2. POST /api/v1/papers/generate");
    console.log("   3. GET  /api/v1/papers/{paperId}");
    console.log("   4. GET  /api/v1/papers/{paperId}/pdf");

    process.exit(0);
  } catch (error) {
    console.error("❌ Error seeding mock data:", error);
    process.exit(1);
  }
}

seedMockData();
