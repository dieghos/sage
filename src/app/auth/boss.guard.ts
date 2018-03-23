import { Injectable } from '@angular/core';
import { Router, CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { Observable } from 'rxjs/Observable';
import { UsersService } from '../users/users.service';
import { User } from '../users/user';
import { tokenNotExpired } from 'angular2-jwt';


@Injectable()
export class BossGuard implements CanActivate {

  constructor(
    private router:Router,
    private usersService:UsersService
  ){}
  private user:User = new User();

  getUser(){
    this.usersService.getUserById(
      localStorage.getItem('id')
    ).subscribe(
      (res:any)=>{
        this.user = res.user;
      }
    );
  }

  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): boolean {
    this.getUser();
    return this.isBoss();
  }

  isBoss(){
    let autho = localStorage.getItem('role') === 'Jefes' && tokenNotExpired();
    if(!autho){
      this.router.navigate(['/index']);
    }
    return autho;
  }
}
