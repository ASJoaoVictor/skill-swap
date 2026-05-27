import { useState, useEffect } from "react";
import { Hourglass, Check, UserRoundPlus } from "lucide-react";
import Header from "../components/Header";
import TabPending from "../components/TabPending";
import TabSent from "../components/TabSent";
import TabAccept from "../components/TabAccept";
import api from "../services/api";

const Matches = () => {
    const [tabs, setTabs] = useState("pending");

    const [matchPending, setMatchPending] = useState([]);
    const [matchAccepted, setMatchAccepted] = useState([]);
    const [matchSent, setMatchSent] = useState([]);

    const [countPending, setCountPending] = useState(0);
    const [countSent, setCountSent] = useState(0);
    const [countAccept, setCountAccept] = useState(0);

    const load = async () => {
        try{
            const [
                response_pending,
                response_sent,
                response_accepted
            ] = await Promise.all([
                api.get("match/get/received"),
                api.get("match/get/sent"),
                api.get("match/get/accepted")
            ]);

            setMatchPending(response_pending.data);
            setCountPending(response_pending.data.length);

            setMatchSent(response_sent.data);
            setCountSent(response_sent.data.length);
            
            setMatchAccepted(response_accepted.data);
            setCountAccept(response_accepted.data.length);
        }catch(err){
            console.log("Erro ao pegar os matchs do banco" + err);
            alert("erro")
        }
    }

    useEffect(() => {
        load();
    }, []);


    return <div className="bg-light-purple h-screen">
        <Header />
        <div className="max-w-325 m-auto mt-8">
            <p className="font-bold text-2xl">Seus Matches</p>

            <div className="flex justify-between gap-full">
                <div className="flex items-center  w-60 rounded-lg gap-2 p-1 bg-white justify-center">
                    <Hourglass size={50} className="bg-orange-100 text-orange-400 rounded-md"/>
                    <div>
                        <p className="text-xl font-bold">{countPending}</p>
                        <p>Pendente</p>
                    </div>
                </div>
                <div className="flex items-center  w-60 rounded-lg gap-2 p-1 bg-white justify-center">
                    <UserRoundPlus  size={50} className="bg-gray-100 text-gray-400 rounded-md"/>
                    <div>
                        <p className="text-xl font-bold">{countSent}</p>
                        <p>Enviados</p>
                    </div>
                </div>
                 <div className="flex items-center  w-60 rounded-lg gap-2 p-1 bg-white justify-center">
                    <Check size={50} className="bg-green-100 text-green-400 rounded-md"/>
                    <div>
                        <p className="text-xl font-bold">{countAccept}</p>
                        <p>Aceitos</p>
                    </div>
                </div>
            </div>

            <div  className="flex bg-gray-300 justify-between items-center rounded-md mt-8 h-10 w-full {true && bg-red-500}">
                <p 
                    onClick={() => {setTabs("pending")}} 
                    className={tabs === "pending" ?
                        "flex w-full m-1 h-9 bg-white items-center justify-center rounded-md":
                        "flex w-full m-1 h-9 items-center justify-center rounded-md hover:bg-white"
                    }
                >
                    Pendentes
                </p>
                <p 
                    onClick={() => {setTabs("sent")}} 
                    className={tabs === "sent" ?
                        "flex w-full m-1 h-9 bg-white items-center justify-center rounded-md":
                        "flex w-full m-1 h-9 items-center justify-center rounded-md hover:bg-white"
                    }
                >
                    Enviados
                </p>
                <p 
                    onClick={() => {setTabs("accepted")}} 
                    className={tabs === "accepted" ?
                        "flex w-full m-1 h-9 bg-white items-center justify-center rounded-md":
                        "flex w-full m-1 h-9 items-center justify-center rounded-md hover:bg-white"
                    }
                >
                    Aceitos
                </p>
            </div>

            {tabs === "pending" && <TabPending matches={matchPending} load={load}/>}
            {tabs === "sent" && <TabSent matches={matchSent} load={load}/>}
            {tabs === "accepted" && <TabAccept matches={matchAccepted} load={load}/>}
        </div>
    </div>
};

export default Matches;