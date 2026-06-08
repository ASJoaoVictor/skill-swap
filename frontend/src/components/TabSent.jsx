import { useEffect, useState } from "react";
import api from "../services/api";
import CardSent from "./CardSent"
import toast from "react-hot-toast";


const TabSent = ({matches, load}) => {
    // const [matches, setMatches] = useState([]);

    // useEffect(() => {
    //     load();
    // }, []);

    // async function load(){
    //         try{
    //             const response = await api.get("match/get/sent");
    //             setMatches(response.data);
    //             setCountSent(response.data.length);
    //         }catch(err){
    //             console.log("Erro ao pegar matchs do banco: ", err)
    //         }
    //     }

    const handleCancelMatch = async (match) => {
        try{
            const response = await api.post("/match/cancel&reject", {
                "id": match.id
            });
            load();
            toast.success("Envio cancelado!");
        }catch(err){
            toast.error("Não foi possível executar ação!");
        }
    }

    return <div className="flex flex-col overflow-y-auto h-[70vh] gap-2">
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