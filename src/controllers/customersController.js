import { db } from "../db.js";
import Joi from "joi";

export const getCusts = async (req, res) => {
    try {
        const result = await db.query(
            "SELECT id, name, phone, cpf, to_char(birthday, 'YYYY-MM-DD') as birthday FROM customers"
        );
        res.send(result.rows);
    } catch (error) {
        console.error("Erro ao buscar clientes:", error);
        res.sendStatus(500);
    }
};

export const addCust = async (req, res) => {
    const { cpf } = req.body;

    try {
        const cpfRes = await db.query(
            "SELECT * FROM customers WHERE cpf = $1",
            [cpf]
        );
        const exists = cpfRes.rows[0];

        if (exists) {
            return res
                .status(409)
                .send("CPF já está em uso por outro cliente.");
        }

        const { name, phone, birthday } = req.body;
        const query =
            "INSERT INTO customers (name, phone, cpf, birthday) VALUES ($1, $2, $3, $4)";
        await db.query(query, [name, phone, cpf, birthday]);

        return res.sendStatus(201);
    } catch (error) {
        console.error("Erro ao adicionar cliente:", error);
        res.sendStatus(500);
    }
};

export const searchCust = async (req, res) => {
    const custId = req.params.id;
    try {
        const result = await db.query(
            "SELECT id, name, phone, cpf, to_char(birthday, 'YYYY-MM-DD') as birthday FROM customers WHERE id = $1",
            [custId]
        );
        const customer = result.rows[0];
        if (!customer) {
            return res
                .status(404)
                .send("Não foi encontrado cliente com esse ID.");
        }
        return res.send(customer);
    } catch (error) {
        console.error("Erro ao buscar cliente por ID:", error);
        res.sendStatus(500);
    }
};

export const updateCust = async (req, res) => {
    const custId = req.params.id;
    const newCust = req.body;

    try {
        const result = await db.query(
            `SELECT * FROM customers WHERE id = ${custId}`
        );
        const customer = result.rows[0];
        if (!customer) {
            return res
                .status(404)
                .send("Não foi encontrado cliente com esse ID.");
        }

        if (newCust.cpf !== customer.cpf) {
            const cpfRes = await db.query(
                "SELECT * FROM customers WHERE cpf = $1",
                [newCust.cpf]
            );
            const exists = cpfRes.rows[0];

            if (exists) {
                return res
                    .status(409)
                    .send("CPF já está em uso por outro cliente.");
            }
        }

        const update = `UPDATE customers SET name = $1, phone = $2, cpf = $3, birthday = $4 WHERE id = $5`;
        await db.query(update, [
            newCust.name,
            newCust.phone,
            newCust.cpf,
            newCust.birthday,
            custId,
        ]);

        return res.sendStatus(200);
    } catch (error) {
        console.error("Erro ao atualizar cliente:", error);
        res.sendStatus(500);
    }
};
