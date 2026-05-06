import dotenv from "dotenv";
dotenv.config();

import express from "express";
import { prisma } from "./modules/prisma.js";
import jsonwebtoken from "jsonwebtoken";
import {tokenValited} from "./modules/auth.js";

const app = express();
const port = process.env.PORT;

app.use(express.urlencoded({ extended: true }));

app.get("/", (req, res) => {
    res.send("Hello world!");
});

app.post("/login", async (req, res) => {
    const [, hash] = req.headers.authorization?.split(" ") || [" ", " "];
    const [email, password] = Buffer.from(hash, "base64").toString().split(":");

    try{
        const user = await prisma.users.findFirst({
            where: {email: email.toLowerCase().trim()}
        })
        console.log(user)

        if(!user) return res.status(401).json({ message: "Password or E-mail incorrect" })
        
        const isMatch = await password === user.password;

        if(!isMatch) return res.status(401).json({ message: "Password or E-mail incorrect" });

        const token = jsonwebtoken.sign(
            {user: JSON.stringify(user)},
            process.env.PRIVATE_KEY,
            { expiresIn: "1h" }
        )

        return res.status(200).json({data: {user, token}});
    }catch(err){
        console.log(err);
    }
});

app.post("/register", async (req, res) => {
    const {name, email, password} = req.body;

    if(!name || !email || !password){
        return res.status(400).json({message: "Dados inválidos!"})
    }

    try{
        const user = await prisma.users.create({
            data: {
                email: email,
                username: name,
                password: password
            }
        })
        res.status(201).json({message: "Ok!"})
    }catch(e){
        res.status(400).json({message: e.message})
    }
});

app.use(tokenValited);

app.get("/users", async (req, res) => {
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

app.post("/skill/add", async (req, res) => {
    console.log("teste");
    const skill = await prisma.skills.create({
        data: {
            name: "teste",
            description: "teste",
            type: "teste",
            usersId: 1,
            categoryId: 1,
        }
    });
    res.status(201).json({message: "deu certo"});
});

app.post("/skill/update/:id", async (req, res) => {
    const data = {};
    const {name, description} = req.body;
    
    if(name){
        data.name = name;
    }

    if(description){
        data.description = description;
    }

    const updateUser = await prisma.skills.update({
        where: {
            id: Number(req.params.id),
        },
        data: data
    });

    res.status(202).json({message: "Ok"})
});

app.post("/skill/delete/:id", async (req, res) => {

    try{
        const deleteSkill = await prisma.skills.delete({
            where: {
                id: Number(req.params.id)
            }
        });

        res.status(202).json({message: "Skill delete"});
    }catch(err){
        res.status(400).json({message: err.message});
    }
});

app.listen(port, () => {
    console.log("Server running at: https://localhost:" + port);
})