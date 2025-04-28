//app.js
import express from "express";
import cookiesParser from 'cookie-parser'
import authRoutes from "./routes/auth.routes.js";
import problemsRoutes from "./routes/problems.Routes.js";

const app = express();

app.use(express.json());
app.use(cookiesParser());

app.get("/", (req, res) => {
    res.send("Hello, It is a leetCode practice server🔥");
})


app.use('/api/v1/auth', authRoutes)
app.use('/api/v1/problems', problemsRoutes)

export default app;