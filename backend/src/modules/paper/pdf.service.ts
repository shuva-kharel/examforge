import PDFDocument from "pdfkit";
import { GeneratedPaperDocument } from "../../database/models/generated-paper.model";
import { logger } from "../../common/utils/logger";

export class PDFService {
  /**
   * Generate PDF for a question paper
   */
  public async generatePaperPDF(
    paper: GeneratedPaperDocument
  ): Promise<Buffer> {
    return new Promise((resolve, reject) => {
      try {
        const doc = new PDFDocument({
          margin: 50,
          size: "A4",
          info: {
            Title: paper.title,
            Author: "ExamForge",
            Subject: paper.subject,
            Keywords: "exam, question paper, education",
          },
        });

        const buffers: Buffer[] = [];
        doc.on("data", buffers.push.bind(buffers));
        doc.on("end", () => {
          const pdfBuffer = Buffer.concat(buffers);
          resolve(pdfBuffer);
        });

        // Add header
        this.addHeader(doc, paper);

        // Add instructions
        this.addInstructions(doc);

        // Add questions by section
        this.addQuestions(doc, paper);

        // Add footer
        this.addFooter(doc, paper);

        doc.end();

        logger.info(`PDF generated for paper: ${paper._id}`);
      } catch (error) {
        logger.error(`PDF generation failed: ${error}`);
        reject(error);
      }
    });
  }

  private addHeader(doc: PDFKit.PDFDocument, paper: GeneratedPaperDocument) {
    // Title
    doc
      .fontSize(20)
      .font("Helvetica-Bold")
      .text(paper.title, { align: "center" });
    doc.moveDown();

    // Exam details
    doc.fontSize(12).font("Helvetica");
    doc.text(
      `Subject: ${
        paper.subject.charAt(0).toUpperCase() + paper.subject.slice(1)
      }`
    );
    doc.text(`Class: ${paper.classLevel}`);
    doc.text(`Total Marks: ${paper.totalMarks}`);
    doc.text(`Time: ${paper.duration} minutes`);
    doc.moveDown(2);

    // Line separator
    doc.moveTo(50, doc.y).lineTo(550, doc.y).stroke();
    doc.moveDown(2);
  }

  private addInstructions(doc: PDFKit.PDFDocument) {
    doc.fontSize(14).font("Helvetica-Bold").text("General Instructions:");
    doc.moveDown(0.5);

    doc.fontSize(11).font("Helvetica");
    const defaultInstructions = [
      "All questions are compulsory.",
      "Read each question carefully before answering.",
      "Write your answers neatly and legibly.",
      "Use blue or black ink only.",
      "Marks are indicated against each question.",
    ];

    defaultInstructions.forEach((instruction) => {
      doc.text(`• ${instruction}`);
    });

    doc.moveDown(2);
  }

  private addQuestions(doc: PDFKit.PDFDocument, paper: GeneratedPaperDocument) {
    // Group questions by section
    const sections: Record<string, any[]> = {};
    paper.questions.forEach((item: any) => {
      const sectionName = item.sectionName;
      if (!sections[sectionName]) {
        sections[sectionName] = [];
      }
      sections[sectionName].push(item);
    });

    let questionNumber = 1;

    Object.entries(sections).forEach(([sectionName, questions]) => {
      // Section header
      doc.fontSize(16).font("Helvetica-Bold").text(sectionName);
      doc.moveDown(0.5);

      // Questions in this section
      questions.forEach((item: any) => {
        const question = item.questionId;

        // Question number and text
        doc
          .fontSize(12)
          .font("Helvetica-Bold")
          .text(`${questionNumber}. [${item.marks} marks]`, {
            continued: true,
          });

        doc
          .fontSize(12)
          .font("Helvetica")
          .text(` ${question.translatedQuestionText || question.questionText}`);

        // Options for MCQ
        if (question.questionType === "mcq" && question.options) {
          doc.moveDown(0.3);
          const options = question.translatedOptions || question.options;
          options.forEach((option: string, optIndex: number) => {
            doc
              .fontSize(11)
              .text(`   ${String.fromCharCode(65 + optIndex)}) ${option}`);
          });
        }

        // Answer space for subjective questions
        if (question.questionType !== "mcq") {
          doc.moveDown(0.5);
          doc
            .fontSize(10)
            .font("Helvetica-Oblique")
            .text("Answer: ________________________________________________");
          doc.moveDown(0.5);
          doc.text(
            "________________________________________________________________"
          );
          doc.text(
            "________________________________________________________________"
          );
          doc.text(
            "________________________________________________________________"
          );
        }

        doc.moveDown(1);
        questionNumber++;
      });

      doc.moveDown(1);
    });
  }

  private addFooter(doc: PDFKit.PDFDocument, paper: GeneratedPaperDocument) {
    const pageHeight = doc.page.height;
    const footerY = pageHeight - 100;

    doc.y = footerY;
    doc.moveTo(50, doc.y).lineTo(550, doc.y).stroke();
    doc.moveDown(1);

    doc
      .fontSize(10)
      .font("Helvetica")
      .text("Generated by ExamForge - www.examforge.com", { align: "center" });

    // Safely get paper ID
    const paperId = paper._id
      ? paper._id.toString().substring(0, 8)
      : "unknown";
    doc.text(`Paper ID: ${paperId} - Do not distribute`, { align: "center" });
  }

  /**
   * Generate answer key PDF
   */
  public async generateAnswerKeyPDF(
    paper: GeneratedPaperDocument
  ): Promise<Buffer> {
    return new Promise((resolve, reject) => {
      try {
        const doc = new PDFDocument({
          margin: 50,
          size: "A4",
        });

        const buffers: Buffer[] = [];
        doc.on("data", buffers.push.bind(buffers));
        doc.on("end", () => {
          const pdfBuffer = Buffer.concat(buffers);
          resolve(pdfBuffer);
        });

        // Header
        doc
          .fontSize(20)
          .font("Helvetica-Bold")
          .text(`Answer Key - ${paper.title}`, { align: "center" });
        doc.moveDown(2);

        // Questions with answers
        let questionNumber = 1;

        paper.questions.forEach((item: any) => {
          const question = item.questionId;

          doc
            .fontSize(12)
            .font("Helvetica-Bold")
            .text(`${questionNumber}.`, { continued: true });

          doc.fontSize(12).font("Helvetica").text(` ${question.questionText}`);

          doc.moveDown(0.3);
          doc
            .fontSize(11)
            .font("Helvetica-Bold")
            .text(`   Answer: ${question.correctAnswer}`);

          if (question.explanation) {
            doc.moveDown(0.2);
            doc
              .fontSize(10)
              .font("Helvetica-Oblique")
              .text(`   Explanation: ${question.explanation}`);
          }

          if (question.markingScheme) {
            doc.moveDown(0.2);
            doc
              .fontSize(10)
              .font("Helvetica")
              .text(`   Marking Scheme: ${question.markingScheme}`);
          }

          doc.moveDown(1);
          questionNumber++;
        });

        doc.end();
      } catch (error) {
        logger.error(`Answer key PDF generation failed: ${error}`);
        reject(error);
      }
    });
  }
}
