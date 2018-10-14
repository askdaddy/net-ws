import {IConnectListener} from "./IConnectListener";
import {Buffer} from "buffer/"
import {Packet} from "./Packet";
import {IPacketListener} from "./IPacketListener";

export interface ServerAddress {
    readonly ip: String,
    readonly port: Number
}

export class SocketConnectionError extends Error {
    name = "SocketConnectionError";

    constructor(reason: any) {
        super(`SocketConnectionError: ${JSON.stringify(reason)}`)
        this.stack = new Error().stack;
    }
}

export class SocketConnection {
    private mServerAddr?: ServerAddress;
    private mBuffer?: Buffer;
    private mConnectListener?: IConnectListener
    private mPacketListener: IPacketListener[] = []

    constructor() {

    }

    set connectListener(listener: IConnectListener | undefined) {
        this.mConnectListener = listener;
    }

    get connectListener(): IConnectListener | undefined {
        return this.mConnectListener;
    }

    startConnect(addr: ServerAddress): void {
        this.mServerAddr = addr;
        this._connect();
    }

    stopConnect(): void {
        // TODO
    }

    private _connect() {
        //TODO
    }

    isConnected(): Boolean {
        return false;
    }

    sendPacket(pkt: Packet): void {
        if (this.isConnected()) {
            try {
                // TODO
            } catch (e) {
                // TODO
            }
        }
    }

    // ----------
    // PacketHandler register function
    registerPacketListener(listener: IPacketListener) {
        if (this.mPacketListener.indexOf(listener) === -1)
            this.mPacketListener.push(listener)
    }

    removePacketListener(listener: IPacketListener) {
        const index = this.mPacketListener.indexOf(listener)
        if (index !== -1)
            this.mPacketListener.splice(index, 1)
    }

    //Frees all resources for garbage collection.
    destroy(): void {

    }
}