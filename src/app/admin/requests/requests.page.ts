import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { FirebaseService } from 'src/app/service/firebase.service';

@Component({
  selector: 'app-requests',
  templateUrl: './requests.page.html',
  styleUrls: ['./requests.page.scss'],
  standalone:false
})
export class RequestsPage implements OnInit {
  user:any = {}
  requests:{
    today:any[],
    all:any[],
    pending:any[],
    approved:any[],
    cancelled:any[]
  } ={
    today:[],
    all:[],
    pending:[],
    approved:[],
    cancelled:[]
  }
  constructor(private fService: FirebaseService,private nav :Router) { 
      
    }
  
    ngOnInit() {
      this.fService.loading.create().then((loading: any) => {
        loading.present()
        this.fService.auth.onAuthStateChanged((user)=>{
          let id = user?.uid || ''
          if(!id){
            this.fService.loading.dismiss()
            this.nav.navigate(['login'],{replaceUrl:true})
            return
          }
          this.fService.getUser(id).subscribe(userData=>{
            this.user =userData
            this.fService.loading.dismiss()
          })
          this.fService.getRequests().subscribe(requests=>{
            this.requests ={
              today:[],
              all:[],
              pending:[],
              approved:[],
              cancelled:[]
            }
            let reqs = requests.sort((a,b)=>new Date(b.requestDate).getTime() - new Date(a.requestDate).getTime())
            const d = reqs.map(req=>{
              let passed = false
              if (new Date(req.requestDate).getTime()< Date.now()) {
                  passed = true
                  req= {...req,passed}
                }
              if (req.status==='pending' && new Date(req.requestDate).getTime()< Date.now()) {
                  
                  req= {...req,status:'expired'}
                }
              this.fService.getUser(req.userId).subscribe(user=>{
                this.fService.getUser(req.recyclerId).subscribe(recycler=>{
                this.requests.all.push({...req,user,recycler})
                if (req.status==='pending' && new Date(req.requestDate).getTime()> Date.now()) {
                  this.requests.pending.push({...req,user,recycler})
                }
                if (req.status==='approved' && new Date(req.requestDate).getTime()> Date.now()) {
                  this.requests.approved.push({...req,user,recycler})
                }
                if (req.status==='cancelled') {
                  this.requests.cancelled.push({...req,user,recycler})
                }
                  
                })
              })
              return req
            })
          })
        })
        this.fService.loading.dismiss()
      })
    }
    changeStatus(requestId:string,status:string){
      this.fService.changeStatusRequest(requestId,status)
    }
}
