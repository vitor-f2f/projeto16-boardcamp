import { db } from "../db.js";
import Joi from "joi";

const custSchema = Joi.object({
    name: Joi.string().required(),
    phone: Joi.string()
        .pattern(/^\d{10,11}$/)
        .required(),
    cpf: Joi.string().length(11).pattern(/^\d+$/).required(),
    birthday: Joi.date().iso().required(),
});

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

    const { cpf } = req.body;

    try {
        const exists = await db.query("SELECT * FROM customers WERE cpf = $1", [
            cpf,
        ]);
        if (exists.length > 0) {
            return res.status(409).json({ error: "CPF já está em uso." });
        }

        const { name, phone, birthday } = req.body;
        const query =
            "INSERT INTO customers (name, phone, cpf, birthday) VALUES ($1, $2, $3, $4)";
        await db.query(query, [name, phone, cpf, birthday]);

        return res.status(201).json({ message: "Cliente adicionado." });
    } catch (error) {
        console.error("Erro ao adicionar cliente:", error);
        res.sendStatus(500);
    }
};

export const searchCust = async (req, res) => {
    const custId = req.params.id;
    try {
        const result = await db.query("SELECT * FROM customers WHERE id = $1", [
            custId,
        ]);
        const customer = result.rows[0];
        if (!customer) {
            return res
                .status(404)
                .json({ error: "Não foi encontrado cliente com esse ID." });
        }
        return res.json(customer);
    } catch (error) {
        console.error("Erro ao buscar cliente por ID:", error);
        res.sendStatus(500);
    }
};

export const updateCust = async (req, res) => {
    const custId = req.params.id;
    const newCust = req.body;

    const { error } = custSchema.validate(newCust);
    if (error) {
        return res.status(400).json({ error: error.details[0].message });
    }

    try {
        const result = await db.query("SELECT * FROM customers WHERE id = $1", [
            custId,
        ]);
        const customer = result.rows[0];
        if (!customer) {
            return res
                .status(404)
                .json({ error: "Não foi encontrado cliente com esse ID." });
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
                    .json({ error: "CPF já está em uso por outro cliente." });
            }
        }

        const update =
            "UPDATE customers SET name = $1, phone = $2, cpf = $3, birthday = $4 WHERE id = $5";
        await db.query(update, [
            newCust.name,
            newCust.phone,
            newCust.cpf,
            newCust.birthday,
            custId,
        ]);

        return res.json({ message: "Cliente atualizado com sucesso" });
    } catch (error) {
        console.error("Erro ao atualizar cliente:", error);
        res.sendStatus(500);
    }
};
