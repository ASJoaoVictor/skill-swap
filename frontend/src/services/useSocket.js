import { useEffect, useRef } from "react";
import { io } from "socket.io-client";

const SOCKET_URL = "https://stunning-barnacle-jj75qw6qjq54cp64j-3000.app.github.dev";

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