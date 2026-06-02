import {useState, useEffect} from 'react';
import Header from '../components/Header';
import { Trash, Pencil, Plus, CircleUserRound } from 'lucide-react';
import ModalConfirm from '../components/ModalConfirm';
import ModalAddSkill from '../components/ModalAddSkill';
import ModalEditSkill from '../components/ModalEditSkill';
import api from '../services/api';

const User = () => {

    const [user, setUser] = useState(null);
    const [skillDelete, setSkillDelete] = useState(null);
    const [modalAddSkillOffered, setModalAddSkillOffered] = useState(null);
    const [modalAddSkillSought, setModalAddSkillSought] = useState(null);
    const [modalEditSkillOffered, setModalEditSkillOffered] = useState(null)
    const [modalEditSkillSought, setModalEditSkillSought] = useState(null)

    async function load() {
        try{
            const response = await api.get("/users/get");
            setUser(response.data);
        }catch(err){
            console.log("Erro ao pegar usuário: " + err);
        }
    }

    useEffect(() => {
        load();
    }, []);

    if(!user){
        return <p>carregando</p>
    }

    
    return <div className='bg-light-purple h-screen'>
        {skillDelete && <ModalConfirm
            title={`Excluir ${skillDelete.name}`}
            message={`Tem certeza que deseja remover esta habilidade? Essa ação não poderá ser desfeita.`}
            onCancel={() => setSkillDelete(null)}
        />}

        {modalAddSkillOffered && <ModalAddSkill
            title="Adicionar Habilidade Oferecida"
            subTitle="Adicione uma habilidade que você pode ensinar aos outros"
            descriptionMessage="Descreva brevemente sua experiência ou o que você gostaria de aprender"
            type="offered"
            onCancel={() => setModalAddSkillOffered(null)}
            reload={() => load()}
            />}

        {modalAddSkillSought && <ModalAddSkill
            title="Adicionar Habilidade Procurada"
            subTitle="Adicione uma habilidade que você deseja aprender com outras pessoas"
            descriptionMessage="Descreva brevemente o que você deseja aprender ou qual nível de conhecimento procura"
            type="sought"
            onCancel={() => setModalAddSkillSought(null)}
            reload={() => load()}
        />}

        {modalEditSkillOffered && <ModalEditSkill
            skill={modalEditSkillOffered}
            onCancel={() => setModalEditSkillOffered(null)}
        />}

        {modalEditSkillSought && <ModalEditSkill
            skill={modalEditSkillSought}
            onCancel={() => setModalEditSkillOffered(null)}
        />}


        <Header />
        <div className='max-w-325 m-auto mt-8'>
            
            <div>
                <p className='font-bold text-2xl'>Minhas Habilidades</p>
                <div className='flex items-center gap-4 p-6 rounded-2xl bg-white'> 
                    {user.url_img ? 
                        <img src={user.url_img} alt="foto-perfil.png" className="h-20 rounded-full" />: 
                        <CircleUserRound size={80} strokeWidth='1' className='text-purple'/>
                    }
                    <div className='items-center'>
                        <p>{user.username}</p>
                        {/* <p>Membro deste de março de 2026</p> */}
                    </div>
                </div>

                <div className='mt-8 p-6 rounded-2xl bg-white'> 
                    <div className='flex justify-between'>
                        <p className='text-xl font-bold: '>Eu ofereço</p>
                        <button onClick={() => setModalAddSkillOffered(true)} className='flex justify-center items-center cursor-pointer text-sm bg-green-400 p-1 rounded-md text-white hover:opacity-70'> <Plus />Adicionar</button>
                    </div>
                    {user.skills.filter((skill) => skill.type === "offered").map((skill) => {
                        return <div key={skill.id} className='flex justify-between mt-2 p-2 border border-green-400 text-green-400 bg-green-100 rounded-md' >
                            <div className='flex gap-2'>
                                <p>{skill.name}</p>
                                <p className='text-xs text-black px-1 rounded-md h-fit bg-white border'>{skill.category.name}</p>
                            </div>
                            <div className='flex gap-4'>
                                <Pencil className='text-yellow-500 hover:fill-yellow-500 cursor-pointer' onClick={() => setModalEditSkillOffered(skill)}/>
                                <Trash className='text-red-500 hover:fill-red-500 cursor-pointer' onClick={() => setSkillDelete(skill)}/>
                            </div>
                        </div>
                    })
                    }
                </div>

                <div className='mt-8 p-6 rounded-2xl bg-white'> 
                    <div className='flex justify-between'>
                        <p className='text-xl font-bold: '>Eu procuro</p>
                        <button className='flex justify-center items-center cursor-pointer text-sm bg-purple p-1 rounded-md text-white hover:opacity-70' onClick={() => setModalAddSkillSought(true)}> <Plus />Adicionar</button>
                    </div>
                    {user.skills.filter((skill) => skill.type === "sought").map((skill) => {
                        return <div key={skill.id} className='flex justify-between mt-2 p-2 border border-purple text-purple bg-light-purple rounded-md' >
                            <div className='flex gap-2'>
                                <p>{skill.name}</p>
                                <p className='text-xs text-black px-1 rounded-md h-fit bg-white border'>{skill.category.name}</p>
                            </div>
                            <div className='flex gap-4'>
                                <Pencil className='text-yellow-500 hover:fill-yellow-500 cursor-pointer' onClick={() => setModalEditSkillOffered(skill)}/>
                                <Trash className='text-red-500 hover:fill-red-500 cursor-pointer' onClick={() => setSkillDelete(skill)}/>
                            </div>
                        </div>
                        })}
                </div>
            </div>
        </div>
    </div>
};

export default User;