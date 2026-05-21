import { useEffect, useState } from "react";
import api from "../services/api";
import CardSent from "./CardSent"


const TabSent = ({setCountSent}) => {
    const [matches, setMatches] = useState([]);

    useEffect(() => {
        load();
    }, []);

    async function load(){
            try{
                const response = await api.get("match/get/sent");
                setMatches(response.data);
                setCountSent(response.data.length);
            }catch(err){
                console.log("Erro ao pegar matchs do banco: ", err)
            }
        }

    const handleCancelMatch = async (match) => {
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

    return <div className="flex flex-col gap-2">
        {matches.map((match) => 
            <CardSent
                key={match.id}
                match={match}
                cancelMatch={() => handleCancelMatch(match)}
            />
        )}
    </div>
}

export default TabSent;