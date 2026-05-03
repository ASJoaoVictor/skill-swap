import CardMatch from "./CardMatch";

const CardSent = () => {
    return <div className="bg-white rounded-md">
        <CardMatch />

        <hr className="mx-8 text-gray-400"/>

        <div className="flex justify-between mt-2 pb-2 mx-36 gap-2">
            <div className="flex justify-center w-full p-2 rounded-md border border-yellow-300 text-yellow-300 hover:bg-yellow-300 hover:text-white">
                <button>Cancelar</button>
            </div>
            <div className="flex justify-center w-full p-2 rounded-md text-white bg-purple">
                <p>Aguarde...</p>
            </div>
        </div>
    </div>
}

export default CardSent;