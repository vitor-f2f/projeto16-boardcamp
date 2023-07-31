import { db } from "../db.js";
import Joi from "joi";

const gameSchema = Joi.object({
    name: Joi.string().required(),
    image: Joi.string().uri().required(),
    stockTotal: Joi.number().integer().min(1).required(),
    pricePerDay: Joi.number().positive().required(),
});

export const getGames = async (req, res) => {
    try {
        const result = await db.query("SELECT * FROM games");
        res.send(result.rows);
    } catch (error) {
        console.error("Erro ao buscar jogos:", error);
        res.sendStatus(500);
    }
};

export const addGame = async (req, res) => {
    const { error } = gameSchema.validate(req.body);

    if (error) {
        return res.status(400).send(error.message);
    }

    const { name, image, stockTotal, pricePerDay } = req.body;

    try {
        const query =
            "INSERT INTO games (name, image, stockTotal, pricePerDay) VALUES ($1, $2, $3, $4)";
        await db.query(query, [name, image, stockTotal, pricePerDay]);
        res.sendStatus(201);
    } catch (error) {
        console.error("Erro ao adicionar jogo:", error);
        res.sendStatus(500);
    }
};
