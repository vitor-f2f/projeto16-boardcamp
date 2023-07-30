import { db } from "../db.js";

export const validationAuth = async (req, res, next) => {
    try {
        next();
    } catch (error) {}
};
