export class EndCallMessage {

  type: string = 'CALL_END'
  callId: string;
  toId: string;

  constructor(callId: string, toId: string) {
    this.callId = callId;
    this.toId = toId;
  }
}
