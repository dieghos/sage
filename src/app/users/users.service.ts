import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs/Observable';
import { User } from './user';

@Injectable()
export class UsersService {

  private url = '/api';
  private headers = new HttpHeaders().set('Content-Type','application/json');
  constructor(private http:HttpClient) { }

  register(user:User){
    let data = JSON.stringify(user);
    let token = '?token='+localStorage.getItem('token');
    return this.http.post(this.url+'/register'+token, data, {headers:this.headers});
  }

  getUserById(id:string){
    let token = '?token='+localStorage.getItem('token');
    return this.http.get(this.url+'/users/'+id+token);
  }

  getUsers(){
    let token = '?token='+localStorage.getItem('token');
    return this.http.get(this.url+'/users'+token);
  }

  update(user:User){
    let data = JSON.stringify(user);
    let token = localStorage.getItem('token');
    return this.http.put(this.url+'/users/'+user._id+'?token='+token,data, {headers:this.headers});
  }




}
