"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class Packet {
    constructor(opcode, param = 0) {
        this.mOpcode = -1;
    }
    get opcode() {
        return this.mOpcode;
    }
    set opcode(theOpcode) {
        this.mOpcode = theOpcode;
    }
}
exports.Packet = Packet;
