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
import matchRouter from "./routes/matchRouter.js"

import { prisma } from "./modules/prisma.js";

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


app.get("/", (req, res) => {
    res.send("Hello world!");
});

io.on("connection", (socket) => {
    console.log("Usuário conectado: ", socket.id);

    socket.on("join_chat", (chatId) => {
        socket.join(chatId);
    });

    socket.on("send_message", async (data) => {
        const { chatId, text, senderId } = data;

        const message = await prisma.message.create({
            data: { chatId, text, usersId: parseInt(senderId) },
            include: {
                sender: {
                    select: { id: true, name: true}
                }
            }
        });

        io.to(chatId).emit("new_message", {chatId, text, senderId: socket.id });
    });

    socket.on("disconnect", () => {
        console.log("Usuário desconectado", socket.id);
    });
})

server.listen(port, () => {
    console.log("Server running at: https://localhost:" + port);
})