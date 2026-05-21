import CardMatch from "./CardMatch";

const CardPending = ({match, rejectMatch, acceptMatch}) => {
    return <div className="bg-white rounded-md">
        <CardMatch match={match}/>

        <hr className="mx-8 text-gray-400"/>

        <div className="flex justify-between mt-2 pb-2 mx-36 gap-2">
            <div onClick={rejectMatch} className="flex justify-center w-full p-2 rounded-md border border-red-500 text-red-500 hover:bg-red-500 hover:text-white">
                <button>Recusar</button>
            </div>
            <div onClick={acceptMatch} className="flex justify-center w-full p-2 rounded-md text-white bg-purple hover:opacity-70">
                <button>Aceitar</button>
            </div>
        </div>
    </div>
}

export default CardPending;