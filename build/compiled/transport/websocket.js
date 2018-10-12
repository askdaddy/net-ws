"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const events_1 = require("events");
const bluebird_1 = require("bluebird");
const wsfallback_1 = require("./wsfallback");
var ReadyState;
(function (ReadyState) {
    ReadyState[ReadyState["CONNECTING"] = 0] = "CONNECTING";
    ReadyState[ReadyState["OPEN"] = 1] = "OPEN";
    ReadyState[ReadyState["CLOSING"] = 2] = "CLOSING";
    ReadyState[ReadyState["CLOSED"] = 3] = "CLOSED";
})(ReadyState || (ReadyState = {}));
class WS extends events_1.EventEmitter {
    constructor(host, port) {
        super();
        this.secure = false;
        this._connection = undefined;
        this._readyState = ReadyState.CLOSED;
        this._packets_q = [];
        this._host = host;
        this._port = port || 80;
    }
    addCallBacks() {
        this._connection.onopen = () => {
            this.onOpen();
        };
        this._connection.onclose = () => {
            this.onClose();
        };
        this._connection.onmessage = (ev) => {
            this.onData(ev.data);
        };
        this._connection.onerror = (e) => {
            this.emit(`error`, e);
        };
    }
    onOpen() {
        this._readyState = ReadyState.OPEN;
        this.emit('open');
    }
    onClose() {
        this._readyState = ReadyState.CLOSED;
        this.emit('close');
    }
    onData(data) {
        this.emit('packet', data);
    }
    Open() {
        this.doOpen();
    }
    Close() {
        if (ReadyState.OPEN === this._readyState || ReadyState.CONNECTING === this._readyState) {
            this.doClose();
        }
    }
    doOpen() {
        if (!wsfallback_1.WebSocket) {
            this.emit(`error`, `WebSocket is NOT support by this Browser.`);
            return;
        }
        let uri = this.uri();
        try {
            this._connection = new wsfallback_1.WebSocket(uri);
            this._connection.binaryType = 'arraybuffer';
            this.addCallBacks();
        }
        catch (e) {
            this.emit(`error`, e);
        }
    }
    doClose() {
        if (typeof this._connection !== 'undefined') {
            this._connection.close();
            this._readyState = ReadyState.CLOSING;
            this.emit(`closing`);
        }
    }
    uri() {
        let schema = this.secure ? 'wss' : 'ws';
        let port = '';
        if (this._port && (('wss' === schema && Number(this._port) !== 443) ||
            ('ws' === schema && Number(this._port) !== 80))) {
            port = ':' + this._port;
        }
        return schema + '://' + this._host + port;
    }
    write() {
        if (this._packets_q.length > 0) {
            let packet = this._packets_q.shift();
            new bluebird_1.Promise((resolve, reject) => {
                try {
                    this._connection.send(packet);
                    resolve();
                }
                catch (e) {
                    reject(e);
                }
            }).then(() => {
            }).catch(reason => {
                this.emit(`error`, reason);
            }).finally(() => {
                if (this._packets_q.length > 0)
                    this.write();
            });
        }
        else
            bluebird_1.Promise.delay(300).then(() => {
                this.write();
            });
    }
    Send(packet) {
        if (ReadyState.OPEN === this._readyState) {
            this._packets_q.push(packet);
            this.write();
        }
        else {
            this.emit(`error`, `Transport not open yet.`);
        }
    }
}
exports.WS = WS;
