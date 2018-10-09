import {SocketConnection} from "./SocketConnection";
import {SocketConnectionError} from "./SocketConnectionError";

export interface IConnectListener {
    onConnected(connection: SocketConnection): void;

    onDisConnected(connection: SocketConnection): void;

    onError(reason: SocketConnectionError | undefined): void;
}