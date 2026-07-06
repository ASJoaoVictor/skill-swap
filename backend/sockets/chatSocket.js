import jsonwebtoken from "jsonwebtoken";
import { prisma } from "../modules/prisma.js";
import { sendDirectMessage, subscribeToDirectMessages } from "../modules/nostr.js";

function buildChatId(idA, idB) {
    const [a, b] = [idA, idB].sort((x, y) => x - y);
    return `${a}_${b}`;
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

        // A entrega de verdade acontece aqui: assina os relays e só emite
        // pro front quando o gift wrap correspondente chega e é decriptado.
        const subscription = subscribeToDirectMessages({
            userPrivkeyHex: socket.currentUser.secretKey,
            userPubkey: socket.currentUser.publicKey,
            onMessage: async (rumor) => {
                try {
                    const recipientTag = rumor.tags.find(([t]) => t === "p");
                    const recipientPubkey = recipientTag ? recipientTag[1] : null;

                    const otherPubkey =
                        rumor.pubkey === socket.currentUser.publicKey
                            ? recipientPubkey
                            : rumor.pubkey;

                    if (!otherPubkey) return;

                    const otherUser = await prisma.users.findFirst({
                        where: { publicKey: otherPubkey }
                    });

                    if (!otherUser) return;

                    const chatId = buildChatId(socket.currentUser.id, otherUser.id);

                    if (!socket.rooms.has(chatId)) return;

                    socket.emit("new_message", {
                        content: rumor.content,
                        senderId:
                            rumor.pubkey === socket.currentUser.publicKey
                                ? socket.currentUser.id
                                : otherUser.id,
                        createdAt: new Date(rumor.created_at * 1000).toISOString()
                    });
                } catch (err) {
                    console.error("Erro ao processar mensagem recebida:", err.message);
                }
            }
        });

        socket.on("join_chat", (chatId) => {
            socket.join(String(chatId));
        });

        socket.on("send_message", async (data) => {
            const { chatId, content } = data;

            try {
                const ids = chatId.split("_").map(Number);
                const otherId = ids.find((id) => id !== socket.currentUser.id);

                if (otherId === undefined) {
                    return socket.emit("error_message", { message: "Você não participa deste chat" });
                }

                const recipient = await prisma.users.findUnique({
                    where: { id: otherId }
                });

                if (!recipient) {
                    return socket.emit("error_message", { message: "Destinatário não encontrado" });
                }

                // Só publica. Não emite "new_message" aqui — a entrega
                // acontece via subscription acima, quando o gift wrap
                // chegar de volta pelos relays.
                await sendDirectMessage({
                    senderPrivkeyHex: socket.currentUser.secretKey,
                    senderPubkey: socket.currentUser.publicKey,
                    recipientPubkey: recipient.publicKey,
                    content
                });
            } catch (err) {
                console.error("Erro ao enviar mensagem:", err.message);
                socket.emit("error_message", { message: "Falha ao enviar mensagem" });
            }
        });

        socket.on("disconnect", () => {
            console.log("Usuário desconectado", socket.id);
            subscription?.close();
        });
    });
}