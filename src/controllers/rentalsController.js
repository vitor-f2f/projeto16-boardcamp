import { db } from "../db.js";
import Joi from "joi";

const rentSchema = Joi.object({});
// getRent, addRent, finishRent, deleteRent,
export const getRent = async (req, res) => {
    try {
        const result = await db.query("SELECT * FROM rentals");
        res.json(result.rows);
    } catch (error) {
        console.error("Erro ao buscar aluguéis:", error);
        res.sendStatus(500);
    }
};

export const addRent = async (req, res) => {
    const { error } = rentSchema.validate(req.body);

    if (error) {
        return res.status(400).json({ error: error.details[0].message });
    }

    try {
    } catch (error) {}
};

export const finishRent = async (req, res) => {};

export const deleteRent = async (req, res) => {};
