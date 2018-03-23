import { Injectable } from '@angular/core';
import { File } from './file';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs/Observable';

@Injectable()
export class FileService {
  private url = '/api/files';
  private headers = new HttpHeaders().set('Content-Type','application/json');
  private token = '?token='+localStorage.getItem('token');
  constructor(private http:HttpClient) { }

  create(files:File[]){
  	let data = "{\"files\":"+JSON.stringify(files)+"}";
  	return this.http.post(this.url+this.token,data, {headers:this.headers});
  }

  getFiles(filter?:string){
    let url = this.url + '?token='+localStorage.getItem('token');;
    if(filter){
      url += '&query=' + filter;
    }
    return this.http.get(url);
  }

  getFilesByPage(page:Number,filter?:string){
    let token = localStorage.getItem('token');
    let url = this.url+ '?token='+ token;
    if(filter) {
      url+='&query='+filter+'&limit=10&page='+page;
    }else{
      url+='&limit=10&page='+page;
    }

    return this.http.get(url);
  }

  getFilesById(_id:String){
    let token = localStorage.getItem('token');
    return this.http.get(this.url+'/'+_id+'?token='+token);
  }

  update(file:File){
    let data = JSON.stringify(file);
    let token = localStorage.getItem('token');
    return this.http.put(this.url+'/'+file._id+'?token='+token,data, {headers:this.headers});
  }

  delete(file:File){
    let token = localStorage.getItem('token');
    return this.http.delete(this.url+'/'+file._id+'?token='+token);
  }


}
