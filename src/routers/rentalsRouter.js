import express from "express";

import {
    getRent,
    addRent,
    finishRent,
    deleteRent,
} from "../controllers/rentalsController.js";

const rentalsRouter = express.Router();

rentalsRouter.get("/rentals", getRent);
rentalsRouter.post("/rentals/:id/return", finishRent);
rentalsRouter.post("/rentals", addRent);
rentalsRouter.delete("/rentals/:id", deleteRent);

export default rentalsRouter;
