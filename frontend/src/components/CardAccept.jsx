import { useEffect, useState } from "react";
import { CircleUserRound, ThumbsUp, ThumbsDown } from 'lucide-react';
import CardMatch from "./CardMatch";
import api  from "../services/api";

const CardAccept = ({match, cancelMatch}) => {

    const [contact, setContact] = useState(null);

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
                </div>
            </div>

            <hr className="mx-8 text-gray-400"/>
            <p className="w-full text-center">Avalie sua interação com essa pessoa</p>
            <div className="flex justify-center gap-8 w-full">
                <ThumbsDown size={35} className="hover:fill-purple hover:text-purple"/>
                <ThumbsUp size={35}/>    
            </div>

        </div>
    </div>
}

export default CardAccept;