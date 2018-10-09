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
