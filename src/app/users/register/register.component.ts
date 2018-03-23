import { Component, OnInit, ViewContainerRef } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { User } from '../user';
import { UsersService } from '../users.service';
import { ToastsManager } from 'ng2-toastr';

@Component({
  selector: 'sage-register',
  templateUrl: './register.component.html'
})

export class RegisterComponent implements OnInit {
  fileForm:FormGroup;
  user:User;
  roles = [
    'Jefes',
    'Administrador',
    'Usuario'
  ];

  constructor(
    private fb: FormBuilder,
    private usersService:UsersService,
    private toastr:ToastsManager,
    private vcr: ViewContainerRef
  ){
    toastr.setRootViewContainerRef(this.vcr);
  }
  ngOnInit(){
    this.createForm();
  }

  createForm(){
    this.fileForm = this.fb.group({
      grado:['', Validators.required],
      apellido:['', Validators.required],
      nombres:['', Validators.required],
      legajo:['', Validators.required],
      roles:'Usuario',
      photo:'./assets/images/escudo.png'
    });
  }

  prepareSubmitFile(): User {
    const formModel = this.fileForm.value;
    let user: User = new User();
    user.username = formModel.legajo as string;
    user.grado = formModel.grado as string;
    user.legajo = formModel.legajo as string;
    user.apellido = formModel.apellido as string;
    user.nombres = formModel.nombres as string;
    user.roles = formModel.roles as string ;
    user.photo = './assets/images/escudo.png';
    user.password = "enlaces";
    return user;
  }

  onSubmit(){
    this.user = this.prepareSubmitFile();
    this.usersService.register(this.user).subscribe(
      res=>{
        this.toastr.success('Usuario creado exitosamente');
        this.createForm();
      },
      error=>{
        this.toastr.error('Se produjo un error al intentar crear el usuario.');
      }
    );
  }

}
