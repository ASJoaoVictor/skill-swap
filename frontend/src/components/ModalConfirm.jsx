import Header from "./Header";

const ModalConfirm = ({title, message, onCancel}) => {
    return <div className="fixed insert-0">
        <div className="flex justify-center items-center bg-black/20 h-screen w-screen">
            <div className="flex flex-col gap-4 bg-white p-8 rounded-md">
                <h1 className="font-bold text-lg" >{title}</h1>
                <p className="max-w-64">{message}</p>
                <div className="flex justify-between gap-8">
                    <button onClick={onCancel} className="border border-red-500 p-2 rounded-md text-red-500 w-full hover:bg-red-500 hover:text-white">Cancelar</button>
                    <button className="bg-red-500 text-white p-2 rounded-md w-full hover:opacity-70">Deletar</button>
                </div>
            </div>
        </div>
    </div>
}

export default ModalConfirm;