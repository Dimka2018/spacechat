export class ScreenShareEndMessage {

  type: string = 'SCREEN_SHARE_END'
  callId: string;

  constructor(callId: string) {
    this.callId = callId;
  }
}
