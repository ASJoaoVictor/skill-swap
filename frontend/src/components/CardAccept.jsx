import { useEffect, useState } from "react";
import { CircleUserRound, ThumbsUp, ThumbsDown, MessageCircle } from 'lucide-react';
import CardMatch from "./CardMatch";

import ChatModal from "./ChatModal";
import api  from "../services/api";

const CardAccept = ({match, cancelMatch}) => {

    const [contact, setContact] = useState(null);
    const [chatOpen, setChatOpen] = useState(false);

    useEffect(() => {
        async function load(){
            try{
                const response = await api.get("users/get");
                const email = response.data.email;
                if(email === match.user_receiver.email){
                    setContact(match.user_requester);
                }else{
                    console.log(match.user_receiver.skills)
                    setContact(match.user_receiver);
                }
            }catch(err){
                console.log("Erro ao verificar usuário" + err);
            }
        }
        load();
    }, [])

    const copiarEmail= async () => {
        await navigator.clipboard.writeText(contact.email);

        alert("Email copiado");
    }

    if(!contact){
        return <p className="text-center">carregando</p>
    }

    return <div className="flex justify-center bg-white rounded-md">
            <div>
                <div className="flex items-center gap-2">
                {contact.url_img ? 
                    <img src={contact.url_img} alt="foto-perfil.png" className="h-20 rounded-full" />: 
                    <CircleUserRound size={80} strokeWidth='1' className='text-purple'/>
                }
                
                <div>
                    <p>{contact.username}</p>
                    <p onClick={copiarEmail} className="cursor-pointer hover:underline hover:opacity-70">Contato: <b>{contact.email}</b></p>

                    <button
                        onClick={() => setChatOpen(true)}
                        className="flex items-center gap-1 px-3 py-2 bg-purple-600 text-white rounded-lg text-sm hover:bg-purple-700 transition"
                    >
                        <MessageCircle size={16} />
                        Chat
                    </button>
                </div>
            </div>

            <hr className="mx-8 text-gray-400"/>
            <p className="w-full text-center">Avalie sua interação com essa pessoa</p>
            <div className="flex justify-center gap-8 w-full">
                <ThumbsDown size={35} className="hover:fill-purple hover:text-purple"/>
                <ThumbsUp size={35}/>    
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