// src/components/ChatModal.jsx
import { useEffect, useRef, useState } from "react";
import { X, Send, CircleUserRound } from "lucide-react";
import { useSocket } from "../services/useSocket";
import api from "../services/api";
import { jwtDecode } from "jwt-decode";

const ChatModal = ({ contact, onClose }) => {
    const [messages, setMessages] = useState([]);
    const [text, setText] = useState("");
    const [chatId, setChatId] = useState(null);
    const [loading, setLoading] = useState(true);
    const bottomRef = useRef(null);
    const socketRef = useSocket();

    // Pega o ID do usuário logado a partir do token
    const token = localStorage.getItem("token");
    const myId = token ? jwtDecode(token).id : null;

    useEffect(() => {
        async function initChat() {
            try {
                // Cria ou busca o chat entre os dois usuários
                const res = await api.post("/chat", {
                    userAId: myId,
                    userBId: contact.id
                });
                const chat = res.data;
                setChatId(chat.id);

                // Entra na room do socket
                socketRef.current.emit("join_chat", chat.id);
            } catch (err) {
                console.error("Erro ao iniciar chat:", err);
            } finally {
                setLoading(false);
            }
        }
        initChat();

        // Recebe histórico ao entrar
        socketRef.current.on("chat_history", (history) => {
            setMessages(history);
        });

        // Recebe mensagens em tempo real
        socketRef.current.on("new_message", (msg) => {
            setMessages((prev) => [...prev, msg]);
        });

        return () => {
            socketRef.current.off("chat_history");
            socketRef.current.off("new_message");
        };
    }, [contact.id]);

    // Scroll automático para última mensagem
    useEffect(() => {
        bottomRef.current?.scrollIntoView({ behavior: "smooth" });
    }, [messages]);

    const sendMessage = () => {
        if (!text.trim() || !chatId) return;

        socketRef.current.emit("send_message", {
            chatId,
            text,
            senderId: myId
        });

        setText("");
    };

    const handleKeyDown = (e) => {
        if (e.key === "Enter" && !e.shiftKey) {
            e.preventDefault();
            sendMessage();
        }
    };

    return (
        <div className="fixed inset-0 z-50 flex items-end justify-end p-4">
            {/* Overlay */}
            <div
                className="absolute inset-0 bg-black/30 backdrop-blur-sm"
                onClick={onClose}
            />

            {/* Chat window */}
            <div className="relative z-10 flex flex-col w-full max-w-md h-[520px] bg-white rounded-2xl shadow-2xl overflow-hidden">

                {/* Header */}
                <div className="flex items-center gap-3 px-4 py-3 bg-purple-600 text-white">
                    {contact.url_img ? (
                        <img src={contact.url_img} className="w-10 h-10 rounded-full object-cover" alt="" />
                    ) : (
                        <CircleUserRound size={40} strokeWidth={1.5} />
                    )}
                    <div className="flex-1">
                        <p className="font-semibold">{contact.username}</p>
                        <p className="text-xs opacity-70">{contact.email}</p>
                    </div>
                    <button onClick={onClose} className="hover:opacity-70 transition">
                        <X size={20} />
                    </button>
                </div>

                {/* Messages */}
                <div className="flex-1 overflow-y-auto px-4 py-3 flex flex-col gap-2 bg-gray-50">
                    {loading && (
                        <p className="text-center text-sm text-gray-400">Carregando...</p>
                    )}
                    {!loading && messages.length === 0 && (
                        <p className="text-center text-sm text-gray-400 mt-8">
                            Nenhuma mensagem ainda. Diga olá! 👋
                        </p>
                    )}
                    {messages.map((msg) => {
                        const isMine = msg.usersId === myId;
                        return (
                            <div
                                key={msg.id}
                                className={`flex ${isMine ? "justify-end" : "justify-start"}`}
                            >
                                <div
                                    className={`max-w-[75%] px-4 py-2 rounded-2xl text-sm ${
                                        isMine
                                            ? "bg-purple-600 text-white rounded-br-sm"
                                            : "bg-white text-gray-800 shadow rounded-bl-sm"
                                    }`}
                                >
                                    {msg.text}
                                    <p className={`text-[10px] mt-1 ${isMine ? "text-purple-200" : "text-gray-400"}`}>
                                        {new Date(msg.createAt).toLocaleTimeString("pt-BR", {
                                            hour: "2-digit",
                                            minute: "2-digit"
                                        })}
                                    </p>
                                </div>
                            </div>
                        );
                    })}
                    <div ref={bottomRef} />
                </div>

                {/* Input */}
                <div className="flex items-center gap-2 px-4 py-3 border-t bg-white">
                    <input
                        type="text"
                        value={text}
                        onChange={(e) => setText(e.target.value)}
                        onKeyDown={handleKeyDown}
                        placeholder="Digite uma mensagem..."
                        className="flex-1 px-4 py-2 rounded-full border border-gray-200 text-sm outline-none focus:border-purple-400 transition"
                    />
                    <button
                        onClick={sendMessage}
                        disabled={!text.trim()}
                        className="w-10 h-10 rounded-full bg-purple-600 text-white flex items-center justify-center hover:bg-purple-700 disabled:opacity-40 transition"
                    >
                        <Send size={16} />
                    </button>
                </div>
            </div>
        </div>
    );
};

export default ChatModal;
