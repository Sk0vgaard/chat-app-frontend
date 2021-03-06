import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormControl } from '@angular/forms';
import { ChatService } from '../shared/services/chat.service';
import { Observable, Subscription } from 'rxjs';
import { ChatClient } from '../shared/models/chat-client.model';
import { ChatMessage } from '../shared/models/chat-message.model';

@Component({
  selector: 'app-chat',
  templateUrl: './chat.component.html',
  styleUrls: ['./chat.component.scss']
})

export class ChatComponent implements OnInit, OnDestroy {

  messages: ChatMessage[] = [];
  nicknameFormControl = new FormControl('');
  subscription: Subscription;
  clientsTyping: ChatClient[] = [];
  clients$: Observable<ChatClient[]>;
  chatClient: ChatClient | undefined;

  constructor(private chatService: ChatService) {
  }

  ngOnInit(): void {
    this.messages = this.chatService.getMessages() ?? [];
    this.chatClient = this.chatService.getChatClient();
    this.clients$ = this.chatService.clientListener();
    this.messageListener();
    this.typingListener();
    console.log('init chat');
  }

  sendMessage(newMessageEvent: string): void {
    this.chatService.sendMessage(newMessageEvent);
  }

  messageListener(): void {
    this.subscription =
      this.chatService.messageListener()
        .subscribe(message => {
          this.messages?.push(message);
        });
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
    console.log('destroying chat');
  }

  typingListener(): void {
    this.subscription.add(
      this.chatService.typingListener()
        .subscribe((chatClient) => {
          if (chatClient.typing && !this.clientsTyping.find((client) => client.id === chatClient.id)) {
            this.clientsTyping.push(chatClient);
          } else {
            this.clientsTyping = this.clientsTyping.filter((client) => client.id !== chatClient.id);
          }
        })
    );
  }

  sendTyping(isTyping: boolean): void {
    this.chatService.sendTyping(isTyping);
  }
}
