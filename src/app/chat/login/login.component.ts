import { Component, OnInit } from '@angular/core';
import { FormControl } from '@angular/forms';
import { Observable } from 'rxjs';
import { ChatService } from '../shared/services/chat.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {

  error$: Observable<string> | undefined;

  nicknameFormControl = new FormControl('');

  constructor(private chatService: ChatService,
              private router: Router) {
  }

  ngOnInit(): void {
    this.error$ = this.chatService.errorListener();
    this.chatService.welcomeListener().subscribe(() => this.router.navigate(['chats']));
  }

  addNewNickname(): void {
    this.chatService.sendNickname(this.nicknameFormControl.value);
    this.nicknameFormControl.patchValue('');
  }

}
