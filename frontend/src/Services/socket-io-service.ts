import { io, Socket } from "socket.io-client";
import VacationsModel from "../Model/VacationsModel";

class SocketIoService {

    public socket: Socket | undefined

public connect(): void {
    this.socket = io("http://localhost:4005")
}

public disconnect(): void {
    this.socket?.disconnect();
}

public send(msg: VacationsModel | VacationsModel[]): void {
    this.socket?.emit("msg-from-client", msg);
}

}

export default SocketIoService; 