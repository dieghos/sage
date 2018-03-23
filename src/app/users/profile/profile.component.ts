import { Component, OnInit, ViewChild } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { User } from '../user';
import { UsersService } from '../users.service';
import { DomSanitizer, SafeUrl } from '@angular/platform-browser';
import { StorageService } from '../../shared/storage.service';
import { Router } from '@angular/router';
import { HeaderComponent } from '../../shared/header/header.component';

@Component({
  selector: 'sage-profile',
  templateUrl: './profile.component.html'
})

export class ProfileComponent implements OnInit {
  public filePreviewPath: SafeUrl;
  @ViewChild('fileInput') fileInput;

  current_user:User = new User();
  label = '';
  fileForm:FormGroup = this.fb.group({
    grado:'',
    apellido:'',
    nombres:'',
    legajo:'',
    photo:''
  });

  constructor(
    private usersService:UsersService,
    private storageService:StorageService,
    private fb: FormBuilder,
    private sanitizer: DomSanitizer,
    private router:Router
  ){

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
      grado:user.grado,
      apellido:user.apellido,
      nombres:user.nombres,
      legajo:user.legajo
    });
  }

  handleFileInput(files: FileList) {
    if(files.length > 0){
      this.filePreviewPath  = this.sanitizer.bypassSecurityTrustUrl((window.URL.createObjectURL(files[0])));
      this.label = files.item(0).name;
    }
  }

  onSubmit(){
    this.current_user = this.prepareSubmitFile();
    let fileBrowser = this.fileInput.nativeElement;
    if (fileBrowser.files && fileBrowser.files[0]) {
      const formData = new FormData();
      for(var i=0;i<fileBrowser.files.length;i++){
        formData.append("image", fileBrowser.files[i]);
      }
      this.storageService.upload(formData).subscribe(
        (res:any)=>{
          for(var i=0; i< res.files.length;i++){
            this.current_user.photo = './assets/images/'+res.files[i].filename;
          }
          this.saveUser();
        },
        error=>{
          console.error(error);
        }
      );
    }
    else{
      this.saveUser();
    }
  }

  prepareSubmitFile(): User {
    const formModel = this.fileForm.value;
    let user: User = new User();
    user._id = this.current_user._id;
    user.username = this.current_user.username;
    user.grado = formModel.grado as string;
    user.legajo = formModel.legajo as string;
    user.apellido = formModel.apellido as string;
    user.nombres = formModel.nombres as string;
    return user;
  }

  saveUser(){
    this.usersService.update(this.current_user).subscribe(
      res=>{
        HeaderComponent.updateLoginUser.next(true);
        this.router.navigateByUrl('sage');
      },
      error=>{
        console.error(error)
      }
    )
  }
}
