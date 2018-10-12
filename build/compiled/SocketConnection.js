"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class SocketConnectionError extends Error {
    constructor(reason) {
        super(`SocketConnectionError: ${JSON.stringify(reason)}`);
        this.name = "SocketConnectionError";
        this.stack = new Error().stack;
    }
}
exports.SocketConnectionError = SocketConnectionError;
class SocketConnection {
    constructor() {
        this.mPacketListener = [];
    }
    set connectListener(listener) {
        this.mConnectListener = listener;
    }
    get connectListener() {
        return this.mConnectListener;
    }
    startConnect(addr) {
        this.mServerAddr = addr;
        this._connect();
    }
    stopConnect() {
    }
    _connect() {
    }
    isConnected() {
        return false;
    }
    sendPacket(pkt) {
        if (this.isConnected()) {
            try {
            }
            catch (e) {
            }
        }
    }
    registerPacketListener(listener) {
        if (this.mPacketListener.indexOf(listener) === -1)
            this.mPacketListener.push(listener);
    }
    removePacketListener(listener) {
        const index = this.mPacketListener.indexOf(listener);
        if (index !== -1)
            this.mPacketListener.splice(index, 1);
    }
    destroy() {
    }
}
exports.SocketConnection = SocketConnection;
