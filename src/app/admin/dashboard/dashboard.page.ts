import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { MenuController } from '@ionic/angular';
import { FirebaseService } from 'src/app/service/firebase.service';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.page.html',
  styleUrls: ['./dashboard.page.scss'],
  standalone:false
})
export class DashboardPage implements OnInit {
  user:any = {}
  users:{users:Number,recyclers:Number} = {users:0,recyclers:0}
  requests:{
    total:Number,
    pending:Number,
    approved:Number,
    cancelled:Number
  } ={
    total:0,
    pending:0,
    approved:0,
    cancelled:0
  }
  constructor(private router: Router, private menu:MenuController,private fService:FirebaseService) { }
  
  ngOnInit() {
    this.fService.auth.onAuthStateChanged((user)=>{
      let id = user?.uid || ''
      if(!id){
        this.fService.loading.dismiss()
        this.router.navigate(['login'],{replaceUrl:true})
        return
      }
      this.fService.getUser(id).subscribe(userData=>{
        if(userData && userData.registerType !=='admin'){
          this.router.navigate(['dashboard','stats'],{replaceUrl:true})
          return
        }
        this.user =userData
        this.fService.loading.dismiss()
      })
      this.fService.getRequests().subscribe(reqs=>{
        let userRequests =reqs
        this.requests={
          total:userRequests.length,
          pending:userRequests.filter(req=>req.status==='pending' && new Date(req.requestDate).getTime()> Date.now()).length,
          approved:userRequests.filter(req=>req.status==='approved' && new Date(req.requestDate).getTime()> Date.now()).length,
          cancelled:userRequests.filter(req=>req.status==='cancelled').length,
        }
      })
      this.fService.getUsers().subscribe(users=>{
        this.users= {
          users:users.filter(us=>us.registerType==='user').length,
          recyclers:users.filter(us=>us.registerType==='recycler').length}
      })
    })
    this.fService.loading.dismiss()
  }
  goToRegister() {
    this.router.navigate(['register'])
  }

  goToSignin() {
    this.router.navigate(['dashboard'])
  }
  close(){
    this.menu.close('home')
  }
  open(){
    this.menu.open('home')
  }

}
