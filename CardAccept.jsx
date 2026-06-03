// src/components/CardAccept.jsx
import { useEffect, useState } from "react";
import { CircleUserRound, ThumbsUp, ThumbsDown, MessageCircle } from "lucide-react";
import api from "../services/api";
import ChatModal from "./ChatModal";

const CardAccept = ({ match, cancelMatch }) => {
    const [contact, setContact] = useState(null);
    const [chatOpen, setChatOpen] = useState(false);

    useEffect(() => {
        async function load() {
            try {
                const response = await api.get("users/get");
                const email = response.data.email;
                if (email === match.user_receiver.email) {
                    setContact(match.user_requester);
                } else {
                    setContact(match.user_receiver);
                }
            } catch (err) {
                console.log("Erro ao verificar usuário" + err);
            }
        }
        load();
    }, []);

    const copiarEmail = async () => {
        await navigator.clipboard.writeText(contact.email);
        alert("Email copiado");
    };

    if (!contact) {
        return <p className="text-center">carregando</p>;
    }

    return (
        <>
            <div className="flex justify-center bg-white rounded-md">
                <div className="w-full">
                    <div className="flex items-center gap-2 p-3">
                        {contact.url_img ? (
                            <img src={contact.url_img} alt="foto-perfil.png" className="h-20 rounded-full" />
                        ) : (
                            <CircleUserRound size={80} strokeWidth="1" className="text-purple-500" />
                        )}

                        <div className="flex-1">
                            <p>{contact.username}</p>
                            <p
                                onClick={copiarEmail}
                                className="cursor-pointer hover:underline hover:opacity-70"
                            >
                                Contato: <b>{contact.email}</b>
                            </p>
                        </div>

                        {/* Botão de chat */}
                        <button
                            onClick={() => setChatOpen(true)}
                            className="flex items-center gap-1 px-3 py-2 bg-purple-600 text-white rounded-lg text-sm hover:bg-purple-700 transition"
                        >
                            <MessageCircle size={16} />
                            Chat
                        </button>
                    </div>

                    <hr className="mx-8 text-gray-400" />
                    <p className="w-full text-center py-1">Avalie sua interação com essa pessoa</p>
                    <div className="flex justify-center gap-8 w-full pb-3">
                        <ThumbsDown size={35} className="hover:fill-purple-500 hover:text-purple-500 cursor-pointer" />
                        <ThumbsUp size={35} className="hover:fill-purple-500 hover:text-purple-500 cursor-pointer" />
                    </div>
                </div>
            </div>

            {/* Modal de chat */}
            {chatOpen && (
                <ChatModal
                    contact={contact}
                    onClose={() => setChatOpen(false)}
                />
            )}
        </>
    );
};

export default CardAccept;
