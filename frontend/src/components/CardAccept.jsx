import { useEffect, useState } from "react";
import { CircleUserRound, ThumbsUp, ThumbsDown, MessageCircle } from 'lucide-react';
import CardMatch from "./CardMatch";

import ChatModal from "./ChatModal";
import api  from "../services/api";

const CardAccept = ({match, cancelMatch}) => {

    const [contact, setContact] = useState(null);
    const [rating, setRating] = useState(null);
    const [isRequester, setIsRequester] = useState(false);
    const [chatOpen, setChatOpen] = useState(false);
    
    async function handleRating(action){
        try{
            const response = await api.put("/match/like", {
                match_id: match.id,
                action: action
            });

            const updated = response.data;
            const newRating = isRequester ? updated.ratingRequester : updated.ratingReceiver;
            setRating(newRating);

        }catch(err){
            console.log("erro ao avaliar " + err.message);
        }
    };

    useEffect(() => {
        async function load(){
            try{
                const response = await api.get("users/get");
                const email = response.data.email;
                if(email === match.user_receiver.email){
                    setContact(match.user_requester);
                    setRating(match.ratingReceiver);
                    setIsRequester(false);
                }else{
                    setContact(match.user_receiver);
                    setRating(match.ratingRequester);
                    setIsRequester(true);
                }
            }catch(err){
                console.log("Erro ao verificar usuário " + err);
            }
        }
        load();
    }, []);

    if(!contact){
        return <p className="text-center">carregando</p>
    }

    return <div className="flex flex-col justify-center px-4 bg-white rounded-md">
            <div className="flex justify-between items-center">
                <div className="flex items-center gap-2">
                    {contact.url_img ? 
                        <img src={contact.url_img} alt="foto-perfil.png" className="h-20 rounded-full" />: 
                        <CircleUserRound size={80} strokeWidth='1' className='text-purple'/>
                    }
                    <p>{contact.username}</p>
                    <p>{match.id}</p>
                </div>
                <button
                    onClick={() => setChatOpen(true)}
                    className="flex items-center h-fit gap-1 px-3 py-2 bg-purple text-white rounded-lg text-sm hover:opacity-70 transition"
                >
                    <MessageCircle size={16} />
                    Chat
                </button>
            </div>

            <hr className="mx-8 text-gray-400"/>
            <div className="flex justify-between items-center my-4">
                <p className="w-full ml-2">Avalie sua interação</p>
                <div className="flex gap-4">
                    <button
                        onClick={() => handleRating("DESLIKE")}
                        className={`w-9 h-9 rounded-md border flex items-center justify-center transition bg-light-purple border-green/20
                            ${rating == "DOWN"
                                ? "bg-red-50 border-red-300 text-red-600"
                                : "text-gray-300 hover:text-purple hover:border-purple/50"
                            } 
                            
                        `}
                    >
                        <ThumbsDown size={16}/>
                    </button>
                    <button
                        onClick={() => handleRating("LIKE")}
                        className={`w-9 h-9 rounded-md border flex items-center justify-center transition bg-light-purple border-green/20
                            ${rating == "UP"
                                ? "bg-green-50 border-green-300 text-green-700"
                                : "text-gray-300 hover:text-green-500 hover:border-green/50"
                            } 
                            
                        `}
                    >
                        <ThumbsUp size={16}/>    
                    </button>
                </div>
            </div>
            {chatOpen && (
                <ChatModal
                    contact={contact}
                    onClose={() => setChatOpen(false)}
                />
            )}
            </div>
}

export default CardAccept;