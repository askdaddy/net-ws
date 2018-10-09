"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class WebsocketConnection {
    constructor() {
    }
    set connectListener(listener) {
        this.mConnectListener = listener;
    }
    get connectListener() {
        return this.mConnectListener;
    }
    startConnect(address) {
    }
    destroy() {
    }
}
exports.WebsocketConnection = WebsocketConnection;
