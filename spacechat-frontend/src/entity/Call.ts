export class Call {

  id: string;
  name: string;
  participants: [string]
  status: string;

  constructor(id: string, status: string, name: string, participants: [string]) {
    this.id = id;
    this.status = status;
    this.name = name;
    this.participants = participants;
  }
}
