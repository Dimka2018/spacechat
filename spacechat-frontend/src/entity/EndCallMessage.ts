export class EndCallMessage {

  type: string = 'CALL_END'
  callId: string;

  constructor(callId: string) {
    this.callId = callId;
  }
}
