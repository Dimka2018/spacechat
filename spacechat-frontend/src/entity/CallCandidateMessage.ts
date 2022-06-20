export class CallCandidateMessage {

  type: string = 'CALL_CANDIDATE';
  candidate: any

  constructor(candidate: any) {
    this.candidate = candidate;
  }
}
