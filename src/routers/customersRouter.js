import express from "express";
import { validateCustomer } from "../middleware/validateCustomer.js";

import {
    getCusts,
    searchCust,
    addCust,
    updateCust,
} from "../controllers/customersController.js";

const customersRouter = express.Router();

customersRouter.get("/customers", getCusts);
customersRouter.get("/customers/:id", searchCust);
customersRouter.post("/customers", validateCustomer, addCust);
customersRouter.put("/customers/:id", validateCustomer, updateCust);
export default customersRouter;
