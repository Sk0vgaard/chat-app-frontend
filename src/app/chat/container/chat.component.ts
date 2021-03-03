import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormControl } from '@angular/forms';
import { ChatService } from '../shared/services/chat.service';
import { Observable, Subject } from 'rxjs';
import { debounceTime, takeUntil } from 'rxjs/operators';
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
  messageFormControl = new FormControl('');
  unsubscribe$ = new Subject();
  clientsTyping: ChatClient[] = [];
  clients$: Observable<ChatClient[]> | undefined;
  chatClient: ChatClient | undefined;
  error$: Observable<string> | undefined;

  constructor(private chatService: ChatService) {
  }

  ngOnInit(): void {
    this.clients$ = this.chatService.clientListener();
    this.error$ = this.chatService.errorListener();
    this.sendTyping();
    this.chatService.typingListener()
      .pipe(takeUntil(this.unsubscribe$))
      .subscribe((chatClient) => {
        if (chatClient.typing && !this.clientsTyping.find((client) => client.id === client.id)) {
          this.clientsTyping.push(chatClient);
        } else {
          this.clientsTyping = this.clientsTyping.filter((client) => client.id !== chatClient.id);
        }
      });
    this.messageListener();
  }

  private sendTyping(): void {
    this.messageFormControl.valueChanges
      .pipe(
        takeUntil(this.unsubscribe$),
        debounceTime(500)
      )
      .subscribe((value) => {
        this.chatService.sendTyping(value.length > 0);
      });
  }

  sendMessage(): void {
    console.log(this.messageFormControl.value);
    this.chatService.sendMessage(this.messageFormControl.value);
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
