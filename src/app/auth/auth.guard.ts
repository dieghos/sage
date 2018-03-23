import { Injectable } from '@angular/core';
import { Router, CanLoad, Route } from '@angular/router';
import { Observable } from 'rxjs/Observable';
import { tokenNotExpired } from 'angular2-jwt';

@Injectable()
export class AuthGuard implements CanLoad {

  constructor(private router:Router){}

  checkLogin(url){
    let authenticated:boolean = tokenNotExpired();
    if(!authenticated){
      this.router.navigate(['/index']);
    }
    return authenticated;
  }

  canLoad(route: Route): boolean {
    let url = `/${route.path}`;
    return this.checkLogin(url);
  }
}
