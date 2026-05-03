import {RefreshCcw} from "lucide-react";
import {Link} from "react-router";

const Register  = () => {
    return <div className="flex justify-center items-center bg-light-purple w-screen h-screen">
        <div className='flex flex-col justify-center items-center bg-white p-16 gap-8 rounded-lg shadow'>
            <div className='flex flex-col items-center justify-center'>
                <div className='flex justify-center items-center w-[66px] rounded-2xl bg-purple'>
                        <RefreshCcw size={50} className='text-white m-2'/>
                </div>
                <p className='text-xl font-bold'>Bem-vindo</p>
            </div>
            <div>            
                <form action="https://stunning-barnacle-jj75qw6qjq54cp64j-3000.app.github.dev/register" method="post">
                    <label htmlFor="name">Nome</label><br />
                    <input className="bg-gray-200 px-2 w-60 h-10 rounded-lg" type="text" name="name" id="name" placeholder="Seu nome"/><br />

                    <label htmlFor="email">E-mail</label><br />
                    <input className="bg-gray-200 px-2 w-60 h-10 rounded-lg" type="text" name="email" id="email" placeholder="Seu email" /><br />

                    <label htmlFor="password">Senha</label><br />
                    <input className="bg-gray-200 px-2 w-60 h-10 rounded-lg" type="text" name="password" id="password" placeholder="********"/><br />

                    <label htmlFor="conf-password">Confirmar senha</label><br />
                    <input className="bg-gray-200 px-2 w-60 h-10 rounded-lg" type="text" name="conf-password" id="conf-password" placeholder="********"/><br />

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