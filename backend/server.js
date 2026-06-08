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

io.on("connection", (socket) => {
    console.log("Usuário conectado: ", socket.id);

    socket.on("join_chat", async (chatId) => {
        socket.join(chatId);

        try{
            const messages = await prisma.message.findMany({
                where: {
                    chatId: chatId,
                },
                orderBy: { createAt: "asc" },
                take: 50,
                include: {
                    sender: {
                        select: {id: true, username: true}
                    }
                }
            });

            socket.emit("chat_history", messages);
        }catch(err){
            console.error("Erro ao buscar histórico:", err.message);
        }
    });

    socket.on("send_message", async (data) => {
        const { chatId, text, senderId } = data;

        io.to(chatId).emit("new_message", {
            id: Date.now().toString(),
            chatId,
            text,
            senderId: senderId,
            createAt: new Date().toISOString()
        });

        const message = await prisma.message.create({
            data: {
                text,
                createAt: new Date().toISOString(),
                sender: {
                    connect:{
                        id: parseInt(senderId)
                    }
                },
                chat: {
                    connect: {
                        id: chatId,
                    }
                }
            },
        });
    });

    socket.on("disconnect", () => {
        console.log("Usuário desconectado", socket.id);
    });
});

server.listen(port, () => {
    console.log("Server running at: https://localhost:" + port);
})