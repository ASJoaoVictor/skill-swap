import express from "express";
import { tokenValited } from "../modules/auth.js";
import { prisma } from "../modules/prisma.js";

const router = express.Router();

router.use(tokenValited);

function buildChatId(idA, idB) {
    const [a, b] = [idA, idB].sort((x, y) => x - y);
    return `${a}_${b}`;
}

// "Abre" uma conversa com outro usuário. Não persiste nada:
// retorna só um id determinístico baseado nos dois participantes.
router.post("/", async (req, res) => {
    const { user } = req.headers;
    const currentUser = JSON.parse(user);
    const { senderId } = req.body;

    try {
        const otherId = parseInt(senderId);

        const otherUser = await prisma.users.findUnique({
            where: { id: otherId }
        });

        if (!otherUser) {
            return res.status(404).json({ message: "Usuário não encontrado" });
        }

        res.status(200).json({
            id: buildChatId(currentUser.id, otherId),
            participants: [
                { id: currentUser.id },
                { id: otherUser.id, username: otherUser.username, url_img: otherUser.url_img }
            ]
        });
    } catch (err) {
        console.log(err);
        res.status(500).json({ message: err.message });
    }
});

export default router;