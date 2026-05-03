import { RefreshCcw } from 'lucide-react';

const Card = ({name, habilidades_oferecidas, habilidades_procuradas}) => {
    return <div className="flex flex-col justify-between bg-white shadow rounded-2xl mt-4 w-105 p-2">
        <div className="flex items-center gap-2">
            <img src="./foto-perfil.png" alt="foto" className="h-20" />
            <p>{name}</p>
        </div>
        <p className="font-bold mt-4">Oferece:</p>
        <div className="flex flex-wrap w-full gap-2">
            {habilidades_oferecidas.map((skill) => {
                return <p className="bg-green-100 border border-green-500 text-green-500 rounded-md px-2 text-sm">{skill.name}</p>
            })}
            
        </div>
        <p className="font-bold mt-4">Procura:</p>
        <div className="flex flex-wrap w-fit gap-2">
            {habilidades_procuradas.map((skill) => {
                return <p className="bg-white border border-purple text-purple rounded-md px-2 text-sm">{skill.name}</p>
            })}
        </div>

        <div className="flex w-full my-4">
            <button className="flex gap-2 w-full mx-8 p-2 rounded-xl justify-center items-center text-white bg-purple hover:opacity-70 cursor-pointer">
                <RefreshCcw size={20}/>
                Propor troca
            </button>
        </div>
    </div>
};

export default Card;