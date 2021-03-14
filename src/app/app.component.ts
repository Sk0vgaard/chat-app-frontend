import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class AppComponent implements OnInit {
  title = 'chat-app-frontend';
  navLinks: any[];
  activeLinkIndex = -1;


  constructor(private router: Router) {
    this.navLinks = [
      // {
      //   label: 'Home',
      //   path: './',
      //   index: 0
      // },
      {
        label: 'Chat',
        path: './chats',
        index: 1
      }, {
        label: 'Login',
        path: './login',
        index: 1
      }
    ];
  }

  ngOnInit(): void {
    this.router.events.subscribe(() => {
      this.activeLinkIndex = this.navLinks.indexOf(this.navLinks.find(tab => tab.link === '.' + this.router.url));
    });
  }
}
