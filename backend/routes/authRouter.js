import dotenv from "dotenv";
dotenv.config();
import express from "express";
import jsonwebtoken from "jsonwebtoken";
import bcrypt from "bcrypt";
import { OAuth2Client } from "google-auth-library"
import { prisma } from "../modules/prisma.js";
import { generateNostrIdentity } from "../modules/nostr.js";

const router = express.Router();

const client = new OAuth2Client(
    process.env.CLIENT_ID
)

router.post("/login", async (req, res) => {
    const [, hash] = req.headers.authorization?.split(" ") || [" ", " "];
    const [email, password] = Buffer.from(hash, "base64").toString().split(":");
    try{
        const user = await prisma.users.findFirst({
            where: {email: email.toLowerCase().trim()}
        })

        if(!user) return res.status(401).json({ message: "Password or E-mail incorrect" })
        
        const isMatch = await bcrypt.compare(password, user.password);

        if(!isMatch) return res.status(401).json({ message: "Password or E-mail incorrect" });

        const safeUser = {
            id: user.id,
            username: user.username,
            email: user.email,
            publicKey: user.publicKey,
        };

        const token = jsonwebtoken.sign(
            {user: JSON.stringify(safeUser)},
            process.env.PRIVATE_KEY,
            { expiresIn: "1h" }
        )

        return res.status(200).json({user, token});
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
        const { pubkey, privkeyHex } = generateNostrIdentity();
        const passwordHash = await bcrypt.hash(password, 10);

        const user = await prisma.users.create({
            data: {
                email: email,
                username: name,
                password: passwordHash,
                secretKey: privkeyHex,
                publicKey: pubkey
            }
        })

        const safeUser = {
            id: user.id,
            username: user.username,
            email: user.email,
            publicKey: user.publicKey,
        };
        
        const token = jsonwebtoken.sign(
            {user: JSON.stringify(safeUser)},
            process.env.PRIVATE_KEY,
            { expiresIn: "1h" }
        )

        return res.status(200).json({user, token});

    }catch(e){
        res.status(400).json({message: e.message})
    }
});

router.post("/login/google", async (req, res) => {
    try{
        let { token } = req.body;
        console.log(process.env.CLIENT_ID);
        const ticket = await client.verifyIdToken({
            idToken: token,
            audience: process.env.CLIENT_ID
        });

        const payload = ticket.getPayload();

        let user = await prisma.users.findFirst({
            where: {
                email: payload.email
            }
        });

        if(!user){
            const { pk, sk } = generateNostrIdentity();

            user = await prisma.users.create({
                data: {
                    email: email,
                    username: name,
                    secretKey: sk,
                    publicKey: pk
                }
            });

        }

        const safeUser = {
            id: user.id,
            username: user.username,
            email: user.email,
            publicKey: user.publicKey,
        };
        
        const jwtToken = jsonwebtoken.sign(
            {user: JSON.stringify(safeUser)},
            process.env.PRIVATE_KEY,
            { expiresIn: "1h" }
        )

        return res.status(200).json({user, jwtToken});

        


    }catch(err){
        console.log(err);
    }
});

export default router;