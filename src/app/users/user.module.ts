import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { UserRoutingModule } from './user-routing.module';
import { RegisterComponent } from './register/register.component';
import { IndexComponent } from './index/index.component';
import { ProfileComponent } from './profile/profile.component';
import { UserListComponent } from './user-list/user-list.component';
import { UserEditComponent } from './edit-user/edit-user.component';
import { UsersService } from './users.service';
import { SharedModule } from '../shared/shared.module';
import { FormsModule,ReactiveFormsModule } from '@angular/forms';
import { ChangePasswordComponent } from './change-password/change-password.component';

@NgModule({
  imports: [
    UserRoutingModule,
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    SharedModule,
    NgbModule
  ],
  declarations: [
    RegisterComponent,
    UserListComponent,
    IndexComponent,
    UserEditComponent,
    ChangePasswordComponent,
    ProfileComponent
  ],
  providers:[
    UsersService
  ]
})
export class UserModule { }
