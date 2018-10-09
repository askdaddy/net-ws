import {IPacketListener} from "./IPacketListener";
import {Packet} from "./Packet";
import * as Collections from 'typescript-collections';
import * as winston from "winston";

const logger = winston.createLogger();

export class PacketHandler implements IPacketListener {
    private mOnReceivedFunDict = new Collections.Dictionary<Number, Function>();

    constructor() {

    }

    onPacketArrived(packet: Packet): Boolean {
        let callbackFun: Function | undefined = this.mOnReceivedFunDict.getValue(packet.opcode)

        if (callbackFun) {
            try {
                callbackFun(packet)
            } catch (e) {
                logger.error(`${e.message}`)
            }
            logger.info(`Finish handle OPCODE: 0x`)
            return true;
        }
        return false;
    }

    addHandlerFun(opcode: Number, fun: Function): void {
        this.mOnReceivedFunDict.setValue(opcode, fun);
    }

}