import { Component, OnInit, ViewContainerRef } from '@angular/core';
import { User } from '../user';
import { UsersService } from '../users.service';
import { ToastsManager } from 'ng2-toastr';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { ActivatedRoute, ParamMap, Router } from '@angular/router';

@Component({
  selector: 'sage-edit-user',
  templateUrl: './edit-user.component.html'
})
export class UserEditComponent implements OnInit {
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
    private vcr: ViewContainerRef,
    private route:ActivatedRoute,
    private router: Router
  ){
    toastr.setRootViewContainerRef(this.vcr);
  }

  ngOnInit(){
    this.createForm();
    this.route.paramMap
    .switchMap((params: ParamMap) => this.usersService.getUserById(params.get('id')))
    .subscribe(
      (res:any) => {
        this.user = res.user;
        this.patchForm();
      },
      error=>{
        console.error(error);
      }
    );
  }

  createForm(){
    this.fileForm = this.fb.group({
      grado:'',
      apellido:'',
      nombres:'',
      legajo:'',
      roles:'Usuario'
    });
  }

  patchForm(){
    this.fileForm.patchValue({
      grado:this.user.grado,
      apellido:this.user.apellido,
      nombres:this.user.nombres,
      legajo:this.user.legajo,
      roles:this.user.roles
    });
  }

  prepareSubmitFile(): User {
    const formModel = this.fileForm.value;
    let user: User = new User();
    user._id = this.user._id;
    user.username = formModel.legajo as string;
    user.grado = formModel.grado as string;
    user.legajo = formModel.legajo as string;
    user.apellido = formModel.apellido as string;
    user.nombres = formModel.nombres as string;
    user.roles = formModel.roles as string ;
    return user;
  }

  onSubmit(){
    this.user = this.prepareSubmitFile();
    this.usersService.update(this.user).subscribe(
      res=>{
        this.toastr.success('Usuario actualizado exitosamente');
        this.router.navigateByUrl('users/index');
      },
      error=>{
        this.toastr.error('Se produjo un error al intentar actualizar el usuario.');
      }
    );
  }
}
