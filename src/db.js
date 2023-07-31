import pg from "pg";
import dotenv from "dotenv";
dotenv.config();

const { Pool } = pg;

const configDatabase = {
    connectionString: process.env.DATABASE_URL,
};

if (process.env.MODE === "production") configDatabase.ssl = true;

export const db = new Pool(configDatabase);

db.connect()
    .then(() => {
        console.log("Conectado ao PostgreSQL");
    })
    .catch((err) => console.error("Erro ao conectar com PostgreSQL:", err));
