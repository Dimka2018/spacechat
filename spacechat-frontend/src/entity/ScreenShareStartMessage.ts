export class ScreenShareStartMessage {

  type: string = 'SCREEN_SHARE_START'
  callId: string;

  constructor(callId: string) {
    this.callId = callId;
  }
}
