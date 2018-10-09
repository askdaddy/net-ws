export class Packet {
    private mOpcode: Number = -1;

    constructor(opcode: Number, param: Number = 0) {
    }

    get opcode(): Number {
        return this.mOpcode;
    }

    set opcode(theOpcode: Number) {
        this.mOpcode = theOpcode;
    }
}