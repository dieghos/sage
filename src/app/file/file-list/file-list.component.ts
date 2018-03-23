import { Component, OnInit } from '@angular/core';
import { FileService } from '../file.service';

@Component({
  selector: 'app-file-list',
  templateUrl: './file-list.component.html'
})
export class FileListComponent implements OnInit {
  files:File[]=[];
  page = 1;
  size;
  filter;

  constructor(private fileService:FileService) { }

  ngOnInit() {
    this.getFiles();
  }

  getFiles(filter?){
    this.filter = filter? filter:null;

    this.fileService.getFilesByPage(this.page,this.filter).subscribe(
      (res:any)=>{
        this.files = res.files;
        this.size = res.count;
      },
      error=>{
          console.error(error);
      }
    );
  }

  change(event){
    this.page = event;
    this.getFiles(this.filter);
  }

  onFilter(value){
    this.page = 1;
    this.getFiles(value);
  }

}
