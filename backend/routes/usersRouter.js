import express from "express";
import { prisma } from "../modules/prisma.js"
import { tokenValited } from "../modules/auth.js";

const router = express.Router();

router.use(tokenValited);

router.get("/", async (req, res) => {
    const {user} = req.headers;
    const currentUser = JSON.parse(user);
    
    try{
        const users = await prisma.users.findMany({
            where: {
                id: {
                    not: currentUser.id
                }
            },
            include: {
                skills: {
                    include: {
                        category: true
                    }
                },
            }
        });
        res.status(200).json(users);
    }catch(err){
        res.status(400).jsom({message: "Erro"})
    }
    
});

router.get("/get", async (req, res) => {
    const {user} = req.headers;
    const currentUser = JSON.parse(user);

    try{
        const userData = await prisma.users.findUnique({
            where: {
                id: currentUser.id
            },
            include: {
                skills: {
                    include: {
                        category: true
                    }
                },
                _count: {
                    select: {
                        matchesReceived: {
                            where: {
                                rating: "UP"
                            }
                        },
                        matchesRequested: {
                            where: {
                                rating: "UP"
                            }
                        }
                    }
                }
            },
        });

        res.status(200).json(userData);
    }catch(err){
        console.log(err);
        res.status(404).json({ message: "Not found" })
    }

});

export default router;