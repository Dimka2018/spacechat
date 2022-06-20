import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import {WelcomeComponent} from "../page/welcome/welcome.component";
import {ChatComponent} from "../page/chat/chat.component";

const routes: Routes = [
  { path: 'welcome', component: WelcomeComponent },
  { path: 'chat', component: ChatComponent },
  { path: '',   redirectTo: '/welcome', pathMatch: 'full' }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
