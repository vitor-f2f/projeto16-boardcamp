import { db } from "../db.js";
import Joi from "joi";

const rentSchema = Joi.object({
    customerId: Joi.number().required(),
    gameId: Joi.number().required(),
    daysRented: Joi.number().integer().min(1).required(),
});

export const getRent = async (req, res) => {
    try {
        const query = `
        SELECT rentals.*, 
        json_build_object('id', customers.id, 'name', customers.name) AS customer,
        json_build_object('id', games.id, 'name', games.name) AS game
        FROM rentals
        JOIN customers ON rentals."customerId" = customers.id
        JOIN games ON rentals."gameId" = games.id`;
        const result = await db.query(query);
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
            `SELECT * FROM customers WHERE id = ${customerId}`
        );
        const customer = customerCheck.rows[0];

        if (!customer) {
            return res.status(400).send("Cliente não encontrado.");
        }

        const gameQuery = await db.query(
            `SELECT * FROM games WHERE id = ${gameId}`
        );
        const game = gameQuery.rows[0];

        if (!game) {
            return res.status(400).send("Jogo não encontrado.");
        }

        const rentalsQuery = await db.query(
            `SELECT COUNT(*) AS count FROM rentals WHERE "gameId" = ${gameId} AND "returnDate" IS NULL`
        );

        const rentalsTotal = parseInt(rentalsQuery.rows[0].count);
        if (rentalsTotal >= game.stockTotal) {
            return res
                .status(400)
                .send("Jogo não está disponoível em estoque.");
        }

        const originalPrice = daysRented * game.pricePerDay;
        const rentDate = new Date().toISOString().slice(0, 10);

        const addQuery = `
            INSERT INTO rentals ("customerId", "gameId", "rentDate", "daysRented", "returnDate", "originalPrice", "delayFee")
            VALUES ($1, $2, $3, $4, NULL, $5, NULL)
        `;
        await db.query(addQuery, [
            customerId,
            gameId,
            rentDate,
            daysRented,
            originalPrice,
        ]);

        res.sendStatus(201);
    } catch (error) {
        console.error("Erro ao adicionar aluguel:", error);
        res.sendStatus(500);
    }
};

export const finishRent = async (req, res) => {};

export const deleteRent = async (req, res) => {};
