import dotenv from "dotenv";
dotenv.config();

import express from "express";
import cors from "cors";
import authRouter from "./routes/authRouter.js"
import usersRouter from "./routes/usersRouter.js";
import skillsRouter from "./routes/skillsRouters.js";
import categoryRouter from "./routes/categoryRouter.js";
import matchRouter from "./routes/matchRouter.js"

const app = express();
const port = process.env.PORT;

app.use(cors({
    origin: "*"
}));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(authRouter);
app.use("/users", usersRouter);
app.use("/skill", skillsRouter);
app.use("/category", categoryRouter);
app.use("/match", matchRouter);


app.get("/", (req, res) => {
    res.send("Hello world!");
});

app.listen(port, () => {
    console.log("Server running at: https://localhost:" + port);
})