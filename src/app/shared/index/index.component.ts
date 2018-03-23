import { Component, OnInit } from '@angular/core';
import { FileService } from '../../file/file.service';
import { File } from '../../file/file';
import { AuthService } from '../../auth/auth.service';
import * as moment from 'moment';
import { Subject } from 'rxjs/Subject';


@Component({
  selector: 'sage-index',
  templateUrl: './index.component.html'
})

export class IndexComponent implements OnInit {

  public static updateLoginStatus: Subject<boolean> = new Subject();

  files:File[]=[];
  tomorrow_files:File[]=[];
  constructor(
    private fileService:FileService,
    private authService:AuthService
  )
  {
    IndexComponent.updateLoginStatus.subscribe(
      res=>{
        if(this.isAuthenticated()){
          this.getFiles();
        }
      }
    );
  }

  ngOnInit() {
    if(this.isAuthenticated()){
      this.getFiles();
    }
  }

  getFilesByDate(date:string){
    return this.fileService.getFiles("date="+date);
  }

  isAuthenticated(){
    return this.authService.isAuthenticated();
  }

  since(date){
    let spa = moment(date).locale('es');
    return spa.fromNow();
  }

  getFiles(){
    moment().locale('es');
    let today:string = moment().format('DD-MM-YYYY');
    let tomorrow:string = moment().add(1,'days').format('DD-MM-YYYY');
    this.getFilesByDate(today).subscribe(
      (res:any)=>{
        this.files = res.files;
      }
    );
    this.getFilesByDate(tomorrow).subscribe(
      (res:any)=>{
        this.tomorrow_files = res.files;
      }
    );
  }



}
