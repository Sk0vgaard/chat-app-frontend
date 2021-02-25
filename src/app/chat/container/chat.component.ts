import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormControl } from '@angular/forms';
import { ChatService } from '../shared/services/chat.service';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

@Component({
  selector: 'app-chat',
  templateUrl: './chat.component.html',
  styleUrls: ['./chat.component.scss']
})
export class ChatComponent implements OnInit, OnDestroy {

  messages: string[] = [];
  message = new FormControl('');
  unsubscribe$ = new Subject();

  constructor(private chatService: ChatService) {
  }

  ngOnInit(): void {
    this.chatService.messageListener()
      .pipe(takeUntil(this.unsubscribe$))
      .subscribe(message => {
        this.messages.push(message);
      });
  }

  sendMessage(): void {
    console.log(this.message.value);
    this.chatService.sendMessage(this.message.value);
  }

  ngOnDestroy(): void {
    this.unsubscribe$.next();
    this.unsubscribe$.complete();
  }

}
