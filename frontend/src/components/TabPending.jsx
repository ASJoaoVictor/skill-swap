import { useState, useEffect } from "react";
import CardPending from "./CardPending"
import api from "../services/api";

const TabPending = ({setCountPending}) => {

    const [matches, setMatches] = useState([]);

    useEffect(() => {
        async function load(){
            try{
                const response = await api.get("match/get/received");
                setMatches(response.data);
                setCountPending(response.data.length);
            }catch(err){
                console.log("Erro ao pegar matchs do banco: ", err)
            }
        }

        load();
    }, []);

    const handleAcceptMatch = async (match) => {
        try{
            const response = await api.post("/match/accept", {
                "id": match.id
            });
            window.location.reload();
        }catch(err){
            console.log("Erro ao aceitar match: ", err);
            alert("Não foi possível aceitar match, tente mais tarde");
            alert(match.id)
        }
    };

    return <div className="flex flex-col gap-2">
        {matches.map((match) => 
            <CardPending 
                match={match} 
                acceptMatch={() => handleAcceptMatch(match)}
            />
        )}
    </div>
}

export default TabPending;