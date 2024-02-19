import express from "express";
import router from "./app/routes/routes.js";

const app = express();
app.use(express.json());
app.use(router);

export default app;
