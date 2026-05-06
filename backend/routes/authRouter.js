import express from "express";
import jsonwebtoken from "jsonwebtoken";
import { prisma } from "../modules/prisma.js";

const router = express.Router();

router.post("/login", async (req, res) => {
    const [, hash] = req.headers.authorization?.split(" ") || [" ", " "];
    const [email, password] = Buffer.from(hash, "base64").toString().split(":");
    console.log("hash")
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

router.post("/register", async (req, res) => {
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

export default router;