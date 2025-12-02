// services/paper.service.ts
import QuestionModel, {
  QuestionType,
  Subject,
  ClassLevel,
  TopicCategory,
  CompetencyLevel,
  Difficulty,
} from "../../database/models/question.model";
import PaperPatternModel from "../../database/models/paper-pattern.model";
import GeneratedPaperModel from "../../database/models/generated-paper.model";
import {
  BadRequestException,
  NotFoundException,
} from "../../common/utils/catch-errors";
import { GroqService } from "./groq.service";
import { PDFService } from "./pdf.service";
import { logger } from "../../common/utils/logger";

export interface GeneratePaperRequest {
  subject: Subject;
  classLevel: ClassLevel;
  chapters?: string[];
  difficulties?: Difficulty[];
  years?: number[];
  paperPatternId?: string;
  settings?: {
    randomizeQuestions?: boolean;
    includeMarkingScheme?: boolean;
    includeAnswerTips?: boolean;
    translateQuestions?: boolean;
    language?: string;
    preventMemorization?: boolean; // New: Rewrite questions to prevent memorization
    rewriteQuestions?: boolean; // Alias for preventMemorization
    excludeUsedQuestions?: boolean;
    generateExplanations?: boolean; // New: Generate answer explanations
    culturalAdaptation?: boolean; // New: Adapt to Nepali context
    batchProcessing?: boolean; // New: Process questions in batches
    cognitiveLevelAnalysis?: boolean; // New: Analyze cognitive levels
  };
}

export interface PaperSection {
  name: string;
  questionType: QuestionType;
  questions: any[];
  marksPerQuestion: number;
  totalMarks: number;
  metadata?: {
    cognitiveLevels?: string[];
    successRate?: number;
  };
}

export class PaperService {
  private groqService: GroqService;
  private pdfService: PDFService;

  constructor() {
    this.groqService = new GroqService();
    this.pdfService = new PDFService();

    // Test Groq connection
    this.testGroqConnection();
  }

  /**
   * Generate a new question paper based on filters and pattern
   */
  public async generatePaper(userId: string, request: GeneratePaperRequest) {
    logger.info(`📝 Starting paper generation for user ${userId}`);

    // Get paper pattern (default or specific)
    const paperPattern = await this.getPaperPattern(request);

    // Generate questions for each section
    const sections: PaperSection[] = [];
    const allQuestions: any[] = [];

    for (const section of paperPattern.sections) {
      logger.info(`📂 Generating section: ${section.name}`);

      const questions = await this.generateSectionQuestions({
        subject: request.subject,
        classLevel: request.classLevel,
        questionType: section.questionType,
        numberOfQuestions: section.numberOfQuestions,
        marksPerQuestion: section.marksPerQuestion,
        chapters: request.chapters,
        difficulties: request.difficulties,
        years: request.years,
        excludeUsed: request.settings?.excludeUsedQuestions,
        topicDistribution: section.topicDistribution,
        competencyDistribution: section.competencyDistribution,
      });

      const sectionData: PaperSection = {
        name: section.name,
        questionType: section.questionType,
        questions,
        marksPerQuestion: section.marksPerQuestion,
        totalMarks: section.totalMarks,
      };

      // Add cognitive level analysis if enabled
      if (request.settings?.cognitiveLevelAnalysis) {
        sectionData.metadata = {
          cognitiveLevels: questions.map((q) =>
            this.determineCognitiveLevel(q.questionText)
          ),
          successRate:
            questions.filter((q) => q.isActive).length / questions.length,
        };
      }

      sections.push(sectionData);
      allQuestions.push(...questions);
    }

    logger.info(
      `✅ Generated ${allQuestions.length} questions from ${sections.length} sections`
    );

    // Process questions based on settings
    await this.processQuestions(allQuestions, request);

    // Save generated paper
    const generatedPaper = await GeneratedPaperModel.create({
      userId,
      paperPatternId: paperPattern._id,
      subject: request.subject,
      classLevel: request.classLevel,
      title: this.generatePaperTitle(request),
      questions: this.mapQuestionsToPaper(allQuestions, paperPattern.sections),
      totalMarks: paperPattern.totalMarks,
      totalQuestions: paperPattern.totalQuestions,
      duration: paperPattern.duration,
      filters: {
        chapters: request.chapters,
        difficulties: request.difficulties,
        years: request.years,
        excludeUsed: request.settings?.excludeUsedQuestions,
      },
      settings: {
        ...request.settings,
        randomizeQuestions: request.settings?.randomizeQuestions ?? true,
        includeMarkingScheme: request.settings?.includeMarkingScheme ?? true,
        includeAnswerTips: request.settings?.includeAnswerTips ?? true,
        translateQuestions: request.settings?.translateQuestions ?? false,
        preventMemorization: request.settings?.preventMemorization ?? false,
        rewriteQuestions: request.settings?.rewriteQuestions ?? false,
        generateExplanations: request.settings?.generateExplanations ?? false,
        culturalAdaptation: request.settings?.culturalAdaptation ?? false,
        batchProcessing: request.settings?.batchProcessing ?? true,
        cognitiveLevelAnalysis:
          request.settings?.cognitiveLevelAnalysis ?? false,
      },
      metadata: {
        generatedAt: new Date(),
        apiUsed: "Groq",
        modelUsed: this.groqService.getAvailableModels()[0] || "unknown",
        processingTime: Date.now(), // Will be updated after processing
        questionsProcessed: allQuestions.length,
      },
    });

    logger.info(`📄 Paper generated for user ${userId}: ${generatedPaper._id}`);

    return {
      paper: generatedPaper,
      sections,
      instructions: paperPattern.instructions,
      statistics: {
        totalQuestions: allQuestions.length,
        totalMarks: paperPattern.totalMarks,
        sections: sections.length,
        processingFeatures: this.getProcessingFeatures(request.settings),
      },
    };
  }

  /**
   * Process questions based on settings
   */
  private async processQuestions(
    questions: any[],
    request: GeneratePaperRequest
  ) {
    const settings = request.settings || {};
    const startTime = Date.now();

    logger.info(`⚙️ Processing ${questions.length} questions with settings:`, {
      preventMemorization: settings.preventMemorization,
      translateQuestions: settings.translateQuestions,
      generateExplanations: settings.generateExplanations,
      culturalAdaptation: settings.culturalAdaptation,
    });

    // Store original questions
    questions.forEach((q) => {
      q.originalQuestionText = q.questionText;
      q.originalOptions = q.options ? [...q.options] : undefined;
      q.processingHistory = [];
    });

    const processingResults = {
      rewritten: 0,
      translated: 0,
      explained: 0,
      adapted: 0,
      failed: 0,
    };

    try {
      // 1. Prevent memorization / Rewrite questions
      const shouldRewrite =
        settings.preventMemorization || settings.rewriteQuestions;
      if (shouldRewrite) {
        const result = await this.rewriteQuestions(
          questions,
          request.subject,
          settings.batchProcessing
        );
        processingResults.rewritten = result.successCount;
        processingResults.failed += result.failCount;
      }

      // 2. Translate questions if requested
      if (settings.translateQuestions) {
        const result = await this.translateQuestions(
          questions,
          settings.language || "nepali",
          request.subject,
          settings.batchProcessing
        );
        processingResults.translated = result.successCount;
        processingResults.failed += result.failCount;
      }

      // 3. Generate explanations if requested
      if (settings.generateExplanations) {
        const result = await this.generateExplanations(
          questions,
          request.subject,
          settings.batchProcessing
        );
        processingResults.explained = result.successCount;
        processingResults.failed += result.failCount;
      }

      // 4. Cultural adaptation if requested
      if (settings.culturalAdaptation) {
        const result = await this.culturallyAdaptQuestions(
          questions,
          request.subject,
          settings.batchProcessing
        );
        processingResults.adapted = result.successCount;
        processingResults.failed += result.failCount;
      }

      // Update processing time
      const processingTime = Date.now() - startTime;

      logger.info(
        `📊 Processing completed in ${processingTime}ms:`,
        processingResults
      );

      // Update question metadata
      await this.updateQuestionMetadata(questions);
    } catch (error: any) {
      logger.error(`❌ Question processing failed: ${error.message}`);
      throw new BadRequestException(
        `Question processing failed: ${error.message}`
      );
    }
  }

  /**
   * Rewrite questions to prevent memorization (optimized)
   */
  private async rewriteQuestions(
    questions: any[],
    subject: string,
    batchProcessing: boolean = true
  ): Promise<{ successCount: number; failCount: number }> {
    logger.info(
      `🔄 Rewriting ${questions.length} questions to prevent memorization...`
    );

    let successCount = 0;
    let failCount = 0;

    if (batchProcessing && questions.length > 3) {
      // Process in batches
      const batchSize = 5;
      for (let i = 0; i < questions.length; i += batchSize) {
        const batch = questions.slice(i, i + batchSize);

        try {
          const promises = batch.map(async (question, batchIndex) => {
            const questionIndex = i + batchIndex + 1;
            try {
              logger.info(
                `   📝 Rewriting question ${questionIndex}/${
                  questions.length
                }: ${question.questionText.substring(0, 50)}...`
              );

              const rewrittenText = await this.groqService.paraphraseQuestion(
                question.questionText,
                subject
              );

              // Only update if we got a different response
              if (rewrittenText && rewrittenText !== question.questionText) {
                question.rewrittenQuestionText = rewrittenText;
                question.questionText = rewrittenText; // Use rewritten version
                question.processingHistory.push({
                  action: "rewrite",
                  timestamp: new Date(),
                  status: "success",
                  cognitiveLevel: this.determineCognitiveLevel(rewrittenText),
                });

                // Add metadata
                question.metadata = {
                  ...question.metadata,
                  paraphrased: true,
                  paraphrasedAt: new Date(),
                  originalCognitiveLevel: this.determineCognitiveLevel(
                    question.originalQuestionText
                  ),
                  newCognitiveLevel:
                    this.determineCognitiveLevel(rewrittenText),
                };

                successCount++;

                // Log first few for debugging
                if (questionIndex <= 3) {
                  logger.info(
                    `      Original: ${question.originalQuestionText.substring(
                      0,
                      40
                    )}...`
                  );
                  logger.info(
                    `      Rewritten: ${rewrittenText.substring(0, 40)}...`
                  );
                }
                return true;
              } else {
                failCount++;
                question.processingHistory.push({
                  action: "rewrite",
                  timestamp: new Date(),
                  status: "no_change",
                  message: "No significant changes made",
                });
                logger.warn(
                  `      No significant changes made to question ${questionIndex}`
                );
                return false;
              }
            } catch (error: any) {
              failCount++;
              question.processingHistory.push({
                action: "rewrite",
                timestamp: new Date(),
                status: "error",
                message: error.message,
              });
              logger.warn(
                `   ❌ Question ${questionIndex} rewrite failed: ${error.message}`
              );
              return false;
            }
          });

          await Promise.all(promises);

          // Small delay between batches to avoid rate limits
          if (i + batchSize < questions.length) {
            await new Promise((resolve) => setTimeout(resolve, 500));
          }
        } catch (error: any) {
          logger.error(`Batch rewrite failed: ${error.message}`);
          failCount += batch.length;
        }
      }
    } else {
      // Process sequentially (for small batches or when batchProcessing is false)
      for (const [index, question] of questions.entries()) {
        try {
          logger.info(
            `   📝 Rewriting question ${index + 1}/${
              questions.length
            }: ${question.questionText.substring(0, 50)}...`
          );

          const rewrittenText = await this.groqService.paraphraseQuestion(
            question.questionText,
            subject
          );

          if (rewrittenText && rewrittenText !== question.questionText) {
            question.rewrittenQuestionText = rewrittenText;
            question.questionText = rewrittenText;
            question.processingHistory.push({
              action: "rewrite",
              timestamp: new Date(),
              status: "success",
            });
            successCount++;

            if (index < 3) {
              logger.info(
                `      Original: ${question.originalQuestionText.substring(
                  0,
                  40
                )}...`
              );
              logger.info(
                `      Rewritten: ${rewrittenText.substring(0, 40)}...`
              );
            }
          } else {
            failCount++;
            logger.warn(
              `      No significant changes made to question ${index + 1}`
            );
          }
        } catch (error: any) {
          failCount++;
          logger.warn(
            `   ❌ Question ${index + 1} rewrite failed: ${error.message}`
          );
        }
      }
    }

    logger.info(
      `📊 Question rewriting: ${successCount} rewritten, ${failCount} failed/unchanged`
    );

    return { successCount, failCount };
  }

  /**
   * Translate questions using Groq (optimized)
   */
  private async translateQuestions(
    questions: any[],
    targetLanguage: string,
    subject: string,
    batchProcessing: boolean = true
  ): Promise<{ successCount: number; failCount: number }> {
    try {
      logger.info(
        `🌐 Translating ${questions.length} questions to ${targetLanguage}...`
      );

      let successCount = 0;
      let failCount = 0;

      if (batchProcessing) {
        // Process translations in batches
        const batchSize = 3;
        const batches = [];

        for (let i = 0; i < questions.length; i += batchSize) {
          batches.push(questions.slice(i, i + batchSize));
        }

        for (const [batchIndex, batch] of batches.entries()) {
          try {
            const promises = batch.map(async (question) => {
              try {
                // Use the current text (could be original or rewritten)
                const textToTranslate = question.questionText;

                const translatedText = await this.groqService.translateAndAdapt(
                  textToTranslate,
                  targetLanguage,
                  subject
                );

                if (translatedText && translatedText !== textToTranslate) {
                  question.translatedQuestionText = translatedText;
                  question.processingHistory.push({
                    action: "translate",
                    timestamp: new Date(),
                    status: "success",
                    language: targetLanguage,
                  });

                  successCount++;

                  // Translate options if MCQ
                  if (
                    question.questionType === QuestionType.MCQ &&
                    question.options
                  ) {
                    question.translatedOptions = await Promise.all(
                      question.options.map(async (option: string) => {
                        try {
                          return await this.groqService.translateAndAdapt(
                            option,
                            targetLanguage,
                            subject
                          );
                        } catch {
                          return option; // Keep original if translation fails
                        }
                      })
                    );
                  }

                  // Update in database (optional)
                  await QuestionModel.findByIdAndUpdate(question._id, {
                    translatedQuestionText: translatedText,
                    "metadata.nepaliVersion":
                      targetLanguage === "nepali" ? translatedText : undefined,
                  });

                  return true;
                } else {
                  failCount++;
                  return false;
                }
              } catch (error: any) {
                failCount++;
                question.processingHistory.push({
                  action: "translate",
                  timestamp: new Date(),
                  status: "error",
                  message: error.message,
                });
                return false;
              }
            });

            await Promise.all(promises);

            // Rate limiting delay
            if (batchIndex < batches.length - 1) {
              await new Promise((resolve) => setTimeout(resolve, 300));
            }
          } catch (error: any) {
            logger.error(
              `Translation batch ${batchIndex + 1} failed: ${error.message}`
            );
            failCount += batch.length;
          }
        }
      } else {
        // Sequential processing
        for (const [index, question] of questions.entries()) {
          try {
            logger.info(
              `   🔤 Translating question ${index + 1}/${questions.length}`
            );

            const textToTranslate = question.questionText;

            const translatedText = await this.groqService.translateAndAdapt(
              textToTranslate,
              targetLanguage,
              subject
            );

            if (translatedText && translatedText !== textToTranslate) {
              question.translatedQuestionText = translatedText;
              successCount++;

              if (
                question.questionType === QuestionType.MCQ &&
                question.options
              ) {
                question.translatedOptions = await Promise.all(
                  question.options.map(async (option: string) => {
                    try {
                      return await this.groqService.translateAndAdapt(
                        option,
                        targetLanguage,
                        subject
                      );
                    } catch {
                      return option;
                    }
                  })
                );
              }

              await QuestionModel.findByIdAndUpdate(question._id, {
                translatedQuestionText: translatedText,
                "metadata.nepaliVersion":
                  targetLanguage === "nepali" ? translatedText : undefined,
              });
            } else {
              failCount++;
            }
          } catch (error: any) {
            failCount++;
            logger.warn(
              `   ❌ Translation failed for question ${index + 1}: ${
                error.message
              }`
            );
          }
        }
      }

      logger.info(
        `📊 Translation: ${successCount} successful, ${failCount} failed`
      );

      return { successCount, failCount };
    } catch (error: any) {
      logger.error(`❌ Translation process failed: ${error.message}`);
      return { successCount: 0, failCount: questions.length };
    }
  }

  /**
   * Generate explanations for questions (optimized)
   */
  private async generateExplanations(
    questions: any[],
    subject: string,
    batchProcessing: boolean = true
  ): Promise<{ successCount: number; failCount: number }> {
    logger.info(
      `💡 Generating explanations for ${questions.length} questions...`
    );

    let successCount = 0;
    let failCount = 0;

    // Filter questions that need explanations
    const questionsToExplain = questions.filter((q) => !q.explanation);

    if (batchProcessing && questionsToExplain.length > 2) {
      // Batch processing for explanations
      const batchSize = 3;
      for (let i = 0; i < questionsToExplain.length; i += batchSize) {
        const batch = questionsToExplain.slice(i, i + batchSize);

        try {
          const promises = batch.map(async (question) => {
            try {
              const explanation = await this.groqService.generateExplanation(
                question.questionText,
                question.correctAnswer,
                subject
              );

              if (explanation && explanation.trim()) {
                question.aiGeneratedExplanation = explanation;
                question.processingHistory.push({
                  action: "explanation",
                  timestamp: new Date(),
                  status: "success",
                });

                // Update in database
                await QuestionModel.findByIdAndUpdate(question._id, {
                  explanation: explanation,
                });

                successCount++;
                return true;
              }
              return false;
            } catch (error: any) {
              question.processingHistory.push({
                action: "explanation",
                timestamp: new Date(),
                status: "error",
                message: error.message,
              });
              failCount++;
              return false;
            }
          });

          await Promise.all(promises);

          // Rate limiting delay
          if (i + batchSize < questionsToExplain.length) {
            await new Promise((resolve) => setTimeout(resolve, 400));
          }
        } catch (error: any) {
          logger.error(`Explanation batch failed: ${error.message}`);
          failCount += batch.length;
        }
      }
    } else {
      // Sequential processing
      for (const [index, question] of questionsToExplain.entries()) {
        try {
          const explanation = await this.groqService.generateExplanation(
            question.questionText,
            question.correctAnswer,
            subject
          );

          if (explanation && explanation.trim()) {
            question.aiGeneratedExplanation = explanation;
            successCount++;

            await QuestionModel.findByIdAndUpdate(question._id, {
              explanation: explanation,
            });

            if (index < 2) {
              logger.info(
                `   ✅ Explanation generated for question ${index + 1}`
              );
            }
          }
        } catch (error: any) {
          failCount++;
          logger.warn(
            `   ❌ Explanation generation failed for question ${index + 1}: ${
              error.message
            }`
          );
        }
      }
    }

    return { successCount, failCount };
  }

  /**
   * Culturally adapt questions for Nepali context (optimized)
   */
  private async culturallyAdaptQuestions(
    questions: any[],
    subject: string,
    batchProcessing: boolean = true
  ): Promise<{ successCount: number; failCount: number }> {
    logger.info(`🎭 Culturally adapting ${questions.length} questions...`);

    let successCount = 0;
    let failCount = 0;

    if (batchProcessing && questions.length > 2) {
      // Batch processing for cultural adaptation
      const batchSize = 4;
      const batches = [];

      for (let i = 0; i < questions.length; i += batchSize) {
        batches.push(questions.slice(i, i + batchSize));
      }

      for (const [batchIndex, batch] of batches.entries()) {
        try {
          const promises = batch.map(async (question) => {
            try {
              const adaptedText = await this.groqService.translateAndAdapt(
                question.questionText,
                "nepali",
                subject
              );

              if (adaptedText && adaptedText !== question.questionText) {
                question.culturallyAdaptedText = adaptedText;
                question.processingHistory.push({
                  action: "cultural_adaptation",
                  timestamp: new Date(),
                  status: "success",
                });
                successCount++;
                return true;
              }
              return false;
            } catch (error: any) {
              question.processingHistory.push({
                action: "cultural_adaptation",
                timestamp: new Date(),
                status: "error",
                message: error.message,
              });
              failCount++;
              return false;
            }
          });

          await Promise.all(promises);

          // Rate limiting delay
          if (batchIndex < batches.length - 1) {
            await new Promise((resolve) => setTimeout(resolve, 300));
          }
        } catch (error: any) {
          logger.error(
            `Cultural adaptation batch ${batchIndex + 1} failed: ${
              error.message
            }`
          );
          failCount += batch.length;
        }
      }
    } else {
      // Sequential processing
      for (const [index, question] of questions.entries()) {
        try {
          const adaptedText = await this.groqService.translateAndAdapt(
            question.questionText,
            "nepali",
            subject
          );

          if (adaptedText && adaptedText !== question.questionText) {
            question.culturallyAdaptedText = adaptedText;
            successCount++;

            if (index < 2) {
              logger.info(`   ✅ Culturally adapted question ${index + 1}`);
            }
          }
        } catch (error: any) {
          failCount++;
          logger.warn(
            `   ❌ Cultural adaptation failed for question ${index + 1}: ${
              error.message
            }`
          );
        }
      }
    }

    return { successCount, failCount };
  }

  /**
   * Determine cognitive level of a question
   */
  private determineCognitiveLevel(question: string): string {
    const lowerQuestion = question.toLowerCase();

    // Bloom's Taxonomy levels
    const levels = {
      create: [
        "design",
        "create",
        "construct",
        "develop",
        "formulate",
        "plan",
        "propose",
      ],
      evaluate: [
        "evaluate",
        "judge",
        "critique",
        "justify",
        "recommend",
        "assess",
        "rate",
      ],
      analyze: [
        "analyze",
        "compare",
        "contrast",
        "differentiate",
        "examine",
        "investigate",
        "categorize",
      ],
      apply: [
        "apply",
        "use",
        "demonstrate",
        "calculate",
        "solve",
        "implement",
        "execute",
      ],
      understand: [
        "explain",
        "describe",
        "interpret",
        "summarize",
        "paraphrase",
        "classify",
        "discuss",
      ],
      remember: [
        "what is",
        "define",
        "list",
        "name",
        "identify",
        "recall",
        "state",
      ],
    };

    for (const [level, keywords] of Object.entries(levels)) {
      if (keywords.some((keyword) => lowerQuestion.includes(keyword))) {
        return level;
      }
    }

    return "remember"; // Default
  }

  /**
   * Generate questions for a specific section
   */
  private async generateSectionQuestions(params: {
    subject: Subject;
    classLevel: ClassLevel;
    questionType: QuestionType;
    numberOfQuestions: number;
    marksPerQuestion: number;
    chapters?: string[];
    difficulties?: Difficulty[];
    years?: number[];
    excludeUsed?: boolean;
    topicDistribution?: Array<{
      topicCategory: TopicCategory;
      questions: number;
    }>;
    competencyDistribution?: Array<{
      competencyLevel: CompetencyLevel;
      questions: number;
    }>;
  }) {
    const query: any = {
      subject: params.subject,
      classLevel: params.classLevel,
      questionType: params.questionType,
      marks: params.marksPerQuestion,
      isActive: true,
    };

    // Apply filters
    if (params.chapters?.length) {
      query.chapter = { $in: params.chapters };
    }

    if (params.difficulties?.length) {
      query.difficulty = { $in: params.difficulties };
    }

    if (params.years?.length) {
      query.year = { $in: params.years };
    }

    if (params.excludeUsed) {
      query.usageCount = 0;
    }

    // If topic distribution specified, we need to handle it differently
    if (params.topicDistribution?.length) {
      const topicQuestions: any[] = [];

      for (const topic of params.topicDistribution) {
        const topicQuery = { ...query, topicCategory: topic.topicCategory };
        const questions = await QuestionModel.aggregate([
          { $match: topicQuery },
          { $sample: { size: topic.questions } },
        ]);
        topicQuestions.push(...questions);
      }

      // If we still need more questions, get random ones without topic filter
      if (topicQuestions.length < params.numberOfQuestions) {
        const remaining = params.numberOfQuestions - topicQuestions.length;
        const additionalQuestions = await QuestionModel.aggregate([
          { $match: query },
          { $sample: { size: remaining } },
        ]);
        topicQuestions.push(...additionalQuestions);
      }

      return topicQuestions.slice(0, params.numberOfQuestions);
    }

    // For competency distribution
    if (params.competencyDistribution?.length) {
      const competencyQuestions: any[] = [];

      for (const competency of params.competencyDistribution) {
        const compQuery = {
          ...query,
          competencyLevel: competency.competencyLevel,
        };
        const questions = await QuestionModel.aggregate([
          { $match: compQuery },
          { $sample: { size: competency.questions } },
        ]);
        competencyQuestions.push(...questions);
      }

      if (competencyQuestions.length < params.numberOfQuestions) {
        const remaining = params.numberOfQuestions - competencyQuestions.length;
        const additionalQuestions = await QuestionModel.aggregate([
          { $match: query },
          { $sample: { size: remaining } },
        ]);
        competencyQuestions.push(...additionalQuestions);
      }

      return competencyQuestions.slice(0, params.numberOfQuestions);
    }

    // Simple random sampling if no distribution specified
    const questions = await QuestionModel.aggregate([
      { $match: query },
      { $sample: { size: params.numberOfQuestions } },
    ]);

    // If we don't have enough questions, fallback to less restrictive query
    if (questions.length < params.numberOfQuestions) {
      logger.warn(
        `⚠️ Insufficient questions found for ${params.subject} ${params.questionType}. Using fallback.`
      );

      // Remove some filters and try again
      const fallbackQuery = { ...query };
      delete fallbackQuery.difficulty;
      delete fallbackQuery.year;

      const fallbackQuestions = await QuestionModel.aggregate([
        { $match: fallbackQuery },
        { $sample: { size: params.numberOfQuestions } },
      ]);

      return fallbackQuestions;
    }

    // Update usage count for selected questions
    await Promise.all(
      questions.map((q: any) =>
        QuestionModel.findByIdAndUpdate(q._id, {
          $inc: { usageCount: 1 },
          $set: { lastUsed: new Date() },
        })
      )
    );

    return questions;
  }

  /**
   * Get paper pattern based on request
   */
  private async getPaperPattern(request: GeneratePaperRequest) {
    if (request.paperPatternId) {
      const pattern = await PaperPatternModel.findById(request.paperPatternId);
      if (!pattern) {
        throw new NotFoundException("Paper pattern not found");
      }
      return pattern;
    }

    // Get default pattern for the subject and class
    const defaultPattern = await PaperPatternModel.findOne({
      subject: request.subject,
      classLevel: request.classLevel,
      isActive: true,
    }).sort({ createdAt: -1 });

    if (!defaultPattern) {
      throw new BadRequestException(
        `No paper pattern found for ${request.subject} class ${request.classLevel}`
      );
    }

    return defaultPattern;
  }

  /**
   * Generate PDF for a paper
   */
  public async generatePDF(paperId: string, userId: string) {
    const paper = await GeneratedPaperModel.findOne({
      _id: paperId,
      userId,
    }).populate("questions.questionId");

    if (!paper) {
      throw new NotFoundException("Paper not found");
    }

    // Generate PDF
    const pdfBuffer = await this.pdfService.generatePaperPDF(paper);

    // Update download count
    await paper.incrementDownload();

    return {
      pdf: pdfBuffer,
      fileName: `ExamForge_Paper_${paper._id}.pdf`,
      paper,
    };
  }

  /**
   * Get paper preview (HTML version)
   */
  public async getPaperPreview(paperId: string, userId: string) {
    const paper = await GeneratedPaperModel.findOne({
      _id: paperId,
      userId,
    }).populate("questions.questionId");

    if (!paper) {
      throw new NotFoundException("Paper not found");
    }

    // Group questions by section
    const sections = paper.questions.reduce((acc: any, item: any) => {
      const sectionName = item.sectionName;
      if (!acc[sectionName]) {
        acc[sectionName] = {
          name: sectionName,
          questionType: item.questionType,
          questions: [],
          marksPerQuestion: item.marks,
        };
      }
      acc[sectionName].questions.push(item.questionId);
      return acc;
    }, {} as Record<string, any>);

    return {
      paper,
      sections: Object.values(sections),
      totalMarks: paper.totalMarks,
      totalQuestions: paper.totalQuestions,
      duration: paper.duration,
    };
  }

  /**
   * Get available filters for a subject
   */
  public async getAvailableFilters(subject: string, classLevel: string) {
    const filters = await QuestionModel.aggregate([
      {
        $match: {
          subject: subject as Subject,
          classLevel: classLevel as ClassLevel,
          isActive: true,
        },
      },
      {
        $group: {
          _id: null,
          chapters: { $addToSet: "$chapter" },
          difficulties: { $addToSet: "$difficulty" },
          years: { $addToSet: "$year" },
          topicCategories: { $addToSet: "$topicCategory" },
          competencyLevels: { $addToSet: "$competencyLevel" },
        },
      },
    ]);

    return (
      filters[0] || {
        chapters: [],
        difficulties: [],
        years: [],
        topicCategories: [],
        competencyLevels: [],
      }
    );
  }

  /**
   * Get user's paper history
   */
  public async getUserPapers(userId: string) {
    try {
      const papers = await GeneratedPaperModel.find({ userId })
        .sort({ generatedAt: -1 })
        .select(
          "title subject classLevel totalMarks totalQuestions generatedAt downloadCount settings metadata"
        )
        .limit(10)
        .lean();

      return papers;
    } catch (error) {
      logger.error(`Error getting user papers: ${error}`);
      throw error;
    }
  }

  /**
   * Get a specific paper by ID
   */
  public async getPaperById(paperId: string, userId: string) {
    const paper = await GeneratedPaperModel.findOne({
      _id: paperId,
      userId,
    }).populate("questions.questionId");

    if (!paper) {
      throw new NotFoundException("Paper not found");
    }

    return paper;
  }

  /**
   * Delete a generated paper
   */
  public async deletePaper(paperId: string, userId: string) {
    const result = await GeneratedPaperModel.deleteOne({
      _id: paperId,
      userId,
    });

    if (result.deletedCount === 0) {
      throw new NotFoundException(
        "Paper not found or you don't have permission to delete it"
      );
    }

    return { success: true, message: "Paper deleted successfully" };
  }

  /**
   * Test Groq connection
   */
  private async testGroqConnection() {
    try {
      const isConnected = await this.groqService.testConnection();
      if (isConnected) {
        const models = this.groqService.getAvailableModels();
        logger.info(
          `✅ Groq API connected successfully. Available models: ${models.join(
            ", "
          )}`
        );
      } else {
        logger.warn("⚠️  Groq API not connected, will use fallback methods");
      }
    } catch (error: any) {
      logger.warn(`⚠️  Groq connection test failed: ${error.message}`);
    }
  }

  /**
   * Generate a paper title
   */
  private generatePaperTitle(request: GeneratePaperRequest): string {
    const date = new Date().toLocaleDateString("en-US", {
      month: "long",
      day: "numeric",
      year: "numeric",
    });

    const subjectName =
      request.subject.charAt(0).toUpperCase() + request.subject.slice(1);
    const features = [];

    if (request.settings?.preventMemorization)
      features.push("Critical Thinking");
    if (request.settings?.translateQuestions) features.push("Translated");
    if (request.settings?.culturalAdaptation)
      features.push("Culturally Adapted");
    if (request.settings?.generateExplanations)
      features.push("With Explanations");
    if (request.settings?.cognitiveLevelAnalysis)
      features.push("Cognitive Analysis");

    const featureStr =
      features.length > 0 ? ` - ${features.join(", ")} Edition` : "";

    return `${subjectName} - Class ${request.classLevel}${featureStr} - ${date}`;
  }

  /**
   * Map questions to paper format
   */
  private mapQuestionsToPaper(questions: any[], sections: any[]) {
    return questions.map((question, index) => {
      // Find which section this question belongs to based on marks and type
      const section = sections.find(
        (s: any) =>
          s.questionType === question.questionType &&
          s.marksPerQuestion === question.marks
      );

      return {
        questionId: question._id,
        sectionName: section?.name || "General",
        questionType: question.questionType,
        marks: question.marks,
        order: index + 1,
        topicCategory: question.topicCategory,
        competencyLevel: question.competencyLevel,
        isTranslated: !!question.translatedQuestionText,
        isRewritten: !!question.rewrittenQuestionText,
        hasExplanation: !!question.aiGeneratedExplanation,
        isCulturallyAdapted: !!question.culturallyAdaptedText,
        metadata: {
          cognitiveLevel: this.determineCognitiveLevel(question.questionText),
          processingHistory: question.processingHistory || [],
        },
      };
    });
  }

  /**
   * Generate multiple variations of a question (enhanced)
   */
  public async generateQuestionVariations(
    questionId: string,
    count: number = 3
  ) {
    const question = await QuestionModel.findById(questionId);
    if (!question) {
      throw new NotFoundException("Question not found");
    }

    const variations = await this.groqService.generateQuestionVariations(
      question.questionText,
      question.subject,
      count
    );

    // Enhance variations with metadata
    const enhancedVariations = variations.map((variation, index) => ({
      number: index + 1,
      text: variation,
      marks: question.marks,
      questionType: question.questionType,
      cognitiveLevel: this.determineCognitiveLevel(variation),
      suggestedUse: this.suggestVariationUse(index, question.subject),
      complexity: this.estimateComplexity(variation),
    }));

    return {
      original: {
        text: question.questionText,
        cognitiveLevel: this.determineCognitiveLevel(question.questionText),
        subject: question.subject,
        difficulty: question.difficulty,
        marks: question.marks,
      },
      variations: enhancedVariations,
      suggestions: {
        examUse: "Mix variations to test different cognitive levels",
        nepaliContext: "All variations can be adapted for Nepali students",
        difficulty: "Maintains original difficulty level",
        timeEstimate: `${enhancedVariations.length * 2} minutes total`,
      },
    };
  }

  /**
   * Suggest how to use each variation
   */
  private suggestVariationUse(index: number, subject: string): string {
    const suggestions = [
      "Use for application-based testing in exams",
      "Good for analytical thinking and problem-solving",
      "Tests evaluation and critical thinking skills",
      "Suitable for contextual understanding and real-world application",
    ];
    return suggestions[index % suggestions.length];
  }

  /**
   * Estimate complexity of a question
   */
  private estimateComplexity(question: string): number {
    // Simple complexity estimation based on:
    // 1. Length of question
    // 2. Number of cognitive keywords
    // 3. Question structure

    const lengthScore = Math.min(question.length / 50, 3);

    const cognitiveKeywords = [
      "analyze",
      "evaluate",
      "compare",
      "contrast",
      "justify",
      "design",
      "create",
      "develop",
      "propose",
      "investigate",
    ];

    const keywordScore = cognitiveKeywords.filter((kw) =>
      question.toLowerCase().includes(kw)
    ).length;

    const hasMultipleParts =
      question.includes(";") ||
      question.includes(" and ") ||
      question.includes(" or ");

    const structureScore = hasMultipleParts ? 2 : 1;

    return Math.min(lengthScore + keywordScore + structureScore, 10);
  }

  /**
   * Update question metadata in database
   */
  private async updateQuestionMetadata(questions: any[]) {
    try {
      const updates = questions
        .map((question) => {
          if (!question._id) return null;

          return QuestionModel.findByIdAndUpdate(question._id, {
            $set: {
              metadata: {
                ...question.metadata,
                lastProcessed: new Date(),
                processingCount: (question.metadata?.processingCount || 0) + 1,
              },
            },
          });
        })
        .filter(Boolean);

      if (updates.length > 0) {
        await Promise.all(updates);
        logger.info(`📊 Updated metadata for ${updates.length} questions`);
      }
    } catch (error: any) {
      logger.warn(`⚠️ Failed to update question metadata: ${error.message}`);
    }
  }

  /**
   * Get processing features summary
   */
  private getProcessingFeatures(settings: any = {}) {
    const features = [];

    if (settings.preventMemorization || settings.rewriteQuestions) {
      features.push("Paraphrasing");
    }
    if (settings.translateQuestions) {
      features.push(`Translation (${settings.language || "nepali"})`);
    }
    if (settings.generateExplanations) {
      features.push("Explanations");
    }
    if (settings.culturalAdaptation) {
      features.push("Cultural Adaptation");
    }
    if (settings.cognitiveLevelAnalysis) {
      features.push("Cognitive Analysis");
    }

    return features.length > 0 ? features : ["None"];
  }

  /**
   * Generate new questions from topic using Groq
   */
  public async generateQuestionsFromTopic(
    topic: string,
    subject: Subject,
    difficulty: Difficulty,
    count: number = 5
  ) {
    try {
      const questions = await this.groqService.generateQuestionsFromTopic(
        topic,
        subject,
        difficulty,
        count
      );

      // Enhance questions with metadata
      const enhancedQuestions = questions.map((text, index) => ({
        text,
        topic,
        subject,
        difficulty,
        // questionType: this.determineQuestionType(text),
        cognitiveLevel: this.determineCognitiveLevel(text),
        estimatedMarks: this.estimateMarks(text),
        metadata: {
          generatedBy: "Groq AI",
          generationDate: new Date(),
          modelUsed: this.groqService.getAvailableModels()[0],
        },
      }));

      return {
        topic,
        subject,
        difficulty,
        count: enhancedQuestions.length,
        questions: enhancedQuestions,
        recommendations: {
          usage: "Can be added to question bank after review",
          reviewNeeded: "Check for accuracy and cultural relevance",
          adaptation: "May need Nepali context adaptation",
        },
      };
    } catch (error: any) {
      logger.error(`Question generation failed: ${error.message}`);
      throw new BadRequestException(
        `Failed to generate questions: ${error.message}`
      );
    }
  }

  /**
   * Determine question type from text
   */
  // private determineQuestionType(text: string): QuestionType {
  //   const lowerText = text.toLowerCase();

  //   if (
  //     lowerText.includes("choose") ||
  //     lowerText.includes("select") ||
  //     lowerText.includes("which of the following") ||
  //     (lowerText.includes("?") && lowerText.split("?")[0].includes("_"))
  //   ) {
  //     return QuestionType.MCQ;
  //   } else if (
  //     lowerText.includes("explain") ||
  //     lowerText.includes("describe") ||
  //     lowerText.includes("discuss")
  //   ) {
  //     return QuestionType.SHORT_ANSWER;
  //   } else if (
  //     lowerText.includes("calculate") ||
  //     lowerText.includes("solve") ||
  //     lowerText.includes("find the value")
  //   ) {
  //   } else {
  //     return QuestionType.SHORT_ANSWER;
  //   }
  // }

  /**
   * Estimate marks for a question
   */
  private estimateMarks(text: string): number {
    const length = text.length;
    const complexity = this.estimateComplexity(text);

    if (complexity > 7) return 5;
    if (complexity > 5) return 4;
    if (complexity > 3) return 3;
    if (complexity > 1) return 2;
    return 1;
  }
}
