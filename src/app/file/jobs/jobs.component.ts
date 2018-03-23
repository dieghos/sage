import { Component, OnInit, ViewChild, ViewContainerRef } from '@angular/core';
import { UsersService } from '../../users/users.service';
import { User } from '../../users/user';
import { Task } from '../../users/task';
import { FileService } from '../file.service';
import { File } from '../file';
import {NgbTypeahead} from '@ng-bootstrap/ng-bootstrap';
import {Observable} from 'rxjs/Observable';
import {Subject} from 'rxjs/Subject';
import { ToastsManager } from 'ng2-toastr';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/merge';
import 'rxjs/add/operator/filter';
import 'rxjs/add/operator/debounceTime';
import 'rxjs/add/operator/distinctUntilChanged';

@Component({
  selector: 'sage-jobs',
  templateUrl: './jobs.component.html'
})
export class JobsComponent implements OnInit {

  constructor(
    private fileService:FileService,
    private usersService:UsersService,
    private toastr:ToastsManager,
    private vcr: ViewContainerRef

  ) {
    this.toastr.setRootViewContainerRef(vcr);
  }

  public model:User;
  users:User[] =[];
  files:File[]=[];
  page = 1;
  size;
  filter;
  selected_items:string[] = [];

  @ViewChild('instance') instance: NgbTypeahead;
  focus$ = new Subject<string>();
  click$ = new Subject<string>();

  search = (text$: Observable<string>) =>
   text$
     .debounceTime(200).distinctUntilChanged()
     .merge(this.focus$)
     .merge(this.click$.filter(() => !this.instance.isPopupOpen()))
     .map(term => (term === '' ? this.users : this.users.filter(v => v.apellido.toLowerCase().indexOf(term.toLowerCase()) > -1)).slice(0, 10));

     formatter = (x) => x.grado+' '+x.apellido;

  ngOnInit() {
    this.getFiles();
    this.getUsers();
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

  getUsers(){
    this.usersService.getUsers().subscribe(
      (res:any)=>{
        this.users = res.users;
      }
    );
  }

  getFile(event,file:File){
    if(event.target.checked){
      this.selected_items.push(file._id)
    }else{
      var index = this.selected_items.indexOf(file._id);
      this.selected_items.splice(index, 1);
    }
  }

  onAssignment(){
    let user:User = this.model;
    for (var i = 0; i < this.selected_items.length; i++) {
        this.updateAssignment(this.selected_items[i]);
        let task = new Task(this.selected_items[i],new Date(), false);
        user.tasks.push(task);
    }
    user.password = undefined;
    this.usersService.update(user).subscribe(
      res=>{
        console.log('user updated');
      },
      error=>{
        console.error(error);
      }
    )
  }

  updateAssignment(id){
    this.fileService.getFilesById(id).subscribe(
      (res:any)=>{
        let file = res.file;
        file.assigned = this.model;
        this.fileService.update(file).subscribe(
          res=>{
            this.toastr.success('Trabajo/s asignado/s exitosamente.')
          },
          error=>{
            console.error(error);
          }
        );
      }
    );
  }
}
