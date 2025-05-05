import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { IonHeader } from "@ionic/angular/standalone";
import { FirebaseService } from 'src/app/service/firebase.service';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.page.html',
  styleUrls: ['./dashboard.page.scss'],
  standalone: false,
})
export class DashboardPage implements OnInit {
  user:any={}
  constructor(private fService: FirebaseService,private nav :Router) { }

  ngOnInit() {
    this.fService.auth.onAuthStateChanged((user)=>{
      let id = user?.uid || ''
      if(!id){
        this.nav.navigate(['login'],{replaceUrl:true})
        return
      }
      this.fService.getUser(id).subscribe(userData=>{
        if (!userData) {
          this.nav.navigate(['login'],{replaceUrl:true})
          return
        }
        if (userData && userData.registerType==='admin') {
          this.nav.navigate(['admin','dashboard'],{replaceUrl:true})
          return
        }
        this.nav.navigate(['dashboard','stats'],{replaceUrl:true})
      })
      
    })
  }

}
