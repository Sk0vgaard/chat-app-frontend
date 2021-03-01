import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormControl } from '@angular/forms';
import { ChatService } from '../shared/services/chat.service';
import { Observable, Subject } from 'rxjs';
import { take, takeUntil } from 'rxjs/operators';
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
  nickname: string | undefined;
  clients$: Observable<ChatClient[]> | undefined;

  constructor(private chatService: ChatService) {
  }

  ngOnInit(): void {
    this.clients$ = this.chatService.clientListener();
    this.messageListener();
    this.getAllMessages();
    this.chatService.connect();
  }

  sendMessage(): void {
    console.log(this.message.value);
    this.chatService.sendMessage(this.message.value);
  }

  addNickname(): void {
    if (this.nicknameFormControl.value) {
      this.nickname = this.nicknameFormControl.value;
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

  private getAllMessages(): void {
    this.chatService.getAllMessages()
      .pipe(take(1))
      .subscribe(messages => {
        this.messages = messages;
      });
  }

  ngOnDestroy(): void {
    this.unsubscribe$.next();
    this.unsubscribe$.complete();
    this.chatService.disconnect();
  }
}
