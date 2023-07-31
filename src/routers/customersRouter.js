import express from "express";
import { validateCust } from "../middleware/validateCust.js";

import {
    getCusts,
    searchCust,
    addCust,
    updateCust,
} from "../controllers/customersController.js";

const customersRouter = express.Router();

customersRouter.get("/customers", getCusts);
customersRouter.get("/customers/:id", searchCust);
customersRouter.post("/customers", validateCust, addCust);
customersRouter.put("/customers/:id", validateCust, updateCust);
export default customersRouter;
