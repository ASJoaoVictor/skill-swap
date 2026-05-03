import { useState } from "react";
import { Hourglass, Check, UserRoundPlus } from "lucide-react";
import Header from "../components/Header";
import TabPending from "../components/TabPending";
import TabSent from "../components/TabSent";

const Matches = () => {
    const [tabs, setTabs] = useState("pending");

    return <div className="bg-light-purple h-screen">
        <Header />
        <div className="max-w-325 m-auto mt-8">
            <p className="font-bold text-2xl">Seus Matches</p>

            <div className="flex justify-between gap-full">
                <div className="flex items-center  w-60 rounded-lg gap-2 p-1 bg-white justify-center">
                    <Hourglass size={50} className="bg-orange-100 text-orange-400 rounded-md"/>
                    <div>
                        <p className="text-xl font-bold">1</p>
                        <p>Pendente</p>
                    </div>
                </div>
                <div className="flex items-center  w-60 rounded-lg gap-2 p-1 bg-white justify-center">
                    <UserRoundPlus  size={50} className="bg-gray-100 text-gray-400 rounded-md"/>
                    <div>
                        <p className="text-xl font-bold">0</p>
                        <p>Enviados</p>
                    </div>
                </div>
                 <div className="flex items-center  w-60 rounded-lg gap-2 p-1 bg-white justify-center">
                    <Check size={50} className="bg-green-100 text-green-400 rounded-md"/>
                    <div>
                        <p className="text-xl font-bold">0</p>
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

            {tabs === "pending" && <TabPending />}
            {tabs === "sent" && <TabSent />}
            {tabs === "accepted" && <p>aceitos</p>}
        </div>
    </div>
};

export default Matches;