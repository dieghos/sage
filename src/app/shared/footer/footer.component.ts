import { Component, OnInit } from '@angular/core';
import { AuthService } from '../../auth/auth.service';

@Component({
  selector: 'sage-footer',
  templateUrl: './footer.component.html'
})
export class FooterComponent implements OnInit {

  constructor(private authService:AuthService) { }

  ngOnInit() {

  }

  isAuthenticated(){
    return this.authService.isAuthenticated();
  }
}
