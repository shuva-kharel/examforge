// controllers/paper.controller.ts
import { Request, Response, NextFunction } from "express";
import { PaperService } from "./paper.service";

export class PaperController {
  private paperService: PaperService;

  constructor(paperService: PaperService) {
    this.paperService = paperService;

    // Bind methods to maintain 'this' context
    this.generatePaper = this.generatePaper.bind(this);
    this.getPaperPreview = this.getPaperPreview.bind(this);
    this.generatePDF = this.generatePDF.bind(this);
    this.getAvailableFilters = this.getAvailableFilters.bind(this);
    this.getUserPapers = this.getUserPapers.bind(this);
  }

  public generatePaper = async (
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> => {
    try {
      const userId = (req as any).user?.id;
      if (!userId) {
        res.status(401).json({ error: "Unauthorized" });
        return;
      }

      const request = req.body;
      const result = await this.paperService.generatePaper(userId, request);

      res.status(201).json({
        success: true,
        data: result,
      });
    } catch (error) {
      next(error);
    }
  };

  public getPaperPreview = async (
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> => {
    try {
      const userId = (req as any).user?.id;
      const { paperId } = req.params;

      if (!userId) {
        res.status(401).json({ error: "Unauthorized" });
        return;
      }

      const result = await this.paperService.getPaperPreview(paperId, userId);

      res.status(200).json({
        success: true,
        data: result,
      });
    } catch (error) {
      next(error);
    }
  };

  public generatePDF = async (
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> => {
    try {
      const userId = (req as any).user?.id;
      const { paperId } = req.params;

      if (!userId) {
        res.status(401).json({ error: "Unauthorized" });
        return;
      }

      const result = await this.paperService.generatePDF(paperId, userId);

      res.setHeader("Content-Type", "application/pdf");
      res.setHeader(
        "Content-Disposition",
        `attachment; filename="${result.fileName}"`
      );
      res.send(result.pdf);
    } catch (error) {
      next(error);
    }
  };

  public getAvailableFilters = async (
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> => {
    try {
      const { subject, classLevel } = req.query;

      if (!subject || !classLevel) {
        res.status(400).json({
          error: "Subject and classLevel are required",
        });
        return;
      }

      const filters = await this.paperService.getAvailableFilters(
        subject as string,
        classLevel as string
      );

      res.status(200).json({
        success: true,
        data: filters,
      });
    } catch (error) {
      next(error);
    }
  };

  public getUserPapers = async (
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> => {
    try {
      const userId = (req as any).user?.id;

      if (!userId) {
        res.status(401).json({ error: "Unauthorized" });
        return;
      }

      // Placeholder - implement this in PaperService
      const papers = await this.paperService.getUserPapers(userId);

      res.status(200).json({
        success: true,
        data: papers,
      });
    } catch (error) {
      next(error);
    }
  };
}
