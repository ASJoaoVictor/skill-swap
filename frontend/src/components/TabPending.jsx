import { useState, useEffect } from "react";
import CardPending from "./CardPending"
import api from "../services/api";
import toast, { Toaster } from "react-hot-toast";


const TabPending = ({matches, load}) => {

    // const [matches, setMatches] = useState([]);

    // useEffect(() => {
    //     load();
    // }, []);

    // async function load(){
    //     try{
    //         const response = await api.get("match/get/received");
    //         setMatches(response.data);
    //     }catch(err){
    //         console.log("Erro ao pegar matchs do banco: ", err)
    //     }
    // }

    const handleAcceptMatch = async (match) => {
        try{
            const response = await api.post("/match/accept", {
                "id": match.id
            });
            load();
            toast.success("Aceito!");
        }catch(err){
            toast.error("Não foi possível aceitar soliticitação, tente mais tarde!");
        }
    };

    const handleRejectMatch = async (match) => {
        try{
            const response = await api.post("/match/cancel&reject", {
                "id": match.id
            });
            load();
            toast.success("Rejeitado!");
        }catch(err){
            console.log(err);
            toast.error("Não foi possível executar ação!")
        }
    }

    return <div className="flex flex-col overflow-y-auto h-[70vh] gap-2">
        {matches.map((match) => 
            <CardPending 
                key={match.id}
                match={match} 
                rejectMatch={() => handleRejectMatch(match)}
                acceptMatch={() => handleAcceptMatch(match)}
            />
        )}
    </div>
}

export default TabPending;