import { Component, OnInit,ViewChild } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { Router } from '@angular/router';
import { AuthService } from '../../auth/auth.service';
import { User } from '../../users/user';
import { UsersService } from '../../users/users.service';
import { Subject } from 'rxjs/Subject';
import { NgbPopover } from '@ng-bootstrap/ng-bootstrap';
import { FileService } from '../../file/file.service';


@Component({
  selector: 'sage-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})


export class HeaderComponent implements OnInit {
  @ViewChild('p') public popover: NgbPopover;
  public static updateLoginUser: Subject<boolean> = new Subject();
  constructor(
    private router: Router,
    private modalService:NgbModal,
    private authService: AuthService,
    private fileService: FileService,
    private usersService:UsersService
  ) {
    HeaderComponent.updateLoginUser.subscribe(
      res=>{
        let userId = localStorage.getItem('id');
        if(this.isAuthenticated()){
          this.getUser(userId);
        }
      }
    );
  }

  user:User = new User();
  modalRef;
  tasks;
  taskNumber =0;

  ngOnInit() {
    let userId = localStorage.getItem('id');
    if(this.isAuthenticated()){
      this.getUser(userId);
    }
  }

  open(content){
    this.modalRef = this.modalService.open(content);
  }

  isAuthenticated(){
    return this.authService.isAuthenticated();
  }

  getRole(){
    let role:String = '';
    if(this.isAuthenticated()){
      role = this.user.roles;
    }

    return role === 'Administrador' || role === 'Jefes';
  }

  getBoss(){
    let role:String = '';
    if(this.isAuthenticated()){
      role = this.user.roles;
    }
    return role === 'Jefes';
  }

  logout(){
    this.authService.logout();
    this.router.navigate(['/sage']);
  }

  getTasks(){
    let tasks:File[] = [];
    for(var i=0;i<this.user.tasks.length;i++){
      this.fileService.getFilesById(
        this.user.tasks[i].job_id
      ).subscribe(
        (res:any)=>{
          tasks.push(res.file);
        }
      );
    }
    this.tasks = tasks;
  }

  hasTasks(){
      return this.taskNumber>0;
  }

   getUser(id){
    this.usersService.getUserById(id).subscribe(
      (res:any)=>{
        this.user = res.user;
        this.taskNumber = this.user.tasks.length;
        this.getTasks();
      }
    );
  }

}
