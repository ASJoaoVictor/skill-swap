import express from "express";
import jsonwebtoken from "jsonwebtoken";
import { tokenValited } from "../modules/auth.js";
import { prisma } from "../modules/prisma.js";
import { sendDirectMessage } from "../modules/nostr.js";

const router = express.Router();

router.use(tokenValited);

router.post("/", async (req, res) => {
    const {user} = req.headers;
    const currentUser = JSON.parse(user);
    const {senderId} = req.body;

    try{
        let chat = await prisma.chat.findFirst({
            where: {
                AND: [
                    {participants: {some: { id: currentUser.id}}},
                    {participants: {some: { id: parseInt(senderId)}}},
                ]
            }
        });

        if(!chat){
            chat = await prisma.chat.create({
                data: {
                    participants: {
                        connect: [
                            {id: currentUser.id},
                            {id: parseInt(senderId)},
                        ]
                    }
                }
            });
        }

        res.status(200).json(chat);
    }catch(err){
        console.log(err);
        res.status(500).json({message: err.message});
    }

});

router.post("/:chatId/messages", async (req, res) => {
    const {user} = req.headers;
    const currentUser = JSON.parse(user);
    const {chatId} = req.params;
    const {content} = req.body;

    if(!content){
        return res.status(400).json({message: "Mensagem vazia"});
    }

    try{
        const chat = await prisma.chat.findUnique({
            where: {id: parseInt(chatId)},
            include: {participants: true}
        });

        if(!chat){
            return res.status(404).json({message: "Chat não encontrado"});
        }

        const sender = chat.participants.find(p => p.id === currentUser.id);
        const recipient = chat.participants.find(p => p.id !== currentUser.id);

        if(!sender || !recipient){
            return res.status(403).json({message: "Você não participa deste chat"});
        }

        const event = await sendDirectMessage({
            senderPrivkeyHex: sender.secretKey,
            senderPubkey: sender.publicKey,
            recipientPubkey: recipient.publicKey,
            content
        });

        const message = await prisma.message.create({
            data: {
                content,
                chatId: chat.id,
                userId: sender.id,
                nostrEventId: event.id
            }
        });

        res.status(200).json(message);
    }catch(err){
        console.log(err);
        res.status(500).json({message: err.message});
    }
});

export default router;
