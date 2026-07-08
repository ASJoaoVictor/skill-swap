// backend/routes/chatRouter.js
import express from "express";
import { tokenValited } from "../modules/auth.js";
import { prisma } from "../modules/prisma.js";
import { sendDirectMessage, subscribeToDirectMessages } from "../modules/nostr.js";

const router = express.Router();

router.use(tokenValited);

// Lista todos os chats do usuário logado, com os participantes
router.get("/", async (req, res) => {
    const { user } = req.headers;
    const currentUser = JSON.parse(user);

    try {
        const chats = await prisma.chat.findMany({
            where: {
                participants: { some: { id: currentUser.id } }
            },
            include: {
                participants: true
            },
            orderBy: { createAt: "desc" }
        });

        res.status(200).json(chats);
    } catch (err) {
        console.log(err);
        res.status(500).json({ message: err.message });
    }
});

// Cria (ou retorna, se já existir) o chat entre o usuário logado e outro usuário
router.post("/", async (req, res) => {
    const { user } = req.headers;
    const currentUser = JSON.parse(user);
    const { senderId } = req.body;

    try {
        let chat = await prisma.chat.findFirst({
            where: {
                AND: [
                    { participants: { some: { id: currentUser.id } } },
                    { participants: { some: { id: parseInt(senderId) } } },
                ]
            }
        });

        if (!chat) {
            chat = await prisma.chat.create({
                data: {
                    participants: {
                        connect: [
                            { id: currentUser.id },
                            { id: parseInt(senderId) },
                        ]
                    }
                }
            });
        }

        res.status(200).json(chat);
    } catch (err) {
        console.log(err);
        res.status(500).json({ message: err.message });
    }
});

// Busca o histórico de mensagens do chat direto nos relays Nostr (não há persistência no banco).
// Abre uma subscription temporária, coleta os eventos até o EOSE (fim do backlog) ou timeout, e fecha.
router.get("/:chatId/messages", async (req, res) => {
    const { user } = req.headers;
    const currentUser = JSON.parse(user);
    const { chatId } = req.params;

    try {
        const chat = await prisma.chat.findUnique({
            where: { id: chatId },
            include: { participants: true }
        });

        if (!chat) {
            return res.status(404).json({ message: "Chat não encontrado" });
        }

        const recipient = chat.participants.find(p => p.id !== currentUser.id);
        const isParticipant = chat.participants.some(p => p.id === currentUser.id);

        if (!isParticipant || !recipient) {
            return res.status(403).json({ message: "Você não participa deste chat" });
        }

        // precisa da secretKey, que não vem no token (safeUser não a inclui)
        const me = await prisma.users.findUnique({ where: { id: currentUser.id } });

        const messages = await new Promise((resolve) => {
            const collected = [];

            const sub = subscribeToDirectMessages({
                userPrivkeyHex: me.secretKey,
                userPubkey: me.publicKey,
                onMessage: (rumor) => {
                    const isFromRecipient = rumor.pubkey === recipient.publicKey;
                    const isToRecipient = rumor.tags.some(
                        ([tag, value]) => tag === "p" && value === recipient.publicKey
                    );

                    if (isFromRecipient || isToRecipient) {
                        collected.push({
                            content: rumor.content,
                            createdAt: new Date(rumor.created_at * 1000),
                            senderPubkey: rumor.pubkey,
                            sender: rumor.pubkey === me.publicKey
                                ? { id: me.id, username: me.username }
                                : { id: recipient.id, username: recipient.username }
                        });
                    }
                }
            });

            // dá um tempo pros relays devolverem o backlog, depois fecha e resolve
            const timeout = setTimeout(() => {
                sub.close();
                collected.sort((a, b) => a.createdAt - b.createdAt);
                resolve(collected);
            }, 3000);
        });

        res.status(200).json(messages);
    } catch (err) {
        console.log(err);
        res.status(500).json({ message: err.message });
    }
});

// Envia uma mensagem no chat (criptografada via Nostr NIP-17, sem persistir no banco)
router.post("/:chatId/messages", async (req, res) => {
    const { user } = req.headers;
    const currentUser = JSON.parse(user);
    const { chatId } = req.params;
    const { content } = req.body;

    if (!content) {
        return res.status(400).json({ message: "Mensagem vazia" });
    }

    try {
        const chat = await prisma.chat.findUnique({
            where: { id: chatId },
            include: { participants: true }
        });

        if (!chat) {
            return res.status(404).json({ message: "Chat não encontrado" });
        }

        const sender = chat.participants.find(p => p.id === currentUser.id);
        const recipient = chat.participants.find(p => p.id !== currentUser.id);

        if (!sender || !recipient) {
            return res.status(403).json({ message: "Você não participa deste chat" });
        }

        const event = await sendDirectMessage({
            senderPrivkeyHex: sender.secretKey,
            senderPubkey: sender.publicKey,
            recipientPubkey: recipient.publicKey,
            content
        });

        res.status(200).json({
            content,
            nostrEventId: event.id,
            createdAt: new Date(event.created_at * 1000),
            sender: { id: sender.id, username: sender.username }
        });
    } catch (err) {
        console.log(err);
        res.status(500).json({ message: err.message });
    }
});

export default router;