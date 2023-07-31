import express from "express";

import { addGame, getGames } from "../controllers/gamesController.js";

const gamesRouter = express.Router();

gamesRouter.get("/games", getGames);
gamesRouter.post("/games", addGame);

export default gamesRouter;
