import {Injectable} from "@angular/core";
import {Message} from "../entity/Message";


@Injectable({providedIn: 'root'})
export class ChatService {

  private connection: WebSocket;
  private onMessageCallback: any;

  constructor() {
    this.connect();
  }

  sendMessage(message: Message) {
    this.connection.send(JSON.stringify(message))
  }

  onMessage(callback: any) {
    this.onMessageCallback = callback;
    this.connection.onmessage = callback;
  }

  connect() {
    let protocol = window.location.protocol === 'https:' ? "wss" : "ws";
    this.connection = new WebSocket(`${protocol}:${window.location.host}/api/chat`);
    this.connection.onmessage = this.onMessageCallback;
    //this.connection.onerror = () => setTimeout(() => this.connect(), 10000)
  }

}
