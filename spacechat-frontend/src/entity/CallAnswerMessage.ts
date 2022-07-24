import {SignalData} from "simple-peer";

export class CallAnswerMessage {

  type: string = 'CALL_ANSWER';
  answer: SignalData;
  toId: string
  calId: string

  constructor(callId: string, toId: string, answer: SignalData) {
    this.answer = answer;
    this.toId = toId;
    this.calId = callId
  }
}
