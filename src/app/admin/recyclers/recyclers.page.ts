import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { FirebaseService } from 'src/app/service/firebase.service';
import { materials } from 'src/lib/utils';

@Component({
  selector: 'app-recyclers',
  templateUrl: './recyclers.page.html',
  styleUrls: ['./recyclers.page.scss'],
  standalone:false
})
export class RecyclersPage implements OnInit {

  form :FormGroup;
  materials = materials
  user:any = {}
  constructor(private builder: FormBuilder, private nav: Router,private fService: FirebaseService) {
    this.form = this.builder.group({
      location: ['', Validators.required],
      days: ['', Validators.required],
      openTime: ['', Validators.required],
      materials: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      company: ['', Validators.required],
      contact: ['', [Validators.required, Validators.pattern('^\\+?\\d{1,4}?[-.\\s]?\\(?\\d{1,3}?\\)?[-.\\s]?\\d{1,4}[-.\\s]?\\d{1,4}[-.\\s]?\\d{1,9}$')]],
      password: ['', [Validators.required, Validators.minLength(8)]],
    });

    this.fService.loading.dismiss()
  }
  ngOnInit(): void {
    this.info()
    this.fService.loading.dismiss()
  }

  register() {
    this.fService.register({...this.form.value,registerType:'recycler'})
    this.form.reset()
  }

  info(){
    this.fService.auth.onAuthStateChanged((user)=>{
      this.fService.loading.create().then((loading) => {
        loading.present()
      let id = user?.uid || ''
      this.fService.getUser(id).subscribe(userData=>{
        this.user =userData
        loading.dismiss()
        this.fService.loading.dismiss()
      })
      loading.dismiss()
      })
    })
  }

}
