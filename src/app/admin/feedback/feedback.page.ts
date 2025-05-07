import { Component, OnInit } from '@angular/core';
import { FirebaseService } from 'src/app/service/firebase.service';

@Component({
  selector: 'app-feedback',
  templateUrl: './feedback.page.html',
  styleUrls: ['./feedback.page.scss'],
  standalone:false
})
export class FeedbackPage implements OnInit {

  testimonies:any[] = []
  
    constructor(private fire: FirebaseService) { 
      
      fire.getFeedbacks().subscribe(feedbacks=> {
        this.testimonies = []
        feedbacks.map(feed=>{
          this.fire.getUser(feed.userId).subscribe(user=>{
            this.testimonies.push({...feed,name:user.registerType==='recycler'?user.company:user.name})
            feed = {...feed,...user}
          })
          return feed
        })
        
      }) }

  ngOnInit() {
  }
  async delete(id:string) {
    await this.fire.delete(id,'feedbacks')
  }
}
