import { routes } from './../../../lib/utils';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { FirebaseService } from 'src/app/service/firebase.service';
import { materials } from 'src/lib/utils';

@Component({
  selector: 'app-guidelines',
  templateUrl: './guidelines.page.html',
  styleUrls: ['./guidelines.page.scss'],
  standalone:false
})
export class GuidelinesPage implements OnInit {
  materials = materials
  routes = routes
  show:string = "list"
  guides:any = []
  guide:any={}
  user:any = {}
  form :FormGroup;
    constructor(private builder: FormBuilder, private fService: FirebaseService,private nav :Router) {
      this.form = this.builder.group({
        item: ['', Validators.required],
        material: ['', Validators.required],
        preparation: ['', Validators.required],
        sorting: ['', Validators.required ],
        methods: ['', Validators.required]
      });
    }
  ngOnInit() {
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
    this.getGuidelines()
  }
  changeShow(guide:any,show:string){
    this.guide = guide
    this.show = show
  }
  
  createGuideline(){
   this.fService.createGuideline({...this.form.value},this.user!.id)
   this.form.reset();
   this.getGuidelines()
  }
  getGuidelines(){
    this.fService.getGuidelines().subscribe(guides=>{
      this.guides=[]
      if (guides.length > 0) {
        guides.map(guide=>{
          let name
          this.fService.getUser(guide.userId).subscribe(user=>{
            name = user.company
            this.guides.push({...guide,name}) 
          })
          return {...guide}
        })
      }
    })
  }
  go(path:string[]){
    this.nav.navigate(path)
  }
}
