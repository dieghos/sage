import { Component, OnInit, ViewContainerRef } from '@angular/core';
import { FileService } from '../file.service';
import { ToastsManager } from 'ng2-toastr';
import { File } from '../file';

@Component({
  selector: 'sage-change-status',
  templateUrl: './change-status.component.html'
})
export class ChangeStatusComponent implements OnInit{

  files:File[]=[];
  page = 1;
  size;
  filter;
  selected_items = [];

  constructor(
    private fileService:FileService,
    vcr: ViewContainerRef,
    private toastr:ToastsManager
  ){
    this.toastr.setRootViewContainerRef(vcr);
  }

  ngOnInit(){
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

getStatus(event,file:File){
  if(event.target.checked){
    this.selected_items.push(file._id)
  }else{
    var index = this.selected_items.indexOf(file._id);
    this.selected_items.splice(index, 1);
  }
}

onChangeStatus(value){
  for (var i = 0; i < this.selected_items.length; i++) {
      this.updateState(value,this.selected_items[i]);
  }
  this.selected_items = [];

}

updateState(value,id){
  let file:File = new File();
  this.fileService.getFilesById(id).subscribe(
    (res:any)=>{
      file = res.file;
      file.status = value;
      if( value === 'Finalizado' ){
        file.last_status_date = new Date();
      };
      this.fileService.update(file).subscribe(
        res=>{
          this.toastr.success('Nuevo Status: '+ value, 'Codigo: '+file.file_code);
          this.getFiles();
        },error=>{
          console.error(error);
        }
      );
    },
    error=>{
      console.error(error);
    }
  )
}
}
