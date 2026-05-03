import {useState} from 'react';
import { createPortal } from 'react-dom';
import Header from '../components/Header';
import { Trash, Pencil, Plus } from 'lucide-react';

const User = () => {
    const user = {
        "id": 1,
        "email": "teste@gmail.com",
        "url_img": null,
        "username": "teste",
        "password": "12345",
        "skills": [
            {
                "id": 1,
                "name": "Piano",
                "description": "teste",
                "type": "offered",
                "usersId": 1,
                "categoryId": 1,
                "category": {
                    "id": 1,
                    "name": "Música"
                }
            },
            {
                "id": 1,
                "name": "Guitarra",
                "description": "teste",
                "type": "offered",
                "usersId": 1,
                "categoryId": 1,
                "category": {
                    "id": 1,
                    "name": "Música"
                }
            },
            {
                "id": 1,
                "name": "Inglês",
                "description": "teste",
                "type": "sought",
                "usersId": 1,
                "categoryId": 1,
                "category": {
                    "id": 1,
                    "name": "Música"
                }
            }
        ]
    }
    return <div className='bg-light-purple h-screen'>
        <Header />
        <div className='max-w-325 m-auto mt-8'>
            <div>
                <p className='font-bold text-2xl'>Minhas Habilidades</p>
                <div className='flex items-center gap-4 p-6 rounded-2xl bg-white'> 
                    <img src="foto-perfil.png" alt="" />
                    <div className='items-center'>
                        <p>{user.username}</p>
                        {/* <p>Membro deste de março de 2026</p> */}
                    </div>
                </div>

                <div className='mt-8 p-6 rounded-2xl bg-white'> 
                    <div className='flex justify-between'>
                        <p className='text-xl font-bold: '>Eu ofereço</p>
                        <button onClick={() => setVisible(true)} className='flex justify-center items-center cursor-pointer text-sm bg-green-400 p-1 rounded-md text-white hover:opacity-70'> <Plus />Adicionar</button>
                    </div>
                    {user.skills.filter((skill) => skill.type === "offered").map((skill) => {
                        return <div className='flex justify-between mt-2 p-2 border border-green-400 text-green-400 bg-green-100 rounded-md' >
                            <div className='flex gap-2'>
                                <p>{skill.name}</p>
                                <p className='text-xs text-black px-1 rounded-md h-fit bg-white border'>{skill.category.name}</p>
                            </div>
                            <div className='flex gap-4'>
                                <Pencil className='text-yellow-500 cursor-pointer'/>
                                <Trash className='text-red-500 cursor-pointer'/>
                            </div>
                        </div>
                    })
                    }
                </div>

                <div className='mt-8 p-6 rounded-2xl bg-white'> 
                    <div className='flex justify-between'>
                        <p className='text-xl font-bold: '>Eu procuro</p>
                        <button className='flex justify-center items-center cursor-pointer text-sm bg-purple p-1 rounded-md text-white hover:opacity-70'> <Plus />Adicionar</button>
                    </div>
                    {user.skills.filter((skill) => skill.type === "sought").map((skill) => {
                        return <div className='flex justify-between mt-2 p-2 border border-purple text-purple bg-light-purple rounded-md' >
                            <div className='flex gap-2'>
                                <p>{skill.name}</p>
                                <p className='text-xs text-black px-1 rounded-md h-fit bg-white border'>{skill.category.name}</p>
                            </div>
                            <div className='flex gap-4'>
                                <Pencil className='text-yellow-500 cursor-pointer'/>
                                <Trash className='text-red-500 cursor-pointer'/>
                            </div>
                        </div>
                        })}
                </div>
            </div>
        </div>
    </div>
};

export default User;