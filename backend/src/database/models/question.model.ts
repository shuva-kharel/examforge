import mongoose, { Document, Schema } from "mongoose";

export enum QuestionType {
  MCQ = "mcq",
  SHORT_ANSWER = "short_answer",
  LONG_ANSWER = "long_answer",
}

export enum Subject {
  PHYSICS = "physics",
  CHEMISTRY = "chemistry",
  BIOLOGY = "biology",
  MATH = "math",
  ENGLISH = "english",
}

export enum ClassLevel {
  ELEVEN = "11",
  TWELVE = "12",
}

export enum Difficulty {
  EASY = "easy",
  MEDIUM = "medium",
  HARD = "hard",
}

export enum CompetencyLevel {
  REMEMBERING = "remembering",
  UNDERSTANDING = "understanding",
  APPLYING = "applying",
  HIGHER_ABILITY = "higher_ability",
}

export enum TopicCategory {
  PHYSICAL_CHEMISTRY = "physical_chemistry",
  INORGANIC_CHEMISTRY = "inorganic_chemistry",
  ORGANIC_CHEMISTRY = "organic_chemistry",
  APPLIED_CHEMISTRY = "applied_chemistry",
}

export interface QuestionDocument extends Document {
  questionText: string;
  originalQuestionText: string;
  translatedQuestionText?: string;
  questionType: QuestionType;
  subject: Subject;
  classLevel: ClassLevel;
  chapter: string;
  chapterNumber: number;
  topic?: string;
  topicCategory?: TopicCategory;
  difficulty: Difficulty;
  competencyLevel: CompetencyLevel;
  year: number;
  marks: number;
  options?: string[];
  correctAnswer: string;
  explanation?: string;
  markingScheme?: string;
  answerTips?: string;
  imageUrl?: string;
  diagramUrl?: string;
  createdBy: mongoose.Types.ObjectId;
  isActive: boolean;
  usageCount: number;
  lastUsed: Date;
  tags: string[];
  metadata: {
    nepaliVersion?: string;
    bloomLevel?: number;
    timeEstimate?: number;
  };
}

const questionSchema = new Schema<QuestionDocument>(
  {
    questionText: {
      type: String,
      required: true,
      index: true,
    },
    originalQuestionText: {
      type: String,
      required: true,
    },
    translatedQuestionText: {
      type: String,
    },
    questionType: {
      type: String,
      enum: Object.values(QuestionType),
      required: true,
      index: true,
    },
    subject: {
      type: String,
      enum: Object.values(Subject),
      required: true,
      index: true,
    },
    classLevel: {
      type: String,
      enum: Object.values(ClassLevel),
      required: true,
      index: true,
    },
    chapter: {
      type: String,
      required: true,
      index: true,
    },
    chapterNumber: {
      type: Number,
      required: true,
    },
    topic: {
      type: String,
    },
    topicCategory: {
      type: String,
      enum: Object.values(TopicCategory),
    },
    difficulty: {
      type: String,
      enum: Object.values(Difficulty),
      required: true,
      index: true,
    },
    competencyLevel: {
      type: String,
      enum: Object.values(CompetencyLevel),
      required: true,
      index: true,
    },
    year: {
      type: Number,
      required: true,
      index: true,
    },
    marks: {
      type: Number,
      required: true,
    },
    options: {
      type: [String],
      validate: {
        validator: function (this: QuestionDocument, options: string[]) {
          return (
            this.questionType !== QuestionType.MCQ ||
            (options && options.length >= 2)
          );
        },
        message: "MCQ questions must have at least 2 options",
      },
    },
    correctAnswer: {
      type: String,
      required: true,
    },
    explanation: {
      type: String,
    },
    markingScheme: {
      type: String,
    },
    answerTips: {
      type: String,
    },
    imageUrl: {
      type: String,
    },
    diagramUrl: {
      type: String,
    },
    createdBy: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    isActive: {
      type: Boolean,
      default: true,
    },
    usageCount: {
      type: Number,
      default: 0,
    },
    lastUsed: {
      type: Date,
      default: null,
    },
    tags: {
      type: [String],
      default: [],
      index: true,
    },
    metadata: {
      nepaliVersion: String,
      bloomLevel: Number,
      timeEstimate: Number,
    },
  },
  {
    timestamps: true,
  }
);

// Create indexes separately
questionSchema.index({ subject: 1, classLevel: 1, chapter: 1 });
questionSchema.index({ subject: 1, classLevel: 1, questionType: 1 });
questionSchema.index({ subject: 1, competencyLevel: 1, difficulty: 1 });
questionSchema.index({ topicCategory: 1, questionType: 1 });
questionSchema.index({ questionText: "text", tags: "text" });

// Update usage count when question is used
questionSchema.methods.incrementUsage = async function () {
  this.usageCount += 1;
  this.lastUsed = new Date();
  return await this.save();
};

const QuestionModel = mongoose.model<QuestionDocument>(
  "Question",
  questionSchema
);
export default QuestionModel;
