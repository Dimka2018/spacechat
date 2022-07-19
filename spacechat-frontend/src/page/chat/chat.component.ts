import {Component, ElementRef, OnInit, ViewChild} from '@angular/core';
import {Router} from "@angular/router";
import {User} from "../../entity/User";
import {UserService} from "../../service/user.service";
import {ChatService} from "../../service/chat.service";
import {Message} from "../../entity/Message";
import {CallAnswerMessage} from "../../entity/CallAnswerMessage";
import * as SimplePeer from "simple-peer";
import {SignalData} from "simple-peer";
import {StartCallMessage} from "../../entity/StartCallMessage";
import {Chat} from "../../entity/Chat";

@Component({
  selector: 'chat',
  templateUrl: './chat.component.html',
  styleUrls: ['./chat.component.scss']
})
export class ChatComponent implements OnInit {

  @ViewChild("videoSelf", {static: true})
  videoSelf: ElementRef

  @ViewChild("videoCaller", {static: true})
  videoCaller: ElementRef

  currentUser: User = new User();
  searchQuery: string = '';
  searchResult: User[] = [];

  chats: Chat[] = []
  selectedChat: Chat = new Chat();

  textContent: string = ''

  simplePeer?: SimplePeer.Instance
  offer?: SignalData;
  connectedUser?: User;
  outputCall: boolean = false;
  inputCall: boolean = false;
  currentCall: boolean = false;

  constructor(private router: Router, private userService: UserService, private chatService: ChatService) {
  }

  ngOnInit(): void {
    this.userService.getUser()
      .subscribe(user => this.currentUser = user)
    this.chatService.onMessage((message: MessageEvent) => {
      let inputMessage = JSON.parse(message.data);
      switch (inputMessage.type) {
        case 'TEXT':
          inputMessage.direction = 'input'
          this.handleMessage(inputMessage)
          break;
        case 'CALL_START':
          this.connectedUser = new User();
          this.connectedUser.id = inputMessage.fromId;
          this.connectedUser.login = inputMessage.fromName;
          this.offer = inputMessage.offer;
          this.inputCall = true;
          break;
        case 'CALL_END':
          this.outputCall = false;
          break;
        case 'CALL_ANSWER':
          this.simplePeer?.signal(inputMessage.answer)
          console.log("connection established successfully!!");
          break;
      }
    })
  }

  sendMessage() {
    let message = new Message();
    message.type = 'TEXT'
    message.direction = 'output'
    message.toId = this.selectedChat.id
    message.toName = this.selectedChat.name
    message.text = this.textContent;
    this.chatService.sendMessage(message)
    this.textContent = '';
    this.handleMessage(message);
  }

  startCall() {
    if (this.selectedChat && this.selectedChat.id) {
      navigator.mediaDevices
        .getUserMedia({video: false, audio: true})
        .then((mediaStream) => {

          this.outputCall = true;
          this.connectedUser = new User()
          this.connectedUser.id = this.selectedChat.id;
          this.connectedUser.login = this.selectedChat.name;

          const video = this.videoSelf?.nativeElement;
          video!.srcObject = mediaStream;
          video!.play();

          this.simplePeer = new SimplePeer({
            trickle: false,
            initiator: true,
            stream: mediaStream,
          });


          this.simplePeer.on("signal", (offer) => {
            let message = new StartCallMessage(this.selectedChat.id!, offer);
            this.chatService.sendMessage(message)
          });
          this.simplePeer.on("connect", () => {
            this.inputCall = false;
            this.outputCall = false;
            this.currentCall = true;
          });
          this.simplePeer.on("stream", (stream) => {
            const video = this.videoCaller!.nativeElement;
            video!.srcObject = stream;
            video!.play();
          });
        });
    }
  }

  endCall() {
    let message = new Message();
    message.type = 'CALL_END';
    message.toId = this.selectedChat.id
    this.chatService.sendMessage(message)
    this.outputCall = false;
    this.inputCall = false;
  }

  acceptCall() {
    navigator.mediaDevices.getUserMedia({video: false, audio: true})
      .then((mediaStream) => {
        const video = this.videoSelf!.nativeElement;
        video!.srcObject = mediaStream;
        video!.play();

        this.simplePeer = new SimplePeer({
          trickle: false,
          initiator: false,
          stream: mediaStream,
        });

        this.simplePeer.signal(this.offer!);

        this.simplePeer.on("signal", (answer) => {
          let message = new CallAnswerMessage(this.connectedUser!!.id!!, answer);
          this.chatService.sendMessage(message);
        });
        this.simplePeer.on("connect", () => {
          this.inputCall = false;
          this.outputCall = false;
          this.currentCall = true;
        });
        this.simplePeer.on("stream", (stream) => {
          const video = this.videoCaller!.nativeElement;
          video!.srcObject = stream;
          video!.play();
        });
      });
  }

  findUsers() {
    this.userService.find(this.searchQuery)
      .subscribe(users => this.searchResult = users);
  }

  private handleMessage(message: Message) {
    let chatId = message.direction === 'input' ? message.fromId : message.toId;
    let filteredChats = this.chats.filter(chat => chat.id === chatId);
    let chat;
    if (filteredChats.length) {
      chat = filteredChats[0];
    } else {
      chat = new Chat();
      chat.id = message.direction === 'input' ? message.fromId : message.toId;
      chat.name = message.direction === 'input' ? message.fromName : message.toName;
      this.chats.push(chat)
    }
    chat.messages.push(message);
    if (message.direction === 'output') {
      this.selectChat(chat.id)
    }
  }

  selectChat(id: string, name?: string) {
    let filteredChats = this.chats.filter(chat => chat.id === id);
    let chat;
    if (filteredChats.length) {
      chat = filteredChats[0];
    } else {
      chat = new Chat();
      chat.id = id;
      chat.name = name;
      this.chats.push(chat)
    }
    this.selectedChat = chat;
    this.searchQuery = ''
    this.searchResult = [];
  }

}
