import { useState, useEffect } from "react";
import CardPending from "./CardPending"
import api from "../services/api";

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
        }catch(err){
            console.log("Erro ao aceitar match: ", err);
            alert("Não foi possível aceitar match, tente mais tarde");
            alert(match.id)
        }
    };

    const handleRejectMatch = async (match) => {
        try{
            const response = await api.post("/match/cancel&reject", {
                "id": match.id
            });
            load();
        }catch(err){
            console.log(err);
            alert("Tente mais tarde");
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