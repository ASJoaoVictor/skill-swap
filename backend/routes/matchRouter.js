import express from "express";
import { prisma } from "../modules/prisma.js";
import { tokenValited } from "../modules/auth.js";
import { MatchStatus, RatingStatus } from "../generated/prisma/index.js";

const router = express.Router();

router.use(tokenValited);

router.post("/send", async (req, res) => {
    const {user} = req.headers;
    const currentUser = JSON.parse(user);

    const {receiverUser} = req.body;

    try{
        const match = await prisma.match.create({
            data: {
                requesterId: currentUser.id,
                receiverId: receiverUser.id
            }
        });

        res.status(200).json({match: match});
    }catch(error){
        res.status(400).json({error: error.message});
    }
});

router.post("/accept", async (req, res) => {
    const {user} = req.headers;
    const currentUser = JSON.parse(user);
    const { id } = req.body;

    try{
        const match = await prisma.match.update({
            where: {
                id: id,
                OR: [
                    {receiverId: currentUser.id},
                    {requesterId: currentUser.id}
                ]
            },
            data:{
                status: MatchStatus.ACCEPTED
            },
        })

        res.status(200).json({message: "success"})
    }catch(error){
        res.status(400).json({error: error.message});
    }

});

router.get("/get/sent", async (req, res) => {
    const { user } = req.headers;
    const currentUser = JSON.parse(user);

    try{
        const matches = await prisma.match.findMany({
            where: {
                requesterId: currentUser.id,
                status: MatchStatus.PENDING
            },
            include: {
                user_receiver: {
                    include: {
                        skills: true,
                    }
                },
                user_requester: {
                    include: {
                        skills: true
                    }
                }
            }
        });

        res.status(200).json(matches);
    }catch(error){
        res.status(400).json({error: error.message});
    }
});

router.get("/get/received", async (req, res) => {
    const { user } = req.headers;
    const currentUser = JSON.parse(user);

    try{
        const matches = await prisma.match.findMany({
            where: {
                receiverId: currentUser.id,
                status: MatchStatus.PENDING
            },
            include: {
                user_receiver: {
                    include: {
                        skills: true,
                    }
                },
                user_requester: {
                    include: {
                        skills: true
                    }
                }
            }
        });
        res.status(200).json(matches);
    }catch(error){
        res.status(500).json({error: error.message});
    }
});

router.get("/get/accepted", async (req, res) => {
    const { user } = req.headers;
    const currentUser = JSON.parse(user);

    try{
        const matches = await prisma.match.findMany({
            where:{
                status: MatchStatus.ACCEPTED,
                OR: [
                    {receiverId: currentUser.id},
                    {requesterId: currentUser.id}
                ]
            },
            distinct: ["requesterId"],
            include: {
                user_receiver: {
                    include: {
                        skills: true,
                    }
                },
                user_requester: {
                    include: {
                        skills: true
                    }
                }
            }
        });

        res.status(200).json(matches);
    }catch(error){
        res.status(400).json({error: error.message});
    }
});

router.post("/cancel&reject", async (req, res) => {
    const {id} = req.body;
    const { user } = req.headers;
    const currentUser = JSON.parse(user);

    try{
        const match = await prisma.match.deleteMany({
            where: {
                id: id,
                OR: [
                    {receiverId: currentUser.id},
                    {requesterId: currentUser.id}
                ]
            }
        });

        res.status(200).json({message: "sucesso"});
    }catch(err){
        res.status(400).json({message: "Erro ao recusar/cancelar skill"});
    }
});

router.put("/like", async (req, res) => {
    const { match_id, action } = req.body;

    const {user} = req.headers;
    const currentUser = JSON.parse(user);

    if(!["LIKE", "DESLIKE"].includes(action)){
        res.status(400).json({message: "Ação inválda"});
    }

    let newRating;
    let inc;
    if(action === "LIKE"){
        newRating = RatingStatus.UP;
        inc = 1;
    }else{
        newRating = RatingStatus.DOWN;
        inc = -1;
    }
    
    try{
        const match = await prisma.match.findUnique({
            where: {id: parseInt(match_id)}
        })

        if(!match)
            res.status(404).json({"message": "match não encontrado!"});

        let field;
        let userLike;
        if(match.receiverId === currentUser.id){
            field = "ratingReceiver";
            userLike = match.requesterId;
        }else if(match.requesterId === currentUser.id){
            field = "ratingRequester";
            userLike = match.receiverId;
        }else{
            res.status(403).json({"message": "Acesso não autorizado."});
        }

        let rating = match[field] === newRating ? null : newRating;

        const updateMatch = await prisma.match.update({
            where: {id: parseInt(match_id)},
            data: {[field]: rating}
        });

        const updateUser = await prisma.users.update({
            where: {id: userLike},
            data: {
                like: {
                    increment: inc,
                }
            }
        });

        console.log(updateMatch)
        console.log(updateUser)

        res.status(200).json(updateMatch);
    }catch(err){
        console.error(err.message);
        res.status(400).json({error: err.message});
    }
});

router.put("/deslike", async (req, res) => {
    const { match_id } = req.body;
    
    try{
        const match = await prisma.match.update({
            where: {
                id: parseInt(match_id),
            },
            data: {
                rating: RatingStatus.DOWN,
            }
        })

        res.status(200).json(match);
    }catch(err){
        console.error(err.message);
        res.status(400).json({error: err.message});
    }
});

export default router;