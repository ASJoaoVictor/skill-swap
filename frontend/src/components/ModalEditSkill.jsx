import { X } from 'lucide-react';
import ModalAddSkill from './ModalAddSkill';

const ModalEditSkill = ({skill, onCancel}) => {
    return <div className="flex justify-center items-center bg-black/20 h-screen w-screen fixed insert-0">
        <form className="flex flex-col gap-4 bg-white p-8 rounded-md">
            <div>
                <div className="flex w-full justify-end">
                    <X className="text-red-500 text-xl" onClick={onCancel}/>
                </div>
                <h1 className="text-lg font-bold text-center">Editar Habilidade Oferecida</h1>
                <p className="text-sm text-gray-500 mb-4 text-center">Atualize as informações da habilidade que você deseja ensinar</p>
            </div>
            <div>
                <label htmlFor="" className="text-sm text-black font-semibold">Nome da habilidade</label><br />
                <input type="text" className="w-full h-10 rounded-md bg-gray-200 text-gray-700 p-2" placeholder={skill.name}/>
            </div>

            <div>
                <label htmlFor="" className="text-sm text-black font-semibold">Categoria</label><br />
                <select name="" id="" className="w-full h-10 rounded-md bg-gray-200 text-gray-700 p-2">
                    <option value="">teste</option>
                    <option value="">teste</option>
                    <option value="">teste</option>
                    <option value="">teste</option>
                    <option value="">teste</option>
                </select>
            </div>

            <div>
                <label htmlFor="" className="text-sm text-black font-semibold">Descrição</label><br />
                <textarea type="text" className="w-full h-15 rounded-md bg-gray-200 text-gray-700 p-2" placeholder={skill.description}/>
            </div>

            <button className="w-full h-10 rounded-md bg-purple text-white hover:opacity-70 p-2">Salvar</button>
        </form>
    </div>
}

export default ModalEditSkill;