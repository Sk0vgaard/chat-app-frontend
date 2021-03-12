import { AfterViewChecked, Component, ElementRef, EventEmitter, Input, OnDestroy, OnInit, Output, ViewChild } from '@angular/core';
import { ChatMessage } from '../../shared/models/chat-message.model';
import { FormControl } from '@angular/forms';
import { ChatClient } from '../../shared/models/chat-client.model';
import { Observable, Subject } from 'rxjs';
import { debounceTime, distinctUntilChanged, takeUntil } from 'rxjs/operators';

@Component({
  selector: 'app-chat-view',
  templateUrl: './chat-view.component.html',
  styleUrls: ['./chat-view.component.scss']
})
export class ChatViewComponent implements OnInit, OnDestroy, AfterViewChecked {

  @Input() messages: ChatMessage[] = [];
  @Input() clients$: Observable<ChatClient[]> | undefined;
  @Input() chatClient: ChatClient | undefined;
  @Input() clientsTyping: ChatClient[] = [];

  @Output() newMessageEvent = new EventEmitter<string>();
  @Output() isTypingEvent = new EventEmitter<boolean>();
  messageFormControl = new FormControl('');
  unsubscribe$ = new Subject();
  typing: boolean | undefined;
  @ViewChild('scrollBottom') private scrollBottom!: ElementRef;

  constructor() {
  }

  ngOnInit(): void {
    this.scrollToBottom();
    this.isTyping();
  }

  ngAfterViewChecked(): void {
    this.scrollToBottom();
  }

  addNewMessage(): void {
    this.newMessageEvent.emit(this.messageFormControl.value);
    this.messageFormControl.patchValue('');
  }

  scrollToBottom(): void {
    try {
      this.scrollBottom.nativeElement.scrollTop = this.scrollBottom.nativeElement.scrollHeight;
    } catch (err) {
    }
  }

  ngOnDestroy(): void {
    this.unsubscribe$.next();
    this.unsubscribe$.complete();
  }

  private isTyping(): void {
      this.messageFormControl.valueChanges
        .pipe(
          takeUntil(this.unsubscribe$),
          debounceTime(500),
          distinctUntilChanged()
        )
        .subscribe((value) => {
          this.isTypingEvent.emit(value.length > 0);
        });
  }
}
