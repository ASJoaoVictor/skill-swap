// sockets/chatSocket.js
import { prisma } from "../modules/prisma.js";
import { sendDirectMessage } from "../modules/nostr.js";

export function registerChatSocket(io) {
    io.on("connection", (socket) => {
        console.log("Usuário conectado: ", socket.id);

        socket.on("join_chat", async (chatId) => {
            socket.join(String(chatId));

            try {
                const messages = await prisma.message.findMany({
                    where: { chatId: chatId },
                    orderBy: { createdAt: "asc" },
                    take: 50,
                    include: { sender: { select: { id: true, username: true } } }
                });

                socket.emit("chat_history", messages);
            } catch (err) {
                console.error("Erro ao buscar histórico:", err.message);
            }
        });

        socket.on("send_message", async (data) => {
            const { chatId, content, senderId } = data;

            try {
                const chat = await prisma.chat.findUnique({
                    where: { id: chatId },
                    include: { participants: true }
                });

                if (!chat) {
                    return socket.emit("error_message", { message: "Chat não encontrado" });
                }

                const sender = chat.participants.find(p => p.id === parseInt(senderId));
                const recipient = chat.participants.find(p => p.id !== parseInt(senderId));

                if (!sender || !recipient) {
                    return socket.emit("error_message", { message: "Usuário não participa deste chat" });
                }

                console.log({
                    senderId: sender.id,
                    senderSecretKey: sender.secretKey,
                    senderPublicKey: sender.publicKey,
                    recipientPublicKey: recipient.publicKey,
                });

                const event = await sendDirectMessage({
                    senderPrivkeyHex: sender.secretKey,
                    senderPubkey: sender.publicKey,
                    recipientPubkey: recipient.publicKey,
                    content
                });

                const message = await prisma.message.create({
                    data: {
                        content,
                        nostrEventId: event.id,
                        sender: { connect: { id: sender.id } },
                        chat: { connect: { id: chat.id } }
                    },
                    include: { sender: { select: { id: true, username: true } } }
                });

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