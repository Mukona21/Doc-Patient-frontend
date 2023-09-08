import { createContext } from "react";
import io from "socket.io-client";

const socket = io("https://docseek.onrender.com/", { transports: ['websocket'] });
const UserContext = createContext(null);
//http://localhost:8000/
//https://docseek-db.up.railway.app/
//https://docseek.onrender.com
export { socket, UserContext };
