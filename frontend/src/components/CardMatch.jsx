import { ArrowLeftRight, CircleUserRound } from "lucide-react";

const CardMatch = ({match}) => {
    return <div>
         <div className="flex justify-around items-center p-2">
            <div>
                <div className="flex items-center">
                    {match.user_receiver.url_img ? 
                        <img src={match.user_receiver.url_img} alt="foto-perfil.png" className="h-20 rounded-full" />: 
                        <CircleUserRound size={80} strokeWidth='1' className='text-purple'/>
                    }
                    <p>{match.user_receiver.username}</p>
                </div>
                <div>
                    <p>Procura:</p>
                    <div className="flex flex-wrap w-full gap-2">
                        {match.user_receiver.skills.filter((skill) => skill.type === "sought").map((skill) => 
                            <p className="bg-white border border-purple text-purple w-fit rounded-md px-2 text-sm">{skill.name}</p>
                        )}
                    </div>

                </div>
            </div>

            <div className="bg-light-purple text-purple p-2 rounded-[68px]">
                <ArrowLeftRight size="60"/> 
            </div>

            <div className="flex jsutify-center w-auto">
                <div>
                    <div className="flex items-center">
                        {match.user_requester.url_img ? 
                            <img src={match.user_requester.url_img} alt="foto-perfil.png" className="h-20" />: 
                            <CircleUserRound size={80} strokeWidth='1' className='text-purple'/>
                        }
                        <p>{match.user_requester.username}</p>
                    </div>
                    <div>
                        <p>Oferece:</p>
                        <div className="flex flex-wrap w-full gap-2">
                            {match.user_requester.skills.filter((skill) => skill.type === "offered").map((skill) => 
                                <p className="bg-green-100 border border-green-500 text-green-500 w-fit rounded-md px-2 text-sm">{skill.name}</p>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
}

export default CardMatch;