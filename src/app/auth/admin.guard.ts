import { Injectable } from '@angular/core';
import { Router, CanLoad, Route } from '@angular/router';
import { Observable } from 'rxjs/Observable';
import { UsersService } from '../users/users.service';
import { User } from '../users/user';

@Injectable()
export class AdminGuard implements CanLoad {

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

  canLoad(route: Route): boolean {
    this.getUser();
    let url = `/${route.path}`;
    return this.isAdmin(url);
  }

  isAdmin(url){
    let role = localStorage.getItem('role');
    let autho =  role === 'Administrador' || role === 'Jefes';
    if(!autho){
      this.router.navigate(['/index']);
    }
    return autho;
  }
}
