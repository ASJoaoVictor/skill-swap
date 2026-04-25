import Header from "../components/Header";
import { Hourglass, Check, UserRoundPlus, ArrowLeftRight } from "lucide-react";
import Card from "../components/Card";

const Matches = () => {
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
                    <Check size={50} className="bg-green-100 text-green-400 rounded-md"/>
                    <div>
                        <p className="text-xl font-bold">0</p>
                        <p>Aceito</p>
                    </div>
                </div>
                <div className="flex items-center  w-60 rounded-lg gap-2 p-1 bg-white justify-center">
                    <UserRoundPlus  size={50} className="bg-gray-100 text-gray-400 rounded-md"/>
                    <div>
                        <p className="text-xl font-bold">0</p>
                        <p>Enviados</p>
                    </div>
                </div>
            </div>

            <div  className="flex bg-gray-300 justify-between items-center rounded-md mt-8 h-10 w-full {true && bg-red-500}">
                <p className="flex w-full m-1 h-9 bg-white items-center justify-center rounded-md">Pendentes</p>
                <p className="flex w-full m-1 h-9 items-center justify-center rounded-md">Aceitos</p>
                <p className="flex w-full m-1 h-9 items-center justify-center rounded-md">Enviados</p>
            </div>

            <div className="flex justify-between items-center p-2 bg-white">
                <div>
                    <div className="flex items-center">
                        <img src="./foto-perfil.png" alt="" />
                        <p>Nome do usuário</p>
                    </div>
                    <div>
                        <p>Oferece:</p>
                        <p className="bg-green-100 border border-green-500 text-green-500 w-fit rounded-md px-2 text-sm">Habilidade</p>
                    </div>
                </div>

                <div className="bg-light-purple text-purple p-2 rounded-[68px]">
                    <ArrowLeftRight size="60"/> 
                </div>

                <div>
                    outro usuario
                </div>
            </div>

        </div>
    </div>
};

export default Matches;