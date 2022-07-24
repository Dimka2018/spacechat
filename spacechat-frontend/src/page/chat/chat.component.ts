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
import {v4 as uuid} from 'uuid';
import {Call} from "../../entity/Call";
import {EndCallMessage} from "../../entity/EndCallMessage";

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
  searchQuery = '';
  searchResult: User[] = [];

  chats: Chat[] = []
  selectedChat: Chat = new Chat();
  call: Call;
  camera = false;
  microphone = true;

  textContent = ''

  localStream;
  simplePeer: SimplePeer.Instance
  offer: SignalData;
  connectedUser: User;
  outputCall = false;
  inputCall = false;
  currentCall = false;

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
          this.call = new Call(inputMessage.callId)
          this.inputCall = true;
          break;
        case 'CALL_END':
          this.stopVideo();
          this.inputCall = false;
          this.outputCall = false;
          this.currentCall = false;
          this.call = undefined;
          break;
        case 'CALL_ANSWER':
          this.simplePeer.signal(inputMessage.answer)
          this.outputCall = false;
          this.inputCall = false;
          this.currentCall = true;
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
        .getUserMedia({video: true, audio: false})
        .then((mediaStream) => {

          this.outputCall = true;
          this.connectedUser = new User()
          this.connectedUser.id = this.selectedChat.id;
          this.connectedUser.login = this.selectedChat.name;

          const video = this.videoSelf.nativeElement;
          video.srcObject = mediaStream;
          video.play();

          this.simplePeer = new SimplePeer({
            trickle: false,
            initiator: true,
            stream: mediaStream,
          });

          this.simplePeer.on("signal", (offer) => {
            let callId = uuid();
            this.call = new Call(callId)
            let message = new StartCallMessage(callId, this.selectedChat.id, offer);
            this.chatService.sendMessage(message)
          });
          this.simplePeer.on("connect", () => {
            console.log("connected!!!")
            this.inputCall = false;
            this.outputCall = false;
            this.currentCall = true;
          });
          this.simplePeer.on("stream", (stream) => {
            this.localStream = stream;
            const video = this.videoCaller.nativeElement;
            video.srcObject = stream;
            video.play();
          });
        });
    }
  }

  endCall() {
    this.stopVideo();
    let message = new EndCallMessage(this.call.id,this.connectedUser.id);
    this.chatService.sendMessage(message)
    this.outputCall = false;
    this.inputCall = false;
    this.currentCall = false;
    this.call = undefined;
  }

  acceptCall() {
    this.inputCall = false;
    this.outputCall = false;
    this.currentCall = true;
    navigator.mediaDevices.getUserMedia({video: true, audio: false})
      .then((mediaStream) => {
        const video = this.videoSelf.nativeElement;
        video.srcObject = mediaStream;
        video.play();

        this.simplePeer = new SimplePeer({
          trickle: false,
          initiator: false,
          stream: mediaStream,
        });

        this.simplePeer.signal(this.offer);

        this.simplePeer.on("signal", (answer) => {
          let message = new CallAnswerMessage(this.call.id, this.connectedUser.id, answer);
          this.chatService.sendMessage(message);
          this.inputCall = false;
          this.outputCall = false;
          this.currentCall = true;
        });
        this.simplePeer.on("connect", () => {
          console.log("connected!!!")
          this.inputCall = false;
          this.outputCall = false;
          this.currentCall = true;
        });
        this.simplePeer.on("stream", (stream) => {
          this.localStream = stream
          const video = this.videoCaller.nativeElement;
          video.srcObject = stream;
          video.play();
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

  toggleMicrophone() {
    this.microphone = !this.microphone;
  }

  toggleCamera() {
    this.camera = !this.camera;
  }

  stopVideo() {
    this.videoSelf.nativeElement.srcObject.getTracks().forEach(function(track) { track.stop(); });
    this.videoSelf.nativeElement.src = '';
    this.videoCaller.nativeElement.src = '';
  }

}
