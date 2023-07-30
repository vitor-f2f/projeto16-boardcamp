import { Pool } from "pg";
import dotenv from "dotenv";

dotenv.config();

const db = new Pool({
    connectionString: process.env.DATABASE_URL,
});

db.connect()
    .then(() => {
        console.log("Conectado ao PostgreSQL");
    })
    .catch((err) => console.error("Erro ao conectar com PostgreSQL:", err));

export default db;
