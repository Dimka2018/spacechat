import {Injectable} from "@angular/core";
import {Message} from "../entity/Message";


@Injectable({providedIn: 'root'})
export class ChatService {

  connection: WebSocket = new WebSocket('ws:localhost:8080/api/chat');

  constructor() {

  }

  sendMessage(message: Message) {
    this.connection.send(JSON.stringify(message))
  }

  onMessage(callback: any) {
    this.connection.onmessage = callback
  }

}
