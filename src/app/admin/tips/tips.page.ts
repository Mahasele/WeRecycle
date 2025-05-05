import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { FirebaseService } from 'src/app/service/firebase.service';

@Component({
  selector: 'app-tips',
  templateUrl: './tips.page.html',
  styleUrls: ['./tips.page.scss'],
  standalone:false
})
export class TipsPage implements OnInit {

  materials = ["plastic","electronics","batteries","glass","paper","hazardous waste"]
    show:string = "list"
    tips:any = []
    tip:any={}
    user:any = {}
    form :FormGroup;
    constructor(private builder: FormBuilder, private fService: FirebaseService,private nav :Router) {
      this.form = this.builder.group({
        title: ['', Validators.required],
        articleHref: [''],
        details: ['', Validators.required],
      });
      }
    ngOnInit() {
      this.form.get('articleHref')?.clearValidators()
      this.form.get('articleHref')?.updateValueAndValidity()
      this.form.updateValueAndValidity()
      this.fService.auth.onAuthStateChanged((user)=>{
        let id = user?.uid || ''
        if(!id){
          this.fService.loading.dismiss()
          this.nav.navigate(['login'],{replaceUrl:true})
          return
        }
        this.fService.getUser(id).subscribe(userData=>{
          this.user =userData
          console.log('user',userData)
          this.fService.loading.dismiss()
        })
      })
      this.getTips()
    }
    changeShow(tip:any,show:string){
      this.tip = tip
      this.show = show
    }
    
    createTip(){
     this.fService.createTip({...this.form.value},this.user!.id)
     this.form.reset();
     this.getTips()
    }
    getTips(){
      this.fService.getTips().subscribe(tips=>{
        if (tips.length > 0) {
          tips.map(tip=>{
            let name
            this.fService.getUser(tip.userId).subscribe(user=>{
              name = user.company
              this.tips.push({...tip,name}) 
            })
            return {...tip}
          })
        }
      })
    }
  

}
