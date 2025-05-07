import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { MenuController } from '@ionic/angular';
import { FirebaseService } from '../service/firebase.service';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
  standalone: false,
})
export class HomePage {

  constructor(private router: Router, private menu:MenuController,private fService:FirebaseService) { }

  ngOnInit() {
    this.fService.loading.dismiss()
  }

  goToRegister() {
    this.router.navigate(['register'])
  }

  goToSignin() {
    this.router.navigate(['login'])
  }
  close(){
    this.menu.close('home')
  }

}
