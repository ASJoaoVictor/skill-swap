import express from "express";
import jsonwebtoken from "jsonwebtoken";
import { prisma } from "../modules/prisma.js";

const router = express.Router();

router.post("/", async (req, res) => {
    const [, token] = req.headers.authorization?.split(" ") || [];
    
    if (!token) return res.status(401).json({ message: "Token não encontrado" });

    const decoded = jsonwebtoken.verify(token, process.env.PRIVATE_KEY);
    const currentUser = JSON.parse(decoded.user);

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

            res.status(200).json(chat)
    }catch(err){
        console.log(err);
        res.status(500).json({message: err.message});
    }

});

export default router;
