import express from "express";

import {
    getCusts,
    searchCust,
    addCust,
    updateCust,
} from "../controllers/customersController.js";

const customersRouter = express.Router();

customersRouter.get("/customers", getCusts);
customersRouter.get("/customers/:id", searchCust);
customersRouter.post("/customers", addCust);
customersRouter.put("/customers/:id", updateCust);

export default customersRouter;
