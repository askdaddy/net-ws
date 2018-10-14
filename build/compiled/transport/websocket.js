"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const events_1 = require("events");
const bluebird_1 = require("bluebird");
const wsfallback_1 = require("./wsfallback");
const WebSocket = wsfallback_1.Wsfallback.WebSocket();
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
        this._writeable = false;
        this._sent_count = 0;
        this._host = host;
        this._port = port || 80;
    }
    Open() {
        this.doOpen();
    }
    Close() {
        if (ReadyState.OPEN === this._readyState || ReadyState.CONNECTING === this._readyState) {
            this.doClose();
        }
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
        this._writeable = true;
        this.emit('open');
    }
    onClose() {
        this._readyState = ReadyState.CLOSED;
        this._writeable = false;
        this.emit('close');
    }
    onData(data) {
        this.emit('packet', data);
    }
    doOpen() {
        if (typeof WebSocket === 'undefined') {
            this.emit(`error`, `WebSocket is NOT support by this Browser.`);
            return;
        }
        let uri = this.uri();
        try {
            this._connection = new WebSocket(uri);
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
        if (this._packets_q.length > 0 && this._writeable) {
            let packet = this._packets_q.shift();
            this._writeable = false;
            new bluebird_1.Promise((resolve, reject) => {
                try {
                    this._connection.send(packet);
                    resolve();
                }
                catch (e) {
                    reject(e);
                }
            }).then(() => {
                this.emit(`sent`, [++this._sent_count, packet]);
            }).catch(reason => {
                this.emit(`error`, reason);
            }).finally(() => {
                this._writeable = true;
                this.write();
            });
        }
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
