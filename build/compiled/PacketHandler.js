"use strict";
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (Object.hasOwnProperty.call(mod, k)) result[k] = mod[k];
    result["default"] = mod;
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
const Collections = __importStar(require("typescript-collections"));
const winston = __importStar(require("winston"));
const logger = winston.createLogger();
class PacketHandler {
    constructor() {
        this.mOnReceivedFunDict = new Collections.Dictionary();
    }
    onPacketArrived(packet) {
        let callbackFun = this.mOnReceivedFunDict.getValue(packet.opcode);
        if (callbackFun) {
            try {
                callbackFun(packet);
            }
            catch (e) {
                logger.error(`${e.message}`);
            }
            logger.info(`Finish handle OPCODE: 0x`);
            return true;
        }
        return false;
    }
    addHandlerFun(opcode, fun) {
        this.mOnReceivedFunDict.setValue(opcode, fun);
    }
}
exports.PacketHandler = PacketHandler;
