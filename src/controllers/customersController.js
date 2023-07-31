import { db } from "../db.js";
import Joi from "joi";

const custSchema = Joi.object({});
// getCusts, searchCust, addCust, updateCust;
export const getCusts = async (req, res) => {
    try {
        const result = await db.query("SELECT * FROM customers");
        res.json(result.rows);
    } catch (error) {
        console.error("Erro ao buscar clientes:", error);
        res.sendStatus(500);
    }
};

export const addCust = async (req, res) => {
    const { error } = custSchema.validate(req.body);

    if (error) {
        return res.status(400).json({ error: error.details[0].message });
    }

    try {
    } catch (error) {}
};

export const searchCust = async (req, res) => {};

export const updateCust = async (req, res) => {};
