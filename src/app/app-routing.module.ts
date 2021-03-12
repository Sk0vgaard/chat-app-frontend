import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LoginGuard } from './login.guard';
import { LoginComponent } from './chat/login/login.component';

const routes: Routes = [{
    path: 'chats', loadChildren: () => import('./chat/chat.module').then(m => m.ChatModule),
    canActivate: [LoginGuard]
  },
  {path: 'login', component: LoginComponent}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule {
}
