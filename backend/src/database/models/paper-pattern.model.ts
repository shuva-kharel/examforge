import mongoose, { Document, Schema } from "mongoose";
import {
  QuestionType,
  Subject,
  TopicCategory,
  CompetencyLevel,
} from "./question.model";

export interface PaperPatternDocument extends Document {
  name: string;
  subject: Subject;
  classLevel: string;
  totalMarks: number;
  totalQuestions: number;
  duration: number; // in minutes
  sections: {
    name: string;
    description?: string;
    questionType: QuestionType;
    marksPerQuestion: number;
    numberOfQuestions: number;
    totalMarks: number;
    topicDistribution?: {
      topicCategory: TopicCategory;
      marks: number;
      questions: number;
    }[];
    competencyDistribution?: {
      competencyLevel: CompetencyLevel;
      marks: number;
      questions: number;
    }[];
  }[];
  instructions: string[];
  isActive: boolean;
}

const paperPatternSchema = new Schema<PaperPatternDocument>(
  {
    name: {
      type: String,
      required: true,
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
    sections: [
      {
        name: {
          type: String,
          required: true,
        },
        description: String,
        questionType: {
          type: String,
          enum: Object.values(QuestionType),
          required: true,
        },
        marksPerQuestion: {
          type: Number,
          required: true,
        },
        numberOfQuestions: {
          type: Number,
          required: true,
        },
        totalMarks: {
          type: Number,
          required: true,
        },
        topicDistribution: [
          {
            topicCategory: {
              type: String,
              enum: Object.values(TopicCategory),
            },
            marks: Number,
            questions: Number,
          },
        ],
        competencyDistribution: [
          {
            competencyLevel: {
              type: String,
              enum: Object.values(CompetencyLevel),
            },
            marks: Number,
            questions: Number,
          },
        ],
      },
    ],
    instructions: [
      {
        type: String,
      },
    ],
    isActive: {
      type: Boolean,
      default: true,
    },
  },
  {
    timestamps: true,
  }
);

const PaperPatternModel = mongoose.model<PaperPatternDocument>(
  "PaperPattern",
  paperPatternSchema
);
export default PaperPatternModel;
