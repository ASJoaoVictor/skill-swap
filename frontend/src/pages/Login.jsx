import { useState, useEffect } from 'react';
import {RefreshCcw, Target} from 'lucide-react';
import { Link } from 'react-router';
import api from "../services/api";

const Login = () => {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");

    const handleLogin = async (e) => {
        e.preventDefault();
        try{
            const response = await api.post("/login", null, {
                auth:{
                    username: email,
                    password: password,
                },
            });
            console.log(response.data.token)
            localStorage.setItem("token", response.data.token);
            window.location.href = "./index";
        }catch(err){
            console.error(err);
            alert("Deu erro");
        }
    };

    return <div className="flex justify-center items-center bg-light-purple w-screen h-screen">
        <div className='flex flex-col justify-center items-center bg-white p-16 gap-8 rounded-lg shadow'>
            <div className='flex flex-col items-center justify-center'>
                <div className='flex justify-center items-center w-[66px] rounded-2xl bg-purple'>
                        <RefreshCcw size={50} className='text-white m-2'/>
                </div>
                <p className='text-xl font-bold'>Bem-vindo</p>
            </div>
            <div>            
                <form onSubmit={handleLogin} method="post">
                    <label htmlFor="email">E-mail</label><br />
                    <input className="bg-gray-200 px-2 w-60 h-10 rounded-lg" onChange={(e) => setEmail(e.target.value)} type="email" name="email" id="email" placeholder="Seu email" /><br />

                    <label htmlFor="password">Senha</label><br />
                    <input className="bg-gray-200 px-2 w-60 h-10 rounded-lg" onChange={(e) => setPassword(e.target.value)} type="password" name="password" id="password" placeholder="********"/><br />

                    <button className="bg-purple text-white mt-4 w-60 h-10 rounded-lg cursor-pointer" type="submit">Entrar</button>
                </form>
                <div className="flex justify-center items-center gap-2 h-10 mt-4 border cursor-pointer rounded-md">
                    <img src="./icon-google.png" alt="" className="w-10" />
                    <p>Continuar com o google</p>
                </div>
            </div>
            <p className="text-sm">Não tem uma conta? <Link to="/register" className='text-purple font-bold'>Cadastre-se</Link></p>
        </div>
    </div>
};

export default Login;