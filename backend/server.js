import dotenv from "dotenv";
dotenv.config();

import express from "express";
import cors from "cors";
import { createServer } from "http";
import { Server } from "socket.io";

import authRouter from "./routes/authRouter.js"
import usersRouter from "./routes/usersRouter.js";
import skillsRouter from "./routes/skillsRouters.js";
import categoryRouter from "./routes/categoryRouter.js";
import matchRouter from "./routes/matchRouter.js";
import chatRouter from "./routes/chatRouter.js";

import { prisma } from "./modules/prisma.js";

import { sendDirectMessage } from "./modules/nostr.js";
import { registerChatSocket } from "./sockets/chatSocket.js";

const app = express();
const server = createServer(app);
const io = new Server(server, {
    cors: {origin: "*"}
});
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
app.use("/chat", chatRouter);


app.get("/", (req, res) => {
    res.send("Hello world!");
});

registerChatSocket(io);

server.listen(port, () => {
    console.log("Server running at: https://localhost:" + port);
})