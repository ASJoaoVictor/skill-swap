// backend/sockets/chatSocket.js
import { prisma } from "../modules/prisma.js";
import { sendDirectMessage, subscribeToDirectMessages } from "../modules/nostr.js";

// guarda a subscription Nostr ativa de cada socket
const activeSubs = new Map();

export function registerChatSocket(io) {
    io.on("connection", (socket) => {
        console.log("Usuário conectado: ", socket.id);

        socket.on("join_chat", async ({ chatId, userId }) => {
            socket.join(String(chatId));

            try {
                const chat = await prisma.chat.findFirst({
                    where: { id: chatId },
                    include: { participants: true }
                });

                if (!chat) {
                    return socket.emit("error_message", { message: "Chat não encontrado" });
                }

                const me = chat.participants.find(p => p.id === parseInt(userId));
                const recipient = chat.participants.find(p => p.id !== parseInt(userId));

                if (!me || !recipient) {
                    return socket.emit("error_message", { message: "Usuário não participa deste chat" });
                }

                // fecha subscription anterior desse socket (ex: trocou de contato)
                activeSubs.get(socket.id)?.close();

                // assina só mensagens que chegarem DAQUI PRA FRENTE (sem histórico)
                const sub = subscribeToDirectMessages({
                    userPrivkeyHex: me.secretKey,
                    userPubkey: me.publicKey,
                    onMessage: (rumor) => {
                        const isFromRecipient = rumor.pubkey === recipient.publicKey;
                        const isToRecipient = rumor.tags.some(([t, v]) => t === "p" && v === recipient.publicKey);

                        if (!isFromRecipient && !isToRecipient) return;

                        io.to(String(chatId)).emit("new_message", {
                            content: rumor.content,
                            createdAt: new Date(rumor.created_at * 1000),
                            usersId: rumor.pubkey === me.publicKey ? me.id : recipient.id,
                            sender: rumor.pubkey === me.publicKey
                                ? { id: me.id, username: me.username }
                                : { id: recipient.id, username: recipient.username }
                        });
                    }
                });

                activeSubs.set(socket.id, sub);

            } catch (err) {
                console.error("Erro ao entrar no chat:", err.message);
                socket.emit("error_message", { message: "Falha ao entrar no chat" });
            }
        });

        socket.on("send_message", async ({ chatId, content, senderId }) => {
            try {
                const chat = await prisma.chat.findFirst({
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

                const event = await sendDirectMessage({
                    senderPrivkeyHex: sender.secretKey,
                    senderPubkey: sender.publicKey,
                    recipientPubkey: recipient.publicKey,
                    content
                });

                // emite pro remetente na hora (o destinatário recebe via subscription, se estiver online)
                io.to(String(chatId)).emit("new_message", {
                    content,
                    createdAt: new Date(event.created_at * 1000),
                    usersId: sender.id,
                    sender: { id: sender.id, username: sender.username }
                });
            } catch (err) {
                console.error("Erro ao enviar mensagem:", err.message);
                socket.emit("error_message", { message: "Falha ao enviar mensagem" });
            }
        });

        socket.on("disconnect", () => {
            activeSubs.get(socket.id)?.close();
            activeSubs.delete(socket.id);
            console.log("Usuário desconectado", socket.id);
        });
    });
}