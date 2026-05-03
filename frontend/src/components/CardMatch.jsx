import {ArrowLeftRight} from "lucide-react";

const CardMatch = () => {
    return <div>
         <div className="flex justify-around items-center p-2">
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

            <div className="flex jsutify-center w-auto">
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
            </div>
        </div>
    </div>
}

export default CardMatch;