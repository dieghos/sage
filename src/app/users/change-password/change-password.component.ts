import { Component, OnInit, ViewContainerRef } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { User } from '../user';
import { UsersService } from '../users.service';
import { Router } from '@angular/router';
import { ToastsManager } from 'ng2-toastr';

@Component({
  selector: 'sage-change-password',
  templateUrl: './change-password.component.html'
})

export class ChangePasswordComponent implements OnInit {

  current_user:User = new User();


  fileForm:FormGroup = this.fb.group({
    password:''
  });

  constructor(
    private usersService:UsersService,
    private fb: FormBuilder,
    private vcr: ViewContainerRef,
    private toastr:ToastsManager,
    private router:Router
  ){
    this.toastr.setRootViewContainerRef(vcr);
  }

  ngOnInit(){
    this.usersService.getUserById(localStorage.getItem('id')).subscribe(
      (res:any)=>{
        this.current_user = res.user;
        this.createForm(res.user);
      },
      error =>{
        console.error(error);
      }
    )
  }

  createForm(user:User){
    this.fileForm = this.fb.group({
      password: ''
    });
  }


  onSubmit(password){
    const formModel = this.fileForm.value;
    this.current_user.password = formModel.password as string;
    if(this.current_user.password === password){
      this.usersService.update(this.current_user).subscribe(
        res=>{
          this.router.navigateByUrl('sage/index');
        },
        error =>{
          this.toastr.error('Se produjo un error');
        }
      )
    }else{
      this.toastr.error('Las contraseñas no coinciden');
    }

  }


}
