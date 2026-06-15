import jsonwebtoken from "jsonwebtoken";
import dotenv from "dotenv";
dotenv.config();

export function tokenValited(req, res, next){
    const [, token] = req.headers.authorization?.split(" ") || [" ", " "];

    if(!token) return res.status(401).send("Access denied. No token provider");

    try{
        const payload = jsonwebtoken.verify(token, process.env.PRIVATE_KEY);
        const userIdFromToken = typeof payload !== "string" && payload.user;
        
        if(!userIdFromToken){
            return res.status(401).json({ message: "Invalid token" });
        }
        
        req.headers["user"] = payload.user;

        return next();
    }catch(err){
        console.log(err);
        return res.status(401).json({ message: "Invalid token" });
    }
}