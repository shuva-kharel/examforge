// services/groq.service.ts
import { logger } from "../../common/utils/logger";

export class GroqService {
  private endpoint = "https://api.groq.com/openai/v1/chat/completions";
  private apiKey: string;
  private models = {
    fast: "mixtral-8x7b-32768", // Fast, good for paraphrasing
    smart: "llama3-70b-8192", // Smart, good for complex reasoning
    coding: "gemma-7b-it", // Good for technical subjects
  };

  constructor() {
    this.apiKey = process.env.GROQ_API_KEY || "";

    if (!this.apiKey) {
      logger.warn("⚠️  Groq API key not found. Using mock mode.");
    } else {
      logger.info("✅ Groq Service initialized");
    }
  }

  /**
   * Paraphrase/rewrite a question with enhanced optimization
   */
  async paraphraseQuestion(question: string, subject: string): Promise<string> {
    if (!this.apiKey) {
      return this.mockParaphrase(question, subject);
    }

    try {
      logger.info(`🔄 Groq paraphrasing: ${question.substring(0, 50)}...`);

      const systemPrompt = this.buildParaphraseSystemPrompt(subject);

      const response = await fetch(this.endpoint, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${this.apiKey}`,
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        body: JSON.stringify({
          model: this.models.smart, // Use smart model for better paraphrasing
          messages: [
            {
              role: "system",
              content: systemPrompt,
            },
            {
              role: "user",
              content: `ORIGINAL QUESTION: "${question}"

Generate ONE optimized version that follows all the rules above:`,
            },
          ],
          temperature: 0.7, // Slightly lower for more consistent quality
          max_tokens: 300,
          top_p: 0.9,
          frequency_penalty: 0.2,
          presence_penalty: 0.3,
          stream: false,
        }),
      });

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${await response.text()}`);
      }

      const data = await response.json();
      let result = data.choices[0]?.message?.content?.trim() || question;

      // Clean up the response
      result = this.cleanParaphraseResponse(result, question);

      logger.info(`✅ Groq paraphrased: ${result.substring(0, 50)}...`);
      return result;
    } catch (error: any) {
      logger.error(`❌ Groq failed: ${error.message}`);
      return this.fallbackParaphrase(question, subject);
    }
  }

  /**
   * Build optimized system prompt for paraphrasing
   */
  private buildParaphraseSystemPrompt(subject: string): string {
    return `You are an expert ${subject} teacher creating exam questions for Nepali students.

CRITICAL PARAPHRASING RULES:
1. PRESERVE CORE CONCEPT - Test the exact same educational objective
2. CHANGE EVERYTHING ELSE - Different wording, structure, examples, numbers
3. ENHANCE CRITICAL THINKING - Require analysis, application, evaluation
4. USE NEPALI CONTEXT - Local examples, names, places, currency when relevant
5. OPTIMIZE CLARITY - Make it unambiguous and precise
6. MAINTAIN DIFFICULTY - Same cognitive demand level
7. IMPROVE FORMAT - Better structure if possible

OUTPUT REQUIREMENTS:
- Return ONLY the rewritten question
- No explanations, no numbering
- If original has calculations, use different numbers
- If original has examples, use completely different scenarios
- Keep technical terms accurate
- Use age-appropriate language for Class 12

BAD EXAMPLE: "What is photosynthesis?" → "Define photosynthesis in your own words."
GOOD EXAMPLE: "What is photosynthesis?" → "A plant in Kathmandu garden produces glucose using sunlight. Explain the biochemical process that converts light energy into chemical energy, mentioning the specific organelles involved."`;
  }

  /**
   * Clean and validate paraphrase response
   */
  private cleanParaphraseResponse(response: string, original: string): string {
    let cleaned = response.trim();

    // Remove quotation marks if present
    cleaned = cleaned.replace(/^["']|["']$/g, "");

    // Remove prefixes like "Rewritten:" or "Paraphrase:"
    cleaned = cleaned.replace(
      /^(?:Rewritten|Paraphrase|Version|Answer):\s*/i,
      ""
    );

    // Remove numbering if present
    cleaned = cleaned.replace(/^\d+[\.\)]\s*/, "");

    // Ensure it's not the same as original
    if (
      cleaned.toLowerCase() === original.toLowerCase() ||
      cleaned.length < 10
    ) {
      return this.enhanceParaphrase(original);
    }

    return cleaned;
  }

  /**
   * Generate multiple variations with different cognitive levels
   */
  async generateQuestionVariations(
    question: string,
    subject: string,
    count: number = 3
  ): Promise<string[]> {
    if (!this.apiKey) {
      return this.mockVariations(question, count);
    }

    try {
      const prompt = `Generate ${count} DISTINCT variations of this ${subject} question for Nepali students.

ORIGINAL: "${question}"

VARIATION REQUIREMENTS:
1. COMPLETELY different: wording, examples, numbers, structure
2. Same core concept and difficulty level
3. Vary cognitive levels: one application, one analysis, one evaluation
4. Use Nepali context where possible (names, places, scenarios)
5. Each must stand alone as a valid exam question
6. Different question stems (explain, compare, calculate, justify, etc.)

FORMAT: Return ONLY a numbered list (1. 2. 3.) with no additional text.

EXAMPLE:
1. [Variation 1 - Application]
2. [Variation 2 - Analysis]
3. [Variation 3 - Evaluation]`;

      const response = await fetch(this.endpoint, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${this.apiKey}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          model: this.models.smart,
          messages: [{ role: "user", content: prompt }],
          temperature: 0.85, // Creative but coherent
          max_tokens: 500,
          top_p: 0.95,
        }),
      });

      const data = await response.json();
      const text = data.choices[0]?.message?.content || "";

      return this.parseVariations(text, count);
    } catch (error) {
      logger.error("Groq variations failed:", error);
      return this.mockVariations(question, count);
    }
  }

  /**
   * Enhanced translation with cultural adaptation
   */
  async translateAndAdapt(
    question: string,
    targetLanguage: string,
    subject: string
  ): Promise<string> {
    if (!this.apiKey) {
      return this.mockTranslation(question, targetLanguage);
    }

    try {
      const languageNames: Record<string, string> = {
        nepali: "नेपाली",
        hindi: "हिन्दी",
        newari: "नेवारी",
        maithili: "मैथिली",
        english: "English",
      };

      const prompt = `Translate and culturally adapt this ${subject} question for ${
        languageNames[targetLanguage] || targetLanguage
      } speaking students in Nepal.

ORIGINAL (English): "${question}"

TRANSLATION RULES:
1. ACCURATE TRANSLATION: Preserve exact meaning and technical accuracy
2. CULTURAL ADAPTATION: Use local examples, names, currency (NPR), places
3. EDUCATIONAL CONTEXT: Make it relatable to Nepali classroom experience
4. MAINTAIN FORMAT: Keep any mathematical notation, formulas, scientific terms
5. AGE APPROPRIATE: Language suitable for Class 12 students

Translate ONLY the question, no explanations.

${languageNames[targetLanguage] || targetLanguage} VERSION:`;

      const response = await fetch(this.endpoint, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${this.apiKey}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          model: this.models.fast,
          messages: [{ role: "user", content: prompt }],
          temperature: 0.3, // Low for accurate translation
          max_tokens: 250,
        }),
      });

      const data = await response.json();
      const translated = data.choices[0]?.message?.content?.trim() || question;

      return this.cleanTranslation(translated);
    } catch (error) {
      logger.error("Groq translation failed:", error);
      return question;
    }
  }

  /**
   * Generate comprehensive explanation
   */
  async generateExplanation(
    question: string,
    answer: string,
    subject: string
  ): Promise<string> {
    const prompt = `As a ${subject} teacher in Nepal, provide a comprehensive explanation for this exam question:

QUESTION: ${question}
CORRECT ANSWER: ${answer}

EXPLANATION STRUCTURE:
1. CONCEPT OVERVIEW: Main concept being tested (in simple terms)
2. STEP-BY-STEP SOLUTION: Clear reasoning process
3. NEPALI CONTEXT: Real-world application in Nepal if applicable
4. COMMON MISTAKES: Typical errors Nepali students make and how to avoid
5. STUDY TIPS: How to remember this concept
6. PRACTICE SUGGESTION: One related practice problem

Use simple, clear language suitable for Class 12 students. Include examples they can relate to.`;

    try {
      const response = await fetch(this.endpoint, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${this.apiKey}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          model: this.models.smart,
          messages: [{ role: "user", content: prompt }],
          temperature: 0.5,
          max_tokens: 400,
        }),
      });

      const data = await response.json();
      return data.choices[0]?.message?.content?.trim() || "";
    } catch (error) {
      logger.error("Groq explanation failed:", error);
      return "";
    }
  }

  /**
   * Generate questions from topics (new feature)
   */
  async generateQuestionsFromTopic(
    topic: string,
    subject: string,
    difficulty: string,
    count: number = 5
  ): Promise<string[]> {
    const prompt = `Generate ${count} unique exam questions for ${subject} on topic: "${topic}"

Difficulty: ${difficulty}
Target: Class 12 Nepali students

REQUIREMENTS:
1. Questions must test different aspects of the topic
2. Vary question types (MCQ, short answer, calculation, explanation)
3. Use Nepali context where relevant
4. Include different cognitive levels (remember, understand, apply, analyze)
5. Mark distribution: 1-5 marks per question
6. Technical accuracy is crucial

FORMAT: Numbered list only, no extra text.`;

    try {
      const response = await fetch(this.endpoint, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${this.apiKey}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          model: this.models.smart,
          messages: [{ role: "user", content: prompt }],
          temperature: 0.8,
          max_tokens: 600,
        }),
      });

      const data = await response.json();
      const text = data.choices[0]?.message?.content || "";

      return this.parseQuestionList(text, count);
    } catch (error) {
      logger.error("Groq question generation failed:", error);
      return Array(count).fill(`Question about ${topic} (generation failed)`);
    }
  }

  // ========== ENHANCED MOCK & FALLBACK METHODS ==========

  private mockParaphrase(question: string, subject: string): string {
    const templates = [
      `[Critical Thinking] ${question}`,
      `Analyze this: ${question.replace(
        "?",
        " from a different perspective."
      )}`,
      `Using Nepali context: ${question}`,
      `Application-based: ${question}`,
      `Real-world scenario: ${question}`,
    ];

    const randomIndex = Math.floor(Math.random() * templates.length);
    return templates[randomIndex];
  }

  private mockVariations(question: string, count: number): string[] {
    const variations = [
      "Application: ",
      "Analysis: ",
      "Evaluation: ",
      "Nepali Context: ",
      "Real-world: ",
      "Comparative: ",
      "Calculational: ",
      "Explanatory: ",
    ];

    return Array.from({ length: count }, (_, i) => {
      const prefix = variations[i % variations.length];
      return `${prefix}${question}`;
    });
  }

  private mockTranslation(question: string, language: string): string {
    const translations: Record<string, string> = {
      nepali: `(नेपाली) ${question}`,
      hindi: `(हिन्दी) ${question}`,
      newari: `(नेवारी) ${question}`,
      maithili: `(मैथिली) ${question}`,
    };

    return translations[language.toLowerCase()] || `[${language}] ${question}`;
  }

  private fallbackParaphrase(question: string, subject: string): string {
    // Enhanced rule-based paraphrasing
    const rules: Array<[RegExp, string]> = [
      [
        /What is (.*)\?/gi,
        "Explain the concept of $1 using a real-world example from Nepal.",
      ],
      [
        /Explain (.*)/gi,
        "Describe the process of $1 step by step, highlighting key mechanisms.",
      ],
      [
        /Calculate (.*)/gi,
        "Determine $1 using appropriate formulas and show your calculations.",
      ],
      [
        /Find (.*)/gi,
        "Identify $1 based on the given data and justify your reasoning.",
      ],
      [
        /Compare (.*) and (.*)/gi,
        "Analyze the similarities and differences between $1 and $2 in the context of Nepal.",
      ],
      [
        /Define (.*)/gi,
        "Provide a comprehensive definition of $1 with relevant examples.",
      ],
      [
        /List (.*)/gi,
        "Enumerate and briefly describe the key components of $1.",
      ],
      [
        /Describe (.*)/gi,
        "Provide a detailed account of $1, including its characteristics and applications.",
      ],
      [
        /How does (.*) work\?/gi,
        "Explain the mechanism behind $1 with a diagram or example.",
      ],
      [
        /Why is (.*) important\?/gi,
        "Discuss the significance of $1 in the context of Nepali society/environment.",
      ],
    ];

    let paraphrased = question;
    for (const [pattern, replacement] of rules) {
      if (pattern.test(question)) {
        paraphrased = question.replace(pattern, replacement);
        break;
      }
    }

    // If no rule matched, add cognitive level enhancement
    if (paraphrased === question) {
      paraphrased = `Analyze and apply: ${question}`;
    }

    return paraphrased;
  }

  /**
   * Enhanced paraphrase when AI response is poor
   */
  private enhanceParaphrase(question: string): string {
    // Add cognitive verbs
    const verbs = [
      "Analyze",
      "Evaluate",
      "Apply",
      "Compare",
      "Justify",
      "Design",
      "Propose",
    ];
    const verb = verbs[Math.floor(Math.random() * verbs.length)];

    // Add context
    const contexts = [
      "in the context of Nepal",
      "using a real-world example",
      "with different parameters",
      "from multiple perspectives",
    ];
    const context = contexts[Math.floor(Math.random() * contexts.length)];

    return `${verb} ${question.replace("?", "")} ${context}.`;
  }

  private parseVariations(text: string, count: number): string[] {
    const lines = text.split("\n");
    const variations: string[] = [];

    for (const line of lines) {
      const match = line.match(/^\d+[\.\)]\s*(.+)$/);
      if (match && match[1]) {
        variations.push(match[1].trim());
      }
      if (variations.length >= count) break;
    }

    // Fill missing with enhanced fallbacks
    while (variations.length < count) {
      const index = variations.length;
      variations.push(
        `Variation ${
          index + 1
        }: Requires application of the same concept with different parameters.`
      );
    }

    return variations.slice(0, count);
  }

  private parseQuestionList(text: string, count: number): string[] {
    const lines = text.split("\n");
    const questions: string[] = [];

    for (const line of lines) {
      const match = line.match(/^\d+[\.\)]\s*(.+)$/);
      if (match && match[1]) {
        questions.push(match[1].trim());
      }
    }

    return questions.slice(0, count);
  }

  private cleanTranslation(text: string): string {
    // Remove any "Translation:" prefix
    return text.replace(/^(?:Translation|Translated|Answer):\s*/i, "").trim();
  }

  /**
   * Test if API key is valid
   */
  async testConnection(): Promise<boolean> {
    if (!this.apiKey) return false;

    try {
      const response = await fetch(this.endpoint, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${this.apiKey}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          model: this.models.fast,
          messages: [{ role: "user", content: "Say 'Hello' in one word" }],
          max_tokens: 5,
        }),
      });

      return response.ok;
    } catch {
      return false;
    }
  }

  /**
   * Get available models (for debugging/selection)
   */
  getAvailableModels(): string[] {
    return Object.values(this.models);
  }
}
