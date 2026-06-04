import { Router, type IRouter } from "express";
import healthRouter from "./health";
import questionsRouter from "./questions";
import revisionsRouter from "./revisions";

const router: IRouter = Router();

router.use(healthRouter);
router.use(questionsRouter);
router.use(revisionsRouter);

export default router;
