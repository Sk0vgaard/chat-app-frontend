import { Injectable } from '@angular/core';
import { Socket } from 'ngx-socket-io';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ChatService {

  constructor(private socket: Socket) {
  }

  sendMessage(message: string): void {
    this.socket.emit('message', message);
  }

  getAllMessages(): Observable<string[]> {
    return this.socket
      .fromEvent<string[]>('allMessages');
  }

  messageListener(): Observable<string> {
    return this.socket
      .fromEvent<string>('newMessage');
  }

  clientListener(): Observable<string[]> {
    return this.socket
      .fromEvent<string[]>('clients');
  }

  sendNickname(nickname: string): void {
    this.socket.emit('nickname', nickname);
  }

  connect(): void {
    this.socket.connect();
  }

  disconnect(): void {
    this.socket.disconnect();
  }
}
