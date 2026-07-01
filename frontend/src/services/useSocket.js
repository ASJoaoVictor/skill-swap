import { useEffect, useRef } from "react";
import { io } from "socket.io-client";

const SOCKET_URL = import.meta.env.VITE_SERVER_URL;

let socketInstance = null;

export function useSocket(){
    const socketRef = useRef(null);

    useEffect(() => {
        if(!socketInstance){
            const token = localStorage.getItem("token");
            socketInstance = io(SOCKET_URL, {
                auth: { token }
            });
        }
        socketRef.current = socketInstance;

        return () => {};
    }, []);

    return socketRef;
}