import {useState, useEffect} from "react";
import { X } from 'lucide-react';
import api from "../services/api";

const ModalAddSkill = ({title, subTitle, description, onCancel}) => {
    const [categories, setCategories] = useState([]);

    useEffect(() => {
        async function load() {
            try{
                const response = await api.get("/category");
                setCategories(response.data);
            }catch(err){
                console.log("Erro ao pegar dados de categorias " + err);
            }
        }

        load();
    }, []);

    return <div className="flex justify-center items-center bg-black/20 h-screen w-screen fixed insert-0">
        <form className="flex flex-col gap-4 bg-white p-8 rounded-md">
            <div>
                <div className="flex w-full justify-end">
                    <X className="text-red-500 text-xl" onClick={onCancel}/>
                </div>
                <h1 className="text-lg font-bold text-center">{title}</h1>
                <p className="text-sm text-gray-500 mb-4 text-center">{subTitle}</p>
            </div>
            <div>
                <label htmlFor="" className="text-sm text-black font-semibold">Nome da habilidade</label><br />
                <input type="text" className="w-full h-10 rounded-md bg-gray-200 text-gray-700 p-2" placeholder="Ex.: Violão, Python, Yoga"/>
            </div>

            <div>
                <label htmlFor="" className="text-sm text-black font-semibold">Categoria</label><br />
                <select name="" id="" className="w-full h-10 rounded-md bg-gray-200 text-gray-700 p-2">
                    {categories.map((category) =>{
                        return <option value={category.id}>{category.name}</option>
                    })}
                </select>
            </div>

            <div>
                <label htmlFor="" className="text-sm text-black font-semibold">Descrição</label><br />
                <textarea type="text" className="w-full rounded-md bg-gray-200 text-gray-700 p-2" placeholder={description}/>
            </div>

            <button className="w-full h-10 rounded-md bg-purple text-white hover:opacity-70 p-2">Adicionar</button>
        </form>
    </div>
}

export default ModalAddSkill;