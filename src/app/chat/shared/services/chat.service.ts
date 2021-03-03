import { Injectable } from '@angular/core';
import { Socket } from 'ngx-socket-io';
import { Observable } from 'rxjs';
import { ChatClient } from '../chat-client.model';
import { ChatMessage } from '../chat-message.model';
import { WelcomeDto } from '../welcome.dto';

@Injectable({
  providedIn: 'root'
})
export class ChatService {

  chatClient: ChatClient | undefined;

  constructor(private socket: Socket) {
  }

  sendMessage(message: string): void {
    this.socket.emit('message', message);
  }

  messageListener(): Observable<ChatMessage> {
    return this.socket
      .fromEvent<ChatMessage>('newMessage');
  }

  clientListener(): Observable<ChatClient[]> {
    return this.socket
      .fromEvent<ChatClient[]>('clients');
  }

  welcomeListener(): Observable<WelcomeDto> {
    return this.socket
      .fromEvent<WelcomeDto>('welcome');
  }

  errorListener(): Observable<string> {
    return this.socket
      .fromEvent<string>('error');
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
