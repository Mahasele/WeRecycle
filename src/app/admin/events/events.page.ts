import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AlertController } from '@ionic/angular';
import { FirebaseService } from 'src/app/service/firebase.service';

@Component({
  selector: 'app-events',
  templateUrl: './events.page.html',
  styleUrls: ['./events.page.scss'],
  standalone:false
})
export class EventsPage implements OnInit {

  eventForm:FormGroup
  dateRestricter
  show = true
  user:any={}
  events:{upcoming:any[],previous:any[]} = {upcoming:[],previous:[]}

  constructor(private formBuilder: FormBuilder, private nav: Router,private alertCrl: AlertController,private fService:FirebaseService) {
    this.eventForm = this.formBuilder.group({
      title: ['', Validators.required],
      eventDate: ['', Validators.required],
      eventLocation: ['', Validators.required],
    });
    this.dateRestricter = new Date().toString()

    let f = new Intl.DateTimeFormat('en-Us', { year: 'numeric', month: '2-digit', day: '2-digit', hour: '2-digit', minute: '2-digit', second: '2-digit' }).format(new Date()).split(' ')
    console.log(f)
    let year = f[0].split('/')[2] , month =f[0].split('/')[0], day = f[0].split('/')[1]
    
    let d = year+ '-' + month + '-' +day 

    this.dateRestricter = d.replace(',', '') + 'T' + f[1]
    
  }
  ngOnInit() {
    this.fService.auth.onAuthStateChanged((user)=>{
      this.fService.loading.create().then((loading) => {
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
          
          //console.log('user',userData)
          loading.dismiss()
          this.fService.loading.dismiss()
        })
      })
      
    })
    this.fService.getEvents().subscribe(events=>{
      this.events.upcoming = events.filter(event=>new Date(event.eventDate).getTime()>Date.now())
      this.events.previous = events.filter(event=>new Date(event.eventDate).getTime()<Date.now())
    })
  }
 onSubmit(){
  if (this.eventForm.valid) {
    this.fService.createEvent({...this.eventForm.value,host:this.user.name},this.user.id)
    this.eventForm.reset()
  }
 }
 changeShow() {
    this.show = !this.show
  }
  async delete(id:string) {
    await this.fService.delete(id,'events')
  }

}
