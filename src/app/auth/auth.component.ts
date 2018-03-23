import { Component, Input, ViewContainerRef } from '@angular/core';
import { IndexComponent } from '../shared/index/index.component';
import { HeaderComponent } from '../shared/header/header.component';
import { FormGroup, FormBuilder} from '@angular/forms';
import { ToastsManager } from 'ng2-toastr/ng2-toastr';
import { User } from '../shared/models/user';
import { AuthService } from './auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'sage-auth',
  templateUrl: './auth.component.html'
})
export class AuthComponent {
  authForm: FormGroup;
  user:User;

  @Input('modalRef') modalRef;

  constructor(
    private router:Router,
    private authService: AuthService,
    private fb: FormBuilder
  ) {
    this.createForm();
  }

/**
* Crea el formulario de autenticacion.
*/
  createForm() {
    this.authForm = this.fb.group({
      name: '',
      password:''
    });
  }

/**
* Acciones a realizar cuando se envia el formulario.
*/
  onSubmit(){
    this.user = this.prepareSubmitUser();
    this.authService.login(this.user).subscribe(
    (res:any)=>{
        localStorage.setItem('token',res.token);
        localStorage.setItem('id',res.user._id);
        localStorage.setItem('role',res.user.roles);
        this.modalRef.close();
        IndexComponent.updateLoginStatus.next(true);
        HeaderComponent.updateLoginUser.next(true);
        this.router.navigate(['sage/index']);
      },
      error => {
        console.error(error);
      }
    );
    this.authForm.reset();
  }

/**
* Transforma los datos del formulario en un objeto del tipo User y lo devuelve.
*/
  prepareSubmitUser(): User {
    const formModel = this.authForm.value;
    const user: User = {
      username: formModel.name as string,
      password: formModel.password as string
    };
    return user;
  }

  close(){
    this.modalRef.close();
  }
}
