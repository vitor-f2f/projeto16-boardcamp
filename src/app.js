import express from "express";
import router from "./routers/index.js";

const app = express();
app.use(express.json());

app.use(router);

const port = process.env.PORT || 5000;
app.listen(port, () => {
    console.log(`Servidor rodando na porta ${port}`);
});
