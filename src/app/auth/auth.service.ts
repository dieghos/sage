import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { User } from '../shared/models/user';
import { tokenNotExpired } from 'angular2-jwt';

@Injectable()
export class AuthService {
  private url = '/api';
  private headers = new HttpHeaders().set('Content-Type','application/json');

  constructor(private http:HttpClient) { }

  login(user:User){
    let data = JSON.stringify(user);
    return this.http.post(this.url+'/login', data, {headers:this.headers});
  }

  register(user:User){
    let data = JSON.stringify(user);
    return this.http.post(this.url+'/register', data, {headers:this.headers});
  }

  isAuthenticated(){
    return tokenNotExpired();
  }


  logout(){
    localStorage.clear();
  }

}
