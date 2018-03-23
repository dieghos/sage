import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AuthModule } from '../auth/auth.module';
import { RouterModule, Routes } from '@angular/router';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';

import { HeaderComponent } from './header/header.component';
import { FooterComponent } from './footer/footer.component';
import { IndexComponent } from './index/index.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import { ControlMessagesComponent } from './forms-validation/control-messages';
import { StorageService } from './storage.service';
import { ValidationService } from './forms-validation/validation.service';
import { UsersService } from '../users/users.service';

const routes:Routes =[
  { path:'', redirectTo:'index', pathMatch: 'full'},
  { path:'index', component: IndexComponent }
];

@NgModule({
  imports: [
    CommonModule,
    AuthModule,
    RouterModule.forChild(routes),
    NgbModule
  ],
  declarations: [
    HeaderComponent,
    FooterComponent,
    IndexComponent,
    DashboardComponent,
    ControlMessagesComponent
  ],
  providers:[
    StorageService,
    ValidationService,
    UsersService
  ],
  exports:[
    HeaderComponent,
    FooterComponent,
    IndexComponent,
    DashboardComponent,
    ControlMessagesComponent
  ]
})
export class SharedModule { }
