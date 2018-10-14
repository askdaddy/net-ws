import {EventEmitter} from 'events';
import {Promise} from 'bluebird';
import {Wsfallback} from './wsfallback';

const WebSocket = Wsfallback.WebSocket();


enum ReadyState {
    CONNECTING = 0,
    OPEN = 1,
    CLOSING = 2,
    CLOSED = 3
}


export class WS extends EventEmitter {
    public secure: Boolean = false;
    _host: string;
    _port: number;
    _connection: any = undefined;
    _readyState: ReadyState = ReadyState.CLOSED;
    _packets_q: Buffer[] = [];// FIFO queue;
    _writeable: Boolean = false;
    _sent_count: number = 0;

    constructor(host: string, port?: number) {
        super()
        this._host = host;
        this._port = port || 80;
    }

    public Open() {
        this.doOpen();
    }

    public Close() {
        if (ReadyState.OPEN === this._readyState || ReadyState.CONNECTING === this._readyState) {
            this.doClose();
        }
    }

    private addCallBacks() {

        this._connection.onopen = () => {
            this.onOpen();
        }

        this._connection.onclose = () => {
            this.onClose();
        }

        this._connection.onmessage = (ev: any) => {
            this.onData(ev.data);
        }

        this._connection.onerror = (e: Error) => {
            this.emit(`error`, e);
        }
    }

    private onOpen() {
        this._readyState = ReadyState.OPEN;
        this._writeable = true;
        this.emit('open');
    }

    private onClose() {
        this._readyState = ReadyState.CLOSED;
        this._writeable = false;
        this.emit('close');
    }

    private onData(data: any) {
        this.emit('packet', data);
    }


    private doOpen() {
        /**
         * Get either the `WebSocket` or `MozWebSocket` globals
         * in the browser
         */
        if (typeof WebSocket === 'undefined') {
            this.emit(`error`, `WebSocket is NOT support by this Browser.`)
            return
        }

        let uri = this.uri();
        try {
            this._connection = new WebSocket(uri)
            this._connection.binaryType = 'arraybuffer';
            this.addCallBacks();
        } catch (e) {
            this.emit(`error`, e)
        }
    }

    private doClose() {
        if (typeof this._connection !== 'undefined') {
            this._connection.close();
            this._readyState = ReadyState.CLOSING;
            this.emit(`closing`);
        }
    }

    private uri(): string {
        let schema = this.secure ? 'wss' : 'ws';
        let port = '';
        if (this._port && (('wss' === schema && Number(this._port) !== 443) ||
            ('ws' === schema && Number(this._port) !== 80))) {
            port = ':' + this._port;
        }
        return schema + '://' + this._host + port;
    }

    private write() {
        if (this._packets_q.length > 0 && this._writeable) {
            let packet = this._packets_q.shift();

            this._writeable = false; // write lock!
            new Promise((resolve, reject) => {
                try {
                    this._connection.send(packet);
                    resolve();
                } catch (e) {
                    reject(e);
                }
            }).then(() => {
                // send ok
                this.emit(`sent`, [++this._sent_count, packet]);
            }).catch(reason => {
                this.emit(`error`, reason)
            }).finally(() => {
                this._writeable = true;// write unlock
                this.write();
            })
        }
        // else
        //     Promise.delay(300).then(() => {
        //         this.write();
        //     })
    }

    public Send(packet: Buffer) {
        if (ReadyState.OPEN === this._readyState) {
            this._packets_q.push(packet)
            this.write();
        } else {
            this.emit(`error`, `Transport not open yet.`)
        }
    }
}