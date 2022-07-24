import * as SimplePeer from "simple-peer";

export class StartCallMessage {

  type: string = 'CALL_START'
  callId: string;
  toId: string;
  offer: SimplePeer.SignalData;

  constructor(callId: string, toId: string, offer: SimplePeer.SignalData) {
    this.callId = callId;
    this.toId = toId;
    this.offer = offer;
  }
}
