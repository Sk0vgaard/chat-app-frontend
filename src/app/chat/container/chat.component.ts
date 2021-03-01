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

  constructor(private chatService: ChatService) {
  }

  ngOnInit(): void {
    this.clients$ = this.chatService.clientListener();
    this.messageListener();
    this.chatService.connect();
  }

  sendMessage(): void {
    console.log(this.message.value);
    this.chatService.sendMessage(this.message.value);
  }

  addNickname(): void {
    if (this.nicknameFormControl.value) {
      this.chatService.welcomeListener()
        .pipe(
          takeUntil(this.unsubscribe$)
        ).subscribe(welcome => {
          this.messages = welcome.messages;
          this.chatClient = welcome.client;
      });
      this.chatService.sendNickname(this.nicknameFormControl.value);
    }
  }

  messageListener(): void {
    this.chatService.messageListener()
      .pipe(takeUntil(this.unsubscribe$))
      .subscribe(message => {
        this.messages.push(message);
      });
  }

  ngOnDestroy(): void {
    this.unsubscribe$.next();
    this.unsubscribe$.complete();
    this.chatService.disconnect();
  }
}
