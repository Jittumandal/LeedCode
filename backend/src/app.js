//app.js
import express from "express";
import cookiesParser from 'cookie-parser'
import authRoutes from "./routes/auth.routes.js";
import problemsRoutes from "./routes/problems.Routes.js";
import excutionRoutes from "./routes/excuteCode.routes.js";
import submissionRoutes from "./routes/submission.routes.js";
import playlistRoutes from "./routes/playlist.routes.js";
import cors from "cors";

const app = express();

app.use(express.json());
app.use(
    cors({
        origin: "http://localhost:5173",
        credentials: true,
    })
);
app.use(cookiesParser());

app.get("/", (req, res) => {
    res.send("Hello, It is a leetCode practice server🔥");
})


app.use('/api/v1/auth', authRoutes)
app.use('/api/v1/problems', problemsRoutes)
app.use('/api/v1/excute-code', excutionRoutes)
app.use('/api/v1/submission', submissionRoutes)
app.use('/api/v1/playlist', playlistRoutes)

export default app;