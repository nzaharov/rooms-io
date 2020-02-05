import { Component, OnInit } from '@angular/core';
import { Observable, fromEvent } from 'rxjs';
import { pluck } from 'rxjs/operators';
import * as io from 'socket.io-client';
import { IAction } from 'src/app/game/interfaces/Action';

@Component({
  selector: 'app-socketclient',
  templateUrl: './socketclient.component.html',
  styleUrls: ['./socketclient.component.css']
})
export class SocketclientComponent implements OnInit {

  private readonly serverURL = 'http://localhost:8080/';
  private socket: SocketIOClient.Socket;

  availableRooms$: Observable<string[]>;
  roomName: string = null;
  isConnected = false;
  playerId: string = '';
  incomingAction: IAction;

  constructor() { }

  ngOnInit() { }

  connect() {
    if (!this.playerId || this.playerId === '') {
      return;
    }

    this.socket = io(this.serverURL, {
      reconnection: false,
      query: {
        playerId: this.playerId
      }
    });

    this.socket.once('connect', () => {
      this.availableRooms$ = fromEvent(this.socket, 'roomList').pipe(pluck('availableRooms'));
      this.socket
        .on('p2Join', () => console.log('Player 2 joined'))
        .on('ready', () => console.log('ready'))
        .on('message', ({ message }) => console.log(message))
        .on('gameState', ({ message }) => this.incomingAction = message)
        .on('err', ({ err }) => console.log('error: ', err))
        .on('disconnect', () => {
          this.isConnected = false
        });

      this.isConnected = true;
    });

  }

  createRoom() {
    if (!this.roomName || this.roomName === '') {
      return;
    }
    this.socket.emit('createRoom', { roomName: this.roomName });
  }

  joinRoom() {
    if (!this.roomName || this.roomName === '') {
      return;
    }

    this.socket.emit('joinRoom', { roomName: this.roomName });
  }

  sendMessage(text: string) {
    if (text && text !== '') {
      this.socket.send({ message: text });
    }
  }

  handleGameOutput(event) {
    if (event && this.socket) {
      this.socket.emit('playerAction', { message: event })
    }
  }

}
