import { db } from "../db.js";
import Joi from "joi";

const rentSchema = Joi.object({
    customerId: Joi.number().required(),
    gameId: Joi.number().required(),
    daysRented: Joi.integer().min(1).number().required(),
});

export const getRent = async (req, res) => {
    try {
        const result = await db.query("SELECT * FROM rentals");
        res.send(result.rows);
    } catch (error) {
        console.error("Erro ao buscar aluguéis:", error);
        res.sendStatus(500);
    }
};

export const addRent = async (req, res) => {
    const { error } = rentSchema.validate(req.body);

    if (error) {
        return res.status(400).send(error.message);
    }

    const { customerId, gameId, daysRented } = req.body;
    try {
        const customerCheck = await db.query(
            "SELECT * FROM customers WHERE id = $1",
            [customerId]
        );
        const customer = customerCheck.rows[0];

        if (!customer) {
            return res.status(400).send("Cliente não encontrado.");
        }

        const gameQuery = await db.query("SELECT * FROM games WHERE id = $1", [
            gameId,
        ]);
        const game = gameQuery.rows[0];

        if (!game) {
            return res.status(400).send("Jogo não encontrado.");
        }

        const rentalsQuery = await db.query(
            "SELECT COUNT(*) AS count FROM rentals WHERE gameId = $1 AND returnDate IS NULL",
            [gameId]
        );

        const rentalsTotal = parseInt(rentalsQuery.rows[0].count);
        if (rentalsTotal >= game.stockTotal) {
            return res
                .status(400)
                .send("Jogo não está disponoível em estoque.");
        }

        const originalPrice = daysRented * game.pricePerDay;
        const rentDate = new Date().toISOString().slice(0, 10);

        const addQuery = await db.query(
            "INSERT INTO rentals (customerId, gameId, rentDate, returnDate, originalPrice, delayFee) VALUES ($1, $2, $3, NULL, $4, NULL)",
            [customerId, gameId, rentDate, originalPrice]
        );

        res.sendStatus(201);
    } catch (error) {
        console.error("Erro ao adicionar aluguel:", error);
        res.sendStatus(500);
    }
};

export const finishRent = async (req, res) => {};

export const deleteRent = async (req, res) => {};
