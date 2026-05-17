import { useState, useEffect } from "react";
import Header from "../components/Header";
import Card from "../components/Card";
import api from "../services/api";

const Index = () => {

    const [users, setUsers] = useState([]);

    useEffect(() => {
        async function load() {
            try {
                const response = await api.get("/users");
                setUsers(response.data);
            } catch (err) {
                console.error(err);
            }
        }

        load();
    }, []);

    const handleSendMacth = async (receiverUser) => {
        try{
            const response = api.post("/match/send", {
                "receiverUser": receiverUser
            });

            alert("Solicitação enviada!");
        }catch(err){
            console.log("Erro ao enviar macth", err);
            alert("Não foi possível enviar solicitação!");
        }
    }

    return <div className='bg-light-purple min-h-screen h-full'>
        <Header />
        <main className='flex-1 h-full'>
            <div className='grid lg:grid-cols-3 md:grid-cols-2 sm:grid-cols-1 max-w-325 m-auto'>
                {users.map((user) =>
                    <Card
                        key={user.id}
                        name={user.username}
                        url_img={user.url_img}
                        habilidades_oferecidas={user.skills.filter((skill) => skill.type === "offered")}
                        habilidades_procuradas={user.skills.filter((skill) => skill.type === "sought")}
                        sendMacth={() => handleSendMacth(user)}
                    />)
                }
            </div>
        </main>
    </div>
};

export default Index;