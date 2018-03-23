import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';
import { Http, RequestOptions } from '@angular/http';
import { AuthComponent } from './auth.component';
import { AuthService } from './auth.service';
import { AuthGuard } from './auth.guard';
import { AdminGuard } from './admin.guard';
import { BossGuard } from './boss.guard';
import { AuthHttp, AuthConfig } from 'angular2-jwt';


export function authHttpServiceFactory(http: Http, options: RequestOptions) {
  return new AuthHttp(new AuthConfig(), http, options);
}

@NgModule({
  imports: [
    CommonModule,
    ReactiveFormsModule
  ],
  declarations: [
    AuthComponent
  ],
  exports:[
    AuthComponent
  ],
  providers:[
    AuthService,
    AuthGuard,
    AdminGuard,
    BossGuard,
    {
      provide: AuthHttp,
      useFactory: authHttpServiceFactory,
      deps: [Http, RequestOptions]
    }
  ]

})
export class AuthModule { }
