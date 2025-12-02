// seed-paper-patterns.ts - Fixed version
import mongoose from "mongoose";
import PaperPatternModel from "../src/database/models/paper-pattern.model";
import {
  Subject,
  QuestionType,
  TopicCategory,
  CompetencyLevel,
} from "../src/database/models/question.model";
import { config } from "../src/config/app.config";

const chemistryPattern = {
  name: "NEB Chemistry Grade 12 - Model Question Pattern",
  subject: Subject.CHEMISTRY,
  classLevel: "12",
  totalMarks: 75,
  totalQuestions: 22,
  duration: 180, // 3 hours
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
      competencyDistribution: [
        { competencyLevel: CompetencyLevel.REMEMBERING, questions: 2 },
        { competencyLevel: CompetencyLevel.UNDERSTANDING, questions: 1 },
        { competencyLevel: CompetencyLevel.APPLYING, questions: 2 },
        { competencyLevel: CompetencyLevel.HIGHER_ABILITY, questions: 3 },
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
      competencyDistribution: [
        { competencyLevel: CompetencyLevel.UNDERSTANDING, questions: 1 },
        { competencyLevel: CompetencyLevel.APPLYING, questions: 1 },
        { competencyLevel: CompetencyLevel.HIGHER_ABILITY, questions: 1 },
      ],
    },
  ],
  instructions: [
    "Attempt all questions.",
    "The figures in the margin indicate full marks.",
    "Write answers to the questions in sequence.",
    "Draw neat and labeled diagrams wherever necessary.",
    "Give suitable examples and chemical equations wherever required.",
    "Use of simple calculator is permitted.",
  ],
  isActive: true,
};

// Run this function to seed the database
async function seedPaperPatterns() {
  try {
    console.log("🚀 Starting Paper Pattern Seeding...");
    console.log("===================================\n");

    console.log("🔗 Connecting to MongoDB...");
    await mongoose.connect(config.MONGO_URI);
    console.log(`✅ Connected to MongoDB: ${config.MONGO_URI}`);

    // Remove existing patterns
    console.log("🧹 Cleaning up existing patterns...");
    const beforeDelete = await PaperPatternModel.countDocuments();
    const deleteResult = await PaperPatternModel.deleteMany({});
    console.log(
      `✅ Removed ${deleteResult.deletedCount} patterns (had ${beforeDelete} before)\n`
    );

    // Create new pattern
    console.log("🌱 Creating new paper pattern...");
    const startTime = Date.now();
    const createdPattern = await PaperPatternModel.create(chemistryPattern);
    const creationTime = Date.now() - startTime;
    console.log(`✅ Pattern created in ${creationTime}ms\n`);

    // Retrieve with full details
    console.log("🔍 Retrieving seeded pattern...");
    const retrievedPattern = await PaperPatternModel.findById(
      createdPattern._id
    )
      .lean()
      .exec();

    // Check if pattern was retrieved
    if (!retrievedPattern) {
      throw new Error("Failed to retrieve created pattern from database");
    }

    // Display Results
    console.log("\n" + "=".repeat(60));
    console.log("📊 PAPER PATTERN SEEDING RESULTS");
    console.log("=".repeat(60));

    console.log(`\n📄 PATTERN DETAILS:`);
    console.log(`├─ 📌 ID: ${retrievedPattern._id}`);
    console.log(`├─ 📛 Name: ${retrievedPattern.name}`);
    console.log(
      `├─ 🧪 Subject: ${retrievedPattern.subject?.toUpperCase() || "N/A"}`
    );
    console.log(`├─ 🎓 Class: ${retrievedPattern.classLevel}`);
    console.log(`├─ 💯 Total Marks: ${retrievedPattern.totalMarks}`);
    console.log(`├─ ❓ Total Questions: ${retrievedPattern.totalQuestions}`);
    console.log(
      `└─ ⏱️  Duration: ${retrievedPattern.duration} minutes (${
        retrievedPattern.duration / 60
      } hrs)`
    );

    console.log(`\n📋 SECTIONS (${retrievedPattern.sections?.length || 0}):`);

    if (!retrievedPattern.sections || retrievedPattern.sections.length === 0) {
      console.log("   ⚠️  No sections found!");
    } else {
      let totalSectionMarks = 0;
      let totalSectionQuestions = 0;

      retrievedPattern.sections.forEach((section: any, index: number) => {
        totalSectionMarks += section.totalMarks || 0;
        totalSectionQuestions += section.numberOfQuestions || 0;

        console.log(
          `\n   ${index + 1}. ${
            section.name?.toUpperCase() || "Unnamed Section"
          }`
        );
        console.log(`   ${"─".repeat(50)}`);
        console.log(`   ├─ 📝 Type: ${section.questionType || "N/A"}`);
        console.log(`   ├─ ❓ Questions: ${section.numberOfQuestions || 0}`);
        console.log(`   ├─ ⭐ Marks per Q: ${section.marksPerQuestion || 0}`);
        console.log(`   └─ 💯 Total Marks: ${section.totalMarks || 0}`);

        if (section.topicDistribution?.length) {
          console.log(`   ├─ 📍 TOPIC DISTRIBUTION:`);
          section.topicDistribution.forEach((topic: any, idx: number) => {
            const isLastTopic = idx === section.topicDistribution.length - 1;
            const prefix = isLastTopic ? "   │    └─ " : "   │    ├─ ";
            console.log(
              `${prefix} ${topic.topicCategory || "N/A"}: ${
                topic.questions || 0
              } Qs (${topic.marks || 0} M)`
            );
          });
        }

        if (section.competencyDistribution?.length) {
          console.log(`   └─ 🎯 COMPETENCY DISTRIBUTION:`);
          section.competencyDistribution.forEach((comp: any, idx: number) => {
            const isLast = idx === section.competencyDistribution.length - 1;
            const prefix = isLast ? "        └─ " : "        ├─ ";
            console.log(
              `${prefix} ${comp.competencyLevel || "N/A"}: ${
                comp.questions || 0
              } Qs`
            );
          });
        }
      });

      // Validation
      console.log(`\n✅ VALIDATION CHECK:`);
      console.log(
        `├─ 🔢 Section Marks Sum: ${totalSectionMarks} (Expected: ${retrievedPattern.totalMarks})`
      );
      console.log(
        `├─ 🔢 Section Questions Sum: ${totalSectionQuestions} (Expected: ${retrievedPattern.totalQuestions})`
      );

      const marksMatch = totalSectionMarks === retrievedPattern.totalMarks;
      const questionsMatch =
        totalSectionQuestions === retrievedPattern.totalQuestions;

      console.log(`├─ 📊 Marks Match: ${marksMatch ? "✓ PASS" : "✗ FAIL"}`);
      console.log(
        `└─ 📊 Questions Match: ${questionsMatch ? "✓ PASS" : "✗ FAIL"}`
      );

      if (!marksMatch || !questionsMatch) {
        console.log(`\n⚠️  WARNING: Pattern validation failed!`);
        console.log(
          `   - Marks difference: ${Math.abs(
            totalSectionMarks - retrievedPattern.totalMarks
          )}`
        );
        console.log(
          `   - Questions difference: ${Math.abs(
            totalSectionQuestions - retrievedPattern.totalQuestions
          )}`
        );
      }
    }

    console.log(
      `\n📝 INSTRUCTIONS (${retrievedPattern.instructions?.length || 0}):`
    );

    if (
      !retrievedPattern.instructions ||
      retrievedPattern.instructions.length === 0
    ) {
      console.log("   ⚠️  No instructions found!");
    } else {
      retrievedPattern.instructions.forEach(
        (instruction: string, index: number) => {
          const isLast = index === retrievedPattern.instructions.length - 1;
          const prefix = isLast ? "   └─ " : "   ├─ ";
          console.log(`${prefix} ${instruction}`);
        }
      );
    }

    // Database summary
    console.log(`\n🗄️  DATABASE SUMMARY:`);
    const finalCount = await PaperPatternModel.countDocuments();
    console.log(`├─ 📁 Patterns in DB: ${finalCount}`);
    console.log(
      `├─ 🟢 Is Active: ${retrievedPattern.isActive ? "✓ Yes" : "✗ No"}`
    );

    // Show mark distribution by topic if sections exist
    if (retrievedPattern.sections?.length) {
      console.log(`\n📊 MARK DISTRIBUTION BY TOPIC:`);
      const topicMarks: Record<string, number> = {};

      retrievedPattern.sections.forEach((section: any) => {
        if (section.topicDistribution) {
          section.topicDistribution.forEach((topic: any) => {
            const marks =
              topic.marks || topic.questions * (section.marksPerQuestion || 0);
            const topicName = topic.topicCategory || "unknown";
            topicMarks[topicName] = (topicMarks[topicName] || 0) + marks;
          });
        }
      });

      if (Object.keys(topicMarks).length === 0) {
        console.log("   ⚠️  No topic distribution found!");
      } else {
        Object.entries(topicMarks).forEach(([topic, marks], index, array) => {
          const isLast = index === array.length - 1;
          const prefix = isLast ? "   └─ " : "   ├─ ";
          const percentage = (
            (marks / retrievedPattern.totalMarks) *
            100
          ).toFixed(1);
          console.log(`${prefix} ${topic}: ${marks} marks (${percentage}%)`);
        });
      }
    }

    console.log("\n" + "=".repeat(60));
    console.log("🎉 PAPER PATTERN SEEDING COMPLETED SUCCESSFULLY!");
    console.log("=".repeat(60));

    // Show API endpoints
    console.log("\n🔗 API ENDPOINTS READY FOR TESTING:");
    console.log("├─ 📤 POST   /api/v1/papers/generate");
    console.log('│     Body: { "subject": "chemistry", "classLevel": "12" }');
    console.log(
      "├─ 📥 GET    /api/v1/papers/filters/available?subject=chemistry&classLevel=12"
    );
    console.log("├─ 👁️  GET    /api/v1/papers/{paperId}");
    console.log("└─ 📄 GET    /api/v1/papers/{paperId}/pdf");

    console.log("\n💡 NEXT STEPS:");
    console.log("├─ 1. Seed questions database with 'npm run seed:questions'");
    console.log("├─ 2. Test filters endpoint to verify data");
    console.log("└─ 3. Generate your first paper!");

    console.log(`\n⏰ Total seeding time: ${Date.now() - startTime}ms`);

    // Close connection
    await mongoose.disconnect();
    console.log("\n🔌 MongoDB connection closed.");

    process.exit(0);
  } catch (error: any) {
    console.error("\n❌ SEEDING FAILED!");
    console.error("=".repeat(30));
    console.error(`Error: ${error.message}`);

    if (error.code) {
      console.error(`Code: ${error.code}`);
    }

    if (error.stack) {
      console.error(`\nStack Trace:`);
      console.error(error.stack.split("\n").slice(0, 5).join("\n"));
    }

    // Close mongoose connection if open
    try {
      if (mongoose.connection.readyState === 1) {
        await mongoose.disconnect();
        console.log("\n🔌 MongoDB connection closed.");
      }
    } catch (disconnectError) {
      // Ignore disconnect errors
    }

    process.exit(1);
  }
}

seedPaperPatterns();
