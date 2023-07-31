import { Router } from "express";
import gamesRouter from "./gamesRouter.js";
import customersRouter from "./customersRouter.js";

const router = Router();

router.use(gamesRouter);
router.use(customersRouter);

export default router;
