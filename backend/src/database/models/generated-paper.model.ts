import mongoose, { Document, Schema } from "mongoose";
import { QuestionType, Subject } from "./question.model";

export interface GeneratedPaperDocument extends Document {
  userId: mongoose.Types.ObjectId;
  paperPatternId: mongoose.Types.ObjectId;
  subject: Subject;
  classLevel: string;
  title: string;
  generatedAt: Date;
  questions: Array<{
    questionId: mongoose.Types.ObjectId;
    sectionName: string;
    questionType: QuestionType;
    marks: number;
    order: number;
    topicCategory?: string;
    competencyLevel?: string;
    isTranslated: boolean;
  }>;
  totalMarks: number;
  totalQuestions: number;
  duration: number;
  filters: {
    chapters?: string[];
    difficulties?: string[];
    years?: number[];
    excludeUsed?: boolean;
    topicCategories?: string[];
    competencyLevels?: string[];
  };
  settings: {
    randomizeQuestions: boolean;
    includeMarkingScheme: boolean;
    includeAnswerTips: boolean;
    translateQuestions: boolean;
    language?: string;
  };
  downloadCount: number;
  lastDownloaded: Date;

  incrementDownload(): Promise<GeneratedPaperDocument>;
}

const generatedPaperSchema = new Schema<GeneratedPaperDocument>(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },
    paperPatternId: {
      type: Schema.Types.ObjectId,
      ref: "PaperPattern",
    },
    subject: {
      type: String,
      enum: Object.values(Subject),
      required: true,
    },
    classLevel: {
      type: String,
      required: true,
    },
    title: {
      type: String,
      required: true,
    },
    generatedAt: {
      type: Date,
      default: Date.now,
    },
    questions: [
      {
        questionId: {
          type: Schema.Types.ObjectId,
          ref: "Question",
          required: true,
        },
        sectionName: {
          type: String,
          required: true,
        },
        questionType: {
          type: String,
          enum: Object.values(QuestionType),
          required: true,
        },
        marks: {
          type: Number,
          required: true,
        },
        order: {
          type: Number,
          required: true,
        },
        topicCategory: String,
        competencyLevel: String,
        isTranslated: {
          type: Boolean,
          default: false,
        },
      },
    ],
    totalMarks: {
      type: Number,
      required: true,
    },
    totalQuestions: {
      type: Number,
      required: true,
    },
    duration: {
      type: Number,
      required: true,
    },
    filters: {
      chapters: [String],
      difficulties: [String],
      years: [Number],
      excludeUsed: Boolean,
      topicCategories: [String],
      competencyLevels: [String],
    },
    settings: {
      randomizeQuestions: {
        type: Boolean,
        default: true,
      },
      includeMarkingScheme: {
        type: Boolean,
        default: true,
      },
      includeAnswerTips: {
        type: Boolean,
        default: true,
      },
      translateQuestions: {
        type: Boolean,
        default: false,
      },
      language: String,
    },
    downloadCount: {
      type: Number,
      default: 0,
    },
    lastDownloaded: {
      type: Date,
    },
  },
  {
    timestamps: true,
  }
);

// Create indexes
generatedPaperSchema.index({ userId: 1, generatedAt: -1 });
generatedPaperSchema.index({ subject: 1, classLevel: 1 });
generatedPaperSchema.index({ "questions.questionId": 1 });

// Increment download count
generatedPaperSchema.methods.incrementDownload = async function () {
  try {
    this.downloadCount += 1;
    this.lastDownloaded = new Date();
    await this.save();
    return this;
  } catch (error) {
    throw error;
  }
};

const GeneratedPaperModel = mongoose.model<GeneratedPaperDocument>(
  "GeneratedPaper",
  generatedPaperSchema
);
export default GeneratedPaperModel;
