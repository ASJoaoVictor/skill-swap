// test-client.js
import { io } from "socket.io-client";

const socket = io("https://stunning-barnacle-jj75qw6qjq54cp64j-3000.app.github.dev");

console.log("Conectando ao servidor de chat...");

socket.on("connect", () => {
  console.log("Conectado:", socket.id);

  socket.emit("join_chat", "chat_123");

  setTimeout(() => {
    socket.emit("send_message", { chatId: "chat_123", text: "Mensagem de teste!" });
  }, 500);
});

socket.on("new_message", (msg) => {
  console.log("Nova mensagem recebida:", msg);
});