import { useState } from "react";
import {RefreshCcw} from "lucide-react";
import {Link} from "react-router";
import api from "../services/api";

const Register  = () => {
    const [name, setName] = useState(null);
    const [email, setEmail] = useState(null);
    const [password, setPassword] = useState(null);
    const [confPassword, setConfPassword] = useState(null);

    const handleRegister = async (e) => {
        e.preventDefault();

        try{
            const response = await api.post("/register", {
                "name": name,
                "email": email,
                "password": password,
                "confPassword": confPassword,
            });

            localStorage.setItem("token", response.data.token);
            window.location.href = "/index";
        }catch(err){
            console.log(err);
            alert("Não foi possível cadastrar usuário, tente mais tarde");
        }
    }

    return <div className="flex justify-center items-center bg-light-purple w-screen h-screen">
        <div className='flex flex-col justify-center items-center bg-white p-16 gap-8 rounded-lg shadow'>
            <div className='flex flex-col items-center justify-center'>
                <div className='flex justify-center items-center w-16 rounded-2xl bg-purple'>
                        <RefreshCcw size={50} className='text-white m-2'/>
                </div>
                <p className='text-xl font-bold'>Bem-vindo</p>
            </div>
            <div>            
                <form onSubmit={handleRegister}>
                    <label htmlFor="name">Nome {password}</label><br />
                    <input onChange={(e) => setName(e.target.value)} className="bg-gray-200 px-2 w-60 h-10 rounded-lg" type="text" name="name" id="name" placeholder="Seu nome"/><br />

                    <label htmlFor="email">E-mail</label><br />
                    <input onChange={(e) => setEmail(e.target.value)} className="bg-gray-200 px-2 w-60 h-10 rounded-lg" type="email" name="email" id="email" placeholder="Seu email" /><br />

                    <label htmlFor="password">Senha</label><br />
                    <input onChange={(e) => setPassword(e.target.value)} className="bg-gray-200 px-2 w-60 h-10 rounded-lg" type="password" name="password" id="password" placeholder="********"/><br />

                    <label htmlFor="conf-password">Confirmar senha</label><br />
                    <input onChange={(e) => setConfPassword(e.target.value)} className="bg-gray-200 px-2 w-60 h-10 rounded-lg" type="text" name="conf-password" id="conf-password" placeholder="********"/><br />

                    <button className="bg-purple text-white mt-4 w-60 h-10 rounded-lg cursor-pointer" type="submit">Criar conta</button>
                </form>
                <div className="flex justify-center items-center gap-2 h-10 mt-4 border cursor-pointer rounded-md">
                    <img src="./icon-google.png" alt="" className="w-10" />
                    <p>Continuar com o google</p>
                </div>
            </div>
            <p className="text-sm">Já tem uma conta? <Link to="/login" className='text-purple font-bold'>Faça login</Link></p>
        </div>
    </div>
};

export default Register;