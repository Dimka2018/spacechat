import {Component, ElementRef, OnInit, ViewChild} from '@angular/core';
import {Router} from "@angular/router";
import {User} from "../../entity/User";
import {UserService} from "../../service/user.service";
import {ChatService} from "../../service/chat.service";
import {Message} from "../../entity/Message";
import {CallAnswerMessage} from "../../entity/CallAnswerMessage";
import {CallCandidateMessage} from "../../entity/CallCandidateMessage";
import * as SimplePeer from "simple-peer";
import {StartCallMessage} from "../../entity/StartCallMessage";
import {SignalData} from "simple-peer";

@Component({
  selector: 'chat',
  templateUrl: './chat.component.html',
  styleUrls: ['./chat.component.scss']
})
export class ChatComponent implements OnInit {

  @ViewChild("videoSelf", {static: true})
  videoSelf?: ElementRef

  @ViewChild("videoCaller", {static: true})
  videoCaller?: ElementRef

  searchQuery: string = '';
  searchResult: User[] = [];

  selectedUser?: User;
  messages: Message[] = [];

  textContent: string = ''

  simplePeer?: SimplePeer.Instance
  //dataChannel: RTCDataChannel;
  //peerConnection:RTCPeerConnection = new RTCPeerConnection();
  offer?: SignalData;
  connectedUser?: User;
  outputCall: boolean = false;
  inputCall: boolean = false;
  currentCall: boolean = false;

  constructor(private router: Router, private userService: UserService, private chatService: ChatService) {
    // Setup ice handling
    /*this.peerConnection.onicecandidate = (event: RTCPeerConnectionIceEvent) => {
      if (event.candidate) {
        let message = new CallCandidateMessage(event.candidate);
        chatService.sendMessage(message);
      }
    };

    // creating data channel
    this.dataChannel = this.peerConnection.createDataChannel("dataChannel", {
      // @ts-ignore
      reliable : true
    });

    this.dataChannel.onerror = (error: RTCErrorEvent) => console.log("Error occured on datachannel:", error);

    // when we receive a message from the other peer, printing it on the console
    this.dataChannel.onmessage = (event: MessageEvent) => console.log("message:", event.data);

    this.dataChannel.onclose = () => console.log("data channel is closed");

    this.peerConnection.ondatachannel = (event: RTCDataChannelEvent) => this.dataChannel = event.channel;*/
  }

  ngOnInit(): void {
    this.chatService.onMessage((message: MessageEvent) => {
      let inputMessage = JSON.parse(message.data);
      switch (inputMessage.type) {
        case 'TEXT':
          inputMessage.direction = 'input'
          this.messages.push(inputMessage)
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
          //this.peerConnection.setRemoteDescription(new RTCSessionDescription(inputMessage.answer));
          this.simplePeer?.signal(inputMessage.answer)
          console.log("connection established successfully!!");
          break;
        case 'CALL_CANDIDATE':
          //this.peerConnection.addIceCandidate(new RTCIceCandidate(inputMessage.candidate));
          break;
      }
    })
  }

  sendMessage() {
    if (this.selectedUser) {
      let message = new Message();
      message.type = 'TEXT'
      message.direction = 'output'
      message.to = this.selectedUser.id!!
      message.text = this.textContent;
      this.messages.push(message)
      this.chatService.sendMessage(message)
      this.textContent = '';
    }
  }

  startCall() {
    if (this.selectedUser && this.selectedUser.id) {
      navigator.mediaDevices
        .getUserMedia({ video: false, audio: true })
        .then((mediaStream) => {

          this.outputCall = true;
          this.connectedUser = new User()
          this.connectedUser.id = this.selectedUser!.id;
          this.connectedUser.login = this.selectedUser!.login;

          const video = this.videoSelf?.nativeElement;
          video!.srcObject = mediaStream;
          video!.play();

          this.simplePeer = new SimplePeer({
            trickle: false,
            initiator: true,
            stream: mediaStream,
          });


          this.simplePeer.on("signal", (offer) => {
            let message = new StartCallMessage(this.selectedUser!.id!, offer);
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


      /*this.peerConnection.createOffer((offer: RTCSessionDescriptionInit) => {
        // @ts-ignore
        let message = new StartCallMessage(this.selectedUser.id, offer);
        this.chatService.sendMessage(message)
        this.peerConnection.setLocalDescription(offer);
        // @ts-ignore
      }, (error) => {
        alert("Error creating an offer");
      });
      this.outputCall = true;
      this.connectedUser = new User()
      this.connectedUser.id = this.selectedUser.id;
      this.connectedUser.login = this.selectedUser.login;*/
    }
  }

  endCall() {
    if (this.selectedUser) {
      let message = new Message();
      message.type = 'CALL_END';
      message.to = this.selectedUser.id!!
      this.chatService.sendMessage(message)
      this.outputCall = false;
      this.inputCall = false;
    }
  }

  acceptCall() {
    navigator.mediaDevices.getUserMedia({ video: false, audio: true })
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


    /*this.peerConnection.setRemoteDescription(new RTCSessionDescription(this.offer!!));

    // create and send an answer to an offer
    this.peerConnection.createAnswer((answer: RTCSessionDescriptionInit) => {
      this.peerConnection.setLocalDescription(answer);
      let message = new CallAnswerMessage(this.connectedUser!!.id!!, answer);
      this.chatService.sendMessage(message);
      // @ts-ignore
    }, (error) => {
      alert("Error creating an answer");
    });*/
  }

  selectUser(user: User) {
    this.selectedUser = user;
    this.searchQuery = ''
    this.searchResult = [];
  }

  findUsers() {
    this.userService.find(this.searchQuery)
      .subscribe(users => this.searchResult = users);
  }

}
