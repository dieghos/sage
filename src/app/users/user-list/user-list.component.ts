import { Component, OnInit } from '@angular/core';
import { User } from '../user';
import { UsersService } from '../users.service';

@Component({
  selector: 'sage-user-list',
  templateUrl: './user-list.component.html'
})

export class UserListComponent implements OnInit {

  users:User[] = [];
  constructor(
    private usersService:UsersService
  ){}

  ngOnInit(){
    this.usersService.getUsers().subscribe(
      (res:any)=>{
        this.users = res.users;
      },
      error =>{
        console.error(error);
      }
    )
  }
}
