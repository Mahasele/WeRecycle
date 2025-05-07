import { FirebaseService } from 'src/app/service/firebase.service';
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-stats',
  templateUrl: './stats.page.html',
  styleUrls: ['./stats.page.scss'],
  standalone:false
})
export class StatsPage implements OnInit {
  recyclers:any[] = [];
  guides:any = []
  tips:any = []
  user:any = {}
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
  recyclerRequests:{
    total:Number,
    today:Number,
    upcoming:Number,
    previous:Number
  } ={
    total:0,
    today:0,
    upcoming:0,
    previous:0
  }
  constructor(private fService: FirebaseService,private nav :Router) { 
  }

  ngOnInit() {
    
    this.fService.auth.onAuthStateChanged((user)=>{
      this.fService.loading.create().then(async(loading)=>{
        loading.present()
          let id = user?.uid || ''
        if(!id){
          this.fService.loading.dismiss()
          loading.dismiss()
          this.nav.navigate(['login'],{replaceUrl:true})
          return
        }
        
        this.fService.getUser(id).subscribe(userData=>{
          
          this.user =userData
          if (userData && userData.registerType==='admin') {
            loading.dismiss()
            this.fService.loading.dismiss()
            this.nav.navigate(['admin','dashboard'],{replaceUrl:true})
            return
          } 
        })
         this.fService.getRequests().subscribe(reqs=>{
          if (this.user.registerType==='recycler') {
            let recyclerRequests =reqs.filter(req=>req.recyclerId===user?.uid)
            this.recyclerRequests={
              total:recyclerRequests.length,
              today:recyclerRequests.filter(req=>req.status==='approved' && new Date(req.requestDate).toDateString() === new Date().toDateString()).length,
              upcoming:recyclerRequests.filter(req=>req.status==='approved' && new Date(req.requestDate).getTime()> Date.now()).length,
              previous:recyclerRequests.filter(req=>req.status==='approved' && new Date(req.requestDate).getTime() < Date.now()).length,
            }
          } else {
            let userRequests =reqs.filter(req=>req.userId===user?.uid)
            this.mostFrequentElements(userRequests).map(id=>{
              this.fService.getUser(id).subscribe(user=>this.recyclers.push({...user}))
            })
            this.requests={
              total:userRequests.length,
              pending:userRequests.filter(req=>req.status==='pending' && new Date(req.requestDate).getTime()> Date.now()).length,
              approved:userRequests.filter(req=>req.status==='approved' && new Date(req.requestDate).getTime()> Date.now()).length,
              cancelled:userRequests.filter(req=>req.status==='cancelled').length,
            }
          }
          loading.dismiss()
          this.fService.loading.dismiss()
        })
        loading.dismiss()
        this.fService.loading.dismiss()
      })
      
    })
    this.getGuidelines()
    this.getTips()
    this.fService.loading.dismiss()
  }
  getGuidelines(){
  this.fService.getGuidelines().subscribe(guides=>{
    this.guides = []
    if (guides.length > 0) {
      if (guides.length>1) {
        guides.slice(0,1).map(guide=>{
        let name
        this.fService.getUser(guide.userId).subscribe(user=>{
          name = user.company
          this.guides.push({...guide,name}) 
        })
        return {...guide}
      })
      } else {
       guides.map(guide=>{

        let name
        this.fService.getUser(guide.userId).subscribe(user=>{
          name = user.company
          this.guides.push({...guide,name}) 
        })
        return {...guide}
      }) 
      }
      
    }
  })
  }
  getTips(){
  this.fService.getTips().subscribe(tips=>{
    this.tips = []
    if (tips.length > 0) {
      if (tips.length>1) {
        tips.slice(0,1).map(tip=>{
        let name
        this.fService.getUser(tip.userId).subscribe(user=>{
          name = user.company
          this.tips.push({...tip,name,createdAt:new Date(tip.createdAt.seconds*1000).toDateString()}) 
        })
        return {...tip}
      })
      } else {
       tips.map(tip=>{
        let name
        this.fService.getUser(tip.userId).subscribe(user=>{
          name = user.company
          
          this.guides.push({...tip,name,createdAt:new Date(tip.createdAt.seconds*1000).toDateString()}) 
        })
        return {...tip}
      }) 
      }
      
    }
  })
  }
  logout() {
    this.user={}
    this.fService.logout()
  }
  mostFrequentElements(data: any[]): any[] {
      
    
const recyclerIds = data.map(item => item.recyclerId).filter(id => id !== undefined);


const countMap:any = {};
recyclerIds.forEach(id => {
  countMap[id] = (countMap[id] || 0) + 1;
});


const result = Object.keys(countMap).filter(id => countMap[id] > 2);

      return result;
  }
}
