// sockets/chatSocket.js
import jsonwebtoken from "jsonwebtoken";
import { prisma } from "../modules/prisma.js";
import { sendDirectMessage } from "../modules/nostr.js";

function getOtherUserId(chatId, currentUserId) {
    const ids = chatId.split("_").map(Number);
    return ids.find((id) => id !== currentUserId);
}

export function registerChatSocket(io) {
    io.use(async (socket, next) => {
        try {
            const token = socket.handshake.auth?.token;
            if (!token) return next(new Error("Sem token"));

            const payload = jsonwebtoken.verify(token, process.env.PRIVATE_KEY);
            const safeUser = JSON.parse(payload.user);

            const dbUser = await prisma.users.findUnique({
                where: { id: safeUser.id }
            });

            if (!dbUser) return next(new Error("Usuário não encontrado"));

            socket.currentUser = dbUser;
            next();
        } catch (err) {
            next(new Error("Token inválido"));
        }
    });

    io.on("connection", (socket) => {
        console.log("Usuário conectado: ", socket.id, "user:", socket.currentUser.id);

        socket.on("join_chat", (chatId) => {
            socket.join(String(chatId));
        });

        socket.on("send_message", async (data) => {
            const { chatId, content } = data;

            try {
                const otherId = getOtherUserId(chatId, socket.currentUser.id);

                if (otherId === undefined) {
                    return socket.emit("error_message", { message: "Você não participa deste chat" });
                }

                const recipient = await prisma.users.findUnique({
                    where: { id: otherId }
                });

                if (!recipient) {
                    return socket.emit("error_message", { message: "Destinatário não encontrado" });
                }

                const event = await sendDirectMessage({
                    senderPrivkeyHex: socket.currentUser.secretKey,
                    senderPubkey: socket.currentUser.publicKey,
                    recipientPubkey: recipient.publicKey,
                    content
                });

                const message = {
                    id: event.id,
                    content,
                    senderId: socket.currentUser.id,
                    createdAt: new Date(event.created_at * 1000).toISOString()
                };

                io.to(String(chatId)).emit("new_message", message);
            } catch (err) {
                console.error("Erro ao enviar mensagem:", err.message);
                socket.emit("error_message", { message: "Falha ao enviar mensagem" });
            }
        });

        socket.on("disconnect", () => {
            console.log("Usuário desconectado", socket.id);
        });
    });
}