import { X } from 'lucide-react';
import {ArrowLeftRight} from "lucide-react";
import ModalAddSkill from './ModalAddSkill';

const ModalSendMatch = ({user}) => {

    console.log(user.skills)

    return <div className="flex justify-center items-center bg-black/20 h-screen w-screen fixed insert-0">
        <h1>Propor Troca de conhecimento</h1>
        <p>Envie uma proposta de troca para usuuátio</p>
        
        <form className='flex justify-around items-center p-4 bg-white w-200 h-100 rounded-lg'>
            <select name="" id="">
                <option value="">teste</option>
                <option value="">teste</option>
                <option value="">teste</option>
                <option value="">teste</option>
                <option value="">teste</option>
            </select>

            <div className="bg-light-purple h-20 text-purple p-2 rounded-[68px]">
                <ArrowLeftRight size="60"/> 
            </div>

            <select name="" id="">
                {user.skills.filter((skill) => skill.type === "sought").map((skill) => {return <option value={skill.id}>{skill.name}</option> })}
            </select>
        </form>
    </div>
}

export default ModalSendMatch;