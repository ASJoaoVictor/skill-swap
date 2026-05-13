import express from "express";
import {prisma} from "../modules/prisma.js";
import { tokenValited } from "../modules/auth.js";

const router = express.Router();

router.use(tokenValited);

router.get("/", async (req, res) => {
    try{
        const categories = await prisma.category.findMany();

        res.status(200).json(categories)
    }catch(error){
        res.status(404).json({message: error.message})
    }
});

export default router;