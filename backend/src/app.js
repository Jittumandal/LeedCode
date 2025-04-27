//app.js
import express from "express";
import cookiesParser from 'cookie-parser'
import authRoutes from "./routes/auth.routes.js";


const app = express();

app.use(express.json());
app.use(cookiesParser());

app.get("/", (req, res) => {
    res.send("Hello, It is a leetCode practice server🔥");
})


app.use('/api/v1/auth', authRoutes)

export default app;