import { Injectable } from '@angular/core';
import { Socket } from 'ngx-socket-io';
import { Observable } from 'rxjs';
import { ChatClient } from '../models/chat-client.model';
import { ChatMessage } from '../models/chat-message.model';
import { WelcomeDto } from '../../api/dtos/welcome.dto';

@Injectable({
  providedIn: 'root'
})
export class ChatService {

  private currentNickname: string | undefined;
  private welcomeDto: WelcomeDto | undefined;

  constructor(private socket: Socket) {
    this.welcomeListener().subscribe((welcomeDto) => this.welcomeDto = welcomeDto);
  }

  getMessages(): ChatMessage[] | undefined {
    return this.welcomeDto?.messages;
  }

  getCurrentNickname(): string | undefined {
    return this.currentNickname;
  }

  getChatClient(): ChatClient | undefined {
    return this.welcomeDto?.client;
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

  typingListener(): Observable<ChatClient> {
    return this.socket
      .fromEvent<ChatClient>('clientTyping');
  }

  sendNickname(nickname: string): void {
    this.currentNickname = nickname;
    this.socket.emit('nickname', nickname);
  }

  sendTyping(typing: boolean): void {
    this.socket.emit('typing', typing);
  }

  connect(): void {
    this.socket.connect();
  }

  disconnect(): void {
    this.socket.disconnect();
  }
}
