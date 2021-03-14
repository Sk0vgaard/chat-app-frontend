import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormControl } from '@angular/forms';
import { Observable, Subscription } from 'rxjs';
import { ChatService } from '../shared/services/chat.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit, OnDestroy {

  error$: Observable<string> | undefined;
  socketId: string | undefined;

  subscription: Subscription;

  nicknameFormControl = new FormControl('');

  constructor(private chatService: ChatService,
              private router: Router) {
  }

  ngOnInit(): void {
    this.error$ = this.chatService.errorListener();
    this.chatService.welcomeListener().subscribe(() => this.router.navigate(['chats']));
    this.connectListener();
    this.disconnectListener();
  }

  addNewNickname(): void {
    this.chatService.sendNickname(this.nicknameFormControl.value);
    this.nicknameFormControl.patchValue('');
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
    console.log('destroying login');
  }

  connectListener(): void {
    this.subscription = this.chatService.connectListener()
      .subscribe((socketId) => {
        this.socketId = socketId;
        console.log('connect id', socketId);
      });
  }

  disconnectListener(): void {
    this.subscription.add(this.chatService.disconnectListener()
      .subscribe((socketId) => {
        this.socketId = socketId;
        console.log('disconnect id', socketId);
      }));
  }

}
