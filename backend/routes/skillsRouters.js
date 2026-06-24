import express from "express"
import { prisma } from "../modules/prisma.js";
import { tokenValited } from "../modules/auth.js";

const router = express.Router();

router.use(tokenValited);

router.post("/add", async (req, res) => {
    const {user} = req.headers;
    const currentUser = JSON.parse(user);

    const {name, description, type, categoryId} = req.body;

    try{
        const skill = await prisma.skills.create({
            data: {
                name: name,
                description: description,
                type: type,
                users: {
                    connect: {
                        id: currentUser.id
                    }
                },
                category: {
                    connect: {
                        id: Number(categoryId)
                    }
                }
            }
        });
        res.status(201).json(skill);
    }catch(err){
        console.log(err);
        res.status(400).send("Erro ao adicionar habilidade!")
    }

    
});

router.put("/update", async (req, res) => {
    const data = {};
    const {id, name, category, description} = req.body;
    
    if(name){
        data.name = name;
    }

    if(description){
        data.description = description;
    }

    if(category){
        data.category = {
            connect: {
                id: parseInt(category)
            }
        }
    }

    const updateUser = await prisma.skills.update({
        where: {
            id: Number(id),
        },
        data: data
    });

    res.status(202).json({message: "Ok"})
});

router.delete("/delete/:id", async (req, res) => {
    const id  = parseInt(req.params.id);

    try{
        const deleteSkill = await prisma.skills.delete({
            where: {
                id: Number(id)
            }
        });

        res.status(202).json({message: "Skill delete"});
    }catch(err){
        res.status(400).json({message: err.message});
    }
});

export default router;