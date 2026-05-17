import { RefreshCcw, House, Heart, User } from 'lucide-react';
import { Link } from 'react-router';

const Header =() => {

    const handleLogout = () => {
        localStorage.removeItem("token");
        window.location.href = "/"
    };

    return <div className="items-center w-full h-30 shadow-md bg-white">
        <div className='flex justify-between items-center max-w-325 h-full m-auto'>
            <Link to="/">
                <div className='flex items-center'>
                    <div className='flex justify-center items-center rounded-2xl bg-purple'>
                        <RefreshCcw size={50} className='text-white m-2'/>
                    </div>
                    <p className='text-2xl font-bold' >Troca de Conhecimentos</p>
                </div>
            </Link>
            <div className="flex gap-4">

                <Link to="/index"><House className='hover:text-purple'/></Link>
                <Link to="/matches"><Heart className='hover:text-purple'/></Link>
                <Link to="/user"><User className='hover:text-purple'/></Link>
                <p onClick={handleLogout} className='text-2xl hover:text-purple cursor-pointer'>Sair</p>
            </div>
        </div>
    </div>;
};

export default Header;