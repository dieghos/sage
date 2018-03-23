import { RouterModule, Routes } from '@angular/router';
import { NgModule } from '@angular/core';

import { IndexComponent } from './index/index.component';
import { ProfileComponent } from './profile/profile.component';
import { UserEditComponent } from './edit-user/edit-user.component';
import { ChangePasswordComponent } from './change-password/change-password.component';

const routes: Routes = [
  { path:'', redirectTo:'register', pathMatch: 'full'},
  { path:'index', component: IndexComponent },
  { path: 'edit/:id', component: UserEditComponent },
  { path:'profile', component: ProfileComponent },
  { path:'change-password', component: ChangePasswordComponent }
]

@NgModule({
  imports:[
    RouterModule.forChild(routes)
  ],
  exports:[
    RouterModule
  ]
})

export class UserRoutingModule{

}
