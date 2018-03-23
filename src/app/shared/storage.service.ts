import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs/Observable';

@Injectable()
export class StorageService {

  private url = '/api/file';
  private headers = new HttpHeaders().set('Content-Type','application/json');
  private token = '?token='+localStorage.getItem('token');
  constructor(private http:HttpClient) { }

  upload(formData) {
    return this.http.post(this.url+this.token,formData);
  }

  delete(path){
    let data = "{\"path\":"+JSON.stringify(path)+"}";
  	return this.http.post(this.url + '/delete'+this.token,data, {headers:this.headers});
  }


}
