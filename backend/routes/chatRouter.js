import express from "express";
import jsonwebtoken from "jsonwebtoken";
import { tokenValited } from "../modules/auth.js";
import { prisma } from "../modules/prisma.js";

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

            res.status(200).json(chat)
    }catch(err){
        console.log(err);
        res.status(500).json({message: err.message});
    }

});

export default router;
