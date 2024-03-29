import {AfterViewInit, Component, ElementRef, OnInit, ViewChild} from '@angular/core';
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
import {ScreenShareStartMessage} from "../../entity/ScreenShareStartMessage";
import {ScreenShareEndMessage} from "../../entity/ScreenShareEndMessage";

@Component({
  selector: 'chat',
  templateUrl: './chat.component.html',
  styleUrls: ['./chat.component.scss']
})
export class ChatComponent implements OnInit, AfterViewInit {

  @ViewChild("videoSelf", {static: true})
  videoSelf: ElementRef

  @ViewChild("videoCaller", {static: true})
  videoCaller: ElementRef

  @ViewChild("callHeader")
  callHeader: ElementRef

  @ViewChild("callFrame")
  callFrame: ElementRef

  @ViewChild('screen')
  screen: ElementRef

  currentUser: User = new User();
  searchQuery = '';
  searchResult: User[] = [];

  chats: Chat[] = []
  selectedChat: Chat = new Chat();
  call: Call// = new Call('', 'CONNECTED', '', ['']);
  camera = true;
  microphone = true;

  textContent = ''

  simplePeer: SimplePeer.Instance
  offer: SignalData;

  constructor(private router: Router, private userService: UserService, private chatService: ChatService) {
  }

  ngAfterViewInit(): void {
    this.dragElement()
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
          this.offer = inputMessage.offer;
          this.call = new Call(inputMessage.callId, "ANSWER", inputMessage.callName, inputMessage.participantNames);
          break;
        case 'CALL_END':
          this.stopVideo();
          this.call = undefined;
          break;
        case 'CALL_ANSWER':
          this.call.status = 'CONNECTED'
          this.simplePeer.signal(inputMessage.answer)
          break;
        case 'SCREEN_SHARE_START':
          this.screen.nativeElement.srcObject = this.videoCaller.nativeElement.srcObject;
          this.call.screenShareOwner = inputMessage.screenOwnerName;
          break;
        case 'SCREEN_SHARE_END':
          this.call.screenShareOwner = undefined;
          this.screen.nativeElement.srcObject = undefined;
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

  startCall(videoCall: boolean) {
    let callId = uuid();
    this.call = new Call(callId, 'CONNECTING', '', [this.selectedChat.name])
    navigator.mediaDevices.getUserMedia({video: videoCall, audio: true}).then(mediaStream => {
      this.simplePeer = new SimplePeer({
        trickle: false,
        initiator: true,
        stream: mediaStream,
      });

      this.simplePeer.on("signal", offer => {
        this.call.status = 'OFFER';
        let message = new StartCallMessage(callId, this.selectedChat.id, offer);
        this.chatService.sendMessage(message)
      });
      this.simplePeer.on("stream", stream => {
        this.videoCaller.nativeElement.srcObject = stream;
      });
      this.videoSelf.nativeElement.srcObject = mediaStream;
      if (!videoCall) {
        this.disableCamera();
      }
    });
  }

  endCall() {
    this.stopVideo();
    let message = new EndCallMessage(this.call.id);
    this.chatService.sendMessage(message)
    this.call = undefined;
  }

  acceptCall(videoCall: boolean) {
    this.call.status = 'CONNECTED'
    navigator.mediaDevices.getUserMedia({video: videoCall, audio: true}).then(mediaStream => {

      this.simplePeer = new SimplePeer({
        trickle: false,
        initiator: false,
        stream: mediaStream,
      });

      this.simplePeer.signal(this.offer);

      this.simplePeer.on("signal", answer => {
        let message = new CallAnswerMessage(this.call.id, answer);
        this.chatService.sendMessage(message);
      });
      this.simplePeer.on("stream", stream => {
        this.videoCaller.nativeElement.srcObject = stream
      });
      this.videoSelf.nativeElement.srcObject = mediaStream;
    });
  }

  startScreenSharing() {
    this.call.selfScreenShare = true;
    // @ts-ignore
    navigator.mediaDevices.getDisplayMedia({video: {cursor: 'always'}, audio: false}).then(mediaStream => {
      let message = new ScreenShareStartMessage(this.call.id);
      this.chatService.sendMessage(message);
      let currentStream = this.videoSelf.nativeElement.srcObject;
      this.simplePeer.replaceTrack(currentStream.getVideoTracks()[0], mediaStream.getVideoTracks()[0], currentStream);
    })
  }

  endScreenSharing() {
    let message = new ScreenShareEndMessage(this.call.id);
    this.chatService.sendMessage(message);
    this.call.selfScreenShare = false;
    navigator.mediaDevices.getUserMedia({video: true, audio:  true}).then(mediaStream => {
      let currentStream = this.videoSelf.nativeElement.srcObject;
      currentStream.getTracks().forEach(track => track.stop())
      this.simplePeer.replaceTrack(currentStream.getVideoTracks()[0], mediaStream.getVideoTracks()[0], currentStream);
      this.simplePeer.replaceTrack(currentStream.getAudioTracks()[0], mediaStream.getAudioTracks()[0], currentStream);
      this.videoSelf.nativeElement.srcObject = mediaStream;
      if (!this.camera) {
        this.disableCamera();
      }

    })
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

  enableMicrophone() {
    this.videoSelf.nativeElement.srcObject.getAudioTracks().forEach(track => track.enabled = true);
    this.microphone = true;
  }

  disableMicrophone() {
    this.videoSelf.nativeElement.srcObject.getAudioTracks().forEach(track => track.enabled = false);
    this.microphone = false;
  }

  enableCamera() {
    this.videoSelf.nativeElement.srcObject.getVideoTracks().forEach(track => track.enabled = true);
    this.camera = true;
  }

  disableCamera() {
    this.videoSelf.nativeElement.srcObject.getVideoTracks().forEach(track => track.enabled = false);
    this.camera = false;
  }

  stopVideo() {
    if (this.videoSelf.nativeElement.srcObject) {
      this.videoSelf.nativeElement.srcObject.getTracks().forEach(track => track.stop());
      this.videoSelf.nativeElement.src = '';
      this.videoCaller.nativeElement.src = '';
    }
  }

  dragElement() {
    let fromPositionX = 0;
    let fromPositionY = 0;

    let closeDragElement = () => {
      document.onmouseup = null;
      document.onmousemove = null;
    }

    this.callHeader.nativeElement.onmousedown = e => {
      e.preventDefault();
      fromPositionX = e.clientX;
      fromPositionY = e.clientY;
      document.onmouseup = closeDragElement;
      document.onmousemove = elementDrag;
    };

    let elementDrag = e => {
      e.preventDefault();
      this.callFrame.nativeElement.style.top = (this.callFrame.nativeElement.offsetTop - (fromPositionY - e.clientY)) + "px";
      this.callFrame.nativeElement.style.left = (this.callFrame.nativeElement.offsetLeft - (fromPositionX - e.clientX)) + "px";
      fromPositionX = e.clientX;
      fromPositionY = e.clientY;
    }
  }

}
