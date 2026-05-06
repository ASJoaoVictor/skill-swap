import dotenv from "dotenv";
dotenv.config();

import express from "express";
import authRouters from "./routes/authRouter.js"
import usersRouters from "./routes/usersRouter.js";
import skillsRouters from "./routes/skillsRouters.js";

const app = express();
const port = process.env.PORT;

app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(authRouters);
app.use("/users", usersRouters);
app.use("/skill", skillsRouters)/

app.get("/", (req, res) => {
    res.send("Hello world!");
});

app.listen(port, () => {
    console.log("Server running at: https://localhost:" + port);
})