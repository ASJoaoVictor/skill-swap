require("dotenv").config()
const express = require("express");
const { prisma } = require("./prisma");

const app = express();
const port = process.env.PORT;

app.use(express.urlencoded({ extended: true }));

app.get("/", (req, res) => {
    res.send("Hello world!");
});

app.get("/users", async (req, res) => {
    const users = await prisma.users.findMany({
        include: {
            skills: {
                include: {
                    category: true
                }
            },
        }
    });
    res.status(200).json(users);
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

app.post("/skill/create", async (req, res) => {
    console.log("teste");
    const skill = await prisma.skills.create({
        data: {
            name: "teste",
            description: "teste",
            type: "teste",
            usersId: 1,
            categoryId: 1,
        }
    })
    res.status(201).json({message: "deu certo"})
});

app.listen(port, () => {
    console.log("Server running at: https://localhost:" + port);
})