// routes/paper.routes.ts
import { Router } from "express";
import { PaperController } from "./paper.controller";
import { PaperService } from "./paper.service";
import { authenticateJWT } from "../../common/strategies/jwt.strategy";

const router = Router();
const paperService = new PaperService();
const paperController = new PaperController(paperService);

// Protected routes
router.post("/generate", authenticateJWT, paperController.generatePaper);
router.get("/:paperId", authenticateJWT, paperController.getPaperPreview);
router.get("/:paperId/pdf", authenticateJWT, paperController.generatePDF);
router.get(
  "/filters/available",
  authenticateJWT,
  paperController.getAvailableFilters
);

// Optional: Get user's paper history
router.get("/user/history", authenticateJWT, paperController.getUserPapers);

export default router;
