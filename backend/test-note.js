// backend/test-note.js
import { publishTextNote } from "./modules/nostr.js";
import { prisma } from "./modules/prisma.js";

async function main() {
  const user = await prisma.users.findFirst();

  if (!user?.secretKey) {
    console.log("Usuário sem chave Nostr encontrada.");
    return;
  }

  console.log("Public Key:", user.publicKey);
  console.log("Private Key:", user.secretKey);

  try {
    const event = await publishTextNote({
      privkeyHex: user.secretKey,
      content: "Teste definitivo, Nostr!",
    });
    console.log("Evento enviado com sucesso! ID:", event.id);
  } catch (err) {
    console.log("Erro ao enviar evento:", err.message);
  } finally {
    process.exit(0);
  }
}

main();