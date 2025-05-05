import { materials } from './../../../lib/utils';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { FirebaseService } from 'src/app/service/firebase.service';

@Component({
  selector: 'app-search',
  templateUrl: './search.page.html',
  styleUrls: ['./search.page.scss'],
  standalone:false
})
export class SearchPage implements OnInit {
  form:FormGroup
  searchForm:FormGroup
  materials = materials
  results:any[]=[]
  locations:any[]=[]
  recyclers:any[]=[]
  dateRestricter:string=''
  location:any={}
  user:any={}
  constructor(private builder:FormBuilder, private fService: FirebaseService, private nav:Router) {
    this.form = this.builder.group({
      location: ['', Validators.required],
      materials: ['', Validators.required],
      requestDate: ['', Validators.required],
    });

    this.searchForm = this.builder.group({
      location: [''],
      materials: [''],
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
    this.dateRestricter = new Date().toString()
    let f = new Intl.DateTimeFormat('en-Us', { year: 'numeric', month: '2-digit', day: '2-digit', hour: '2-digit', minute: '2-digit', second: '2-digit' }).format(new Date()).split(' ')
    let d = f[0].split('/')[2] + '-' + f[0].split('/')[0] + '-' + f[0].split('/')[1]
    this.dateRestricter = d.replace(',', '') + 'T' + f[1]
    this.fService.getUsers().subscribe(users=>{
      this.recyclers = users.filter(user=>user.registerType==='recycler')
    })
  }
  handleInput(event: Event,el:string) {

    const target = event.target as HTMLIonSearchbarElement;
    
    if (el==='select') {
      this.results = this.recyclers.filter((d) => d.materials.map((m:string) =>(target?.value)?.includes(m)).find((t:boolean)=>t===true) || d.location.toLowerCase().includes((this.searchForm.get('location')?.value)?.toLowerCase()));
      return
    }
    const query = target.value?.toLowerCase() || '';
    this.results = this.recyclers.filter((d) => d.location.toLowerCase().includes(query) || d.materials.map((m:string) =>(this.searchForm.get('materials')?.value)?.includes(m)).find((t:boolean)=>t===true) );
  }

  handleMaterial(event:Event) {
    const target = event.target as HTMLIonSearchbarElement;
    this.fService.getUser(target?.value || '').subscribe(user=>{
      if (user) {
        this.location = user
      }
    })

  }
  handleLocation() {

  }
  handleSubmit() {
    const {location:recyclerId,materials,requestDate} =this.form.value
    const data = {
      materials,
      recyclerId,
      requestDate
    }
    this.fService.createRequest(data,this.user.id)
    this.form.reset()
  }
}
