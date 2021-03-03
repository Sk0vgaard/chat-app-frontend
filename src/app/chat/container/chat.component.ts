import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormControl } from '@angular/forms';
import { ChatService } from '../shared/services/chat.service';
import { Observable, Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { ChatClient } from '../shared/chat-client.model';
import { ChatMessage } from '../shared/chat-message.model';

@Component({
  selector: 'app-chat',
  templateUrl: './chat.component.html',
  styleUrls: ['./chat.component.scss']
})

export class ChatComponent implements OnInit, OnDestroy {

  messages: ChatMessage[] = [];
  nicknameFormControl = new FormControl('');
  message = new FormControl('');
  unsubscribe$ = new Subject();
  clients$: Observable<ChatClient[]> | undefined;
  chatClient: ChatClient | undefined;
  error$: Observable<string> | undefined;

  constructor(private chatService: ChatService) {
  }

  ngOnInit(): void {
    this.clients$ = this.chatService.clientListener();
    this.error$ = this.chatService.errorListener();
    this.messageListener();
  }

  sendMessage(): void {
    console.log(this.message.value);
    this.chatService.sendMessage(this.message.value);
  }

  addNickname(): void {
    if (this.nicknameFormControl.value) {
      this.chatService.sendNickname(this.nicknameFormControl.value);
    }
  }

  messageListener(): void {
    this.chatService.messageListener()
      .pipe(takeUntil(this.unsubscribe$))
      .subscribe(message => {
        this.messages.push(message);
      });
    this.chatService.welcomeListener()
      .pipe(
        takeUntil(this.unsubscribe$)
      ).subscribe(welcome => {
      this.messages = welcome.messages;
      this.chatClient = this.chatService.chatClient = welcome.client;
    });
    if (this.chatService.chatClient) {
      this.chatService.sendNickname(this.chatService.chatClient.nickname);
    }
  }

  ngOnDestroy(): void {
    this.unsubscribe$.next();
    this.unsubscribe$.complete();
  }
}
