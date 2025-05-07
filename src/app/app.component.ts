import { Component } from '@angular/core';
import { FirebaseService } from './service/firebase.service';
import { Router } from '@angular/router';
import { MenuController } from '@ionic/angular';

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss'],
  standalone: false,
})
export class AppComponent {
  user:any={}
  constructor(private menu:MenuController, private fService:FirebaseService, private route:Router) {
    fService.auth.onAuthStateChanged(user=>{
      if (user?.uid) {
        this.fService.getUser(user.uid).subscribe(loggedUser=>{
          this.user = loggedUser
        })
      }
    })
  }
  logout() {
    this.fService.logout()
    this.close()
  }
  go(route:string[]){
    this.route.navigate(route)
  }
  close(){
    this.menu.close('menu')
  }
}
