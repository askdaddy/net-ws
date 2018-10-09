import {Packet} from "./Packet";


export interface IPacketListener {
    onPacketArrived(packet: Packet): Boolean;
}