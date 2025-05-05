import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { FirebaseService } from 'src/app/service/firebase.service';
import Swiper from 'swiper';
import {register} from 'swiper/element/bundle'
register()

@Component({
  selector: 'app-testimonials',
  templateUrl: './testimonials.component.html',
  styleUrls: ['./testimonials.component.scss'],
  standalone:false
})
export class TestimonialsComponent  implements OnInit {
  @ViewChild('swiper')
  swiperRef: ElementRef | undefined;
  swiper?: Swiper;
 testimonies:any[] = []
 raingStars = Array(5)
 rating =5

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
      
    })
  }

  ngOnInit() {
    setInterval(() => {
      document.querySelector('swiper-container')?.swiper.slideNext()
  }, 2000);
  }
  swiperReady() {
    this.swiper = this.swiperRef?.nativeElement.swiper;
    console.log('hh')
  }
   sidel = true
i = document.querySelector('swiper-container')?.swiper.clickedIndex || 0
  goNext() {
    
    //document.querySelector('swiper-container')?.swiper.slideNext()
    
    this.i++ 
    console.log('loged',this.i);
    if(this.i === this.testimonies.length-1){
      this.i=0
      this.sidel=false
    } else if(this.i===0){
      this.sidel=true
    }
    if (this.sidel) {
      document.querySelector('swiper-container')?.swiper.slideNext()
      return
    }
    document.querySelector('swiper-container')?.swiper.slidePrev()
   
  }

  goPrev() {
    this.swiper?.slidePrev();
  }
  swiperSlideChanged(e: Event) {
    console.log('changed: ', e);
  }
}
