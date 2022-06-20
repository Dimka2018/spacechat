import * as SimplePeer from "simple-peer";

export class StartCallMessage {

  type: string = 'CALL_START'
  to: string;
  offer: SimplePeer.SignalData;

  constructor(to: string, offer: SimplePeer.SignalData) {
    this.to = to;
    this.offer = offer;
  }
}
