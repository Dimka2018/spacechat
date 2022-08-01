import {SignalData} from "simple-peer";

export class CallAnswerMessage {

  type: string = 'CALL_ANSWER';
  answer: SignalData;
  callId: string

  constructor(callId: string, answer: SignalData) {
    this.answer = answer;
    this.callId = callId
  }
}
