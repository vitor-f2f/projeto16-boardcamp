import express from "express";
import { validateCust } from "../middleware/validateCust";

import {
    getCusts,
    searchCust,
    addCust,
    updateCust,
} from "../controllers/customersController.js";

const customersRouter = express.Router();

customersRouter.get("/customers", getCusts);
customersRouter.get("/customers/:id", searchCust);
customersRouter.post("/addCust", validateCust, addCust);
customersRouter.put("/updateCust/:id", validateCust, updateCust);
export default customersRouter;
