import {SignalData} from "simple-peer";

export class CallAnswerMessage {

  type: string = 'CALL_ANSWER';
  answer: SignalData;
  to: string

  constructor(to: string, answer: SignalData) {
    this.answer = answer;
    this.to = to;
  }
}
