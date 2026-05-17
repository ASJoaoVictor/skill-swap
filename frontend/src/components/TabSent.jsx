import { useEffect, useState } from "react";
import api from "../services/api";
import CardSent from "./CardSent"


const TabSent = ({setCountSent}) => {
    const [matches, setMatches] = useState([]);

    useEffect(() => {
        async function load(){
            try{
                const response = await api.get("match/get/sent");
                setMatches(response.data);
                setCountSent(response.data.length);
            }catch(err){
                console.log("Erro ao pegar matchs do banco: ", err)
            }
        }

        load();
    }, []);

    return <div className="flex flex-col gap-2">
        {matches.map((match) => 
            <CardSent
                match={match}
            />
        )}
    </div>
}

export default TabSent;