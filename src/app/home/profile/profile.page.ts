import { materials } from './../../../lib/utils';
import { Role } from './../../../lib/user-type';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { FirebaseService } from 'src/app/service/firebase.service';


@Component({
  selector: 'app-profile',
  templateUrl: './profile.page.html',
  styleUrls: ['./profile.page.scss'],
  standalone:false
})
export class ProfilePage implements OnInit {
  
  form :FormGroup;
  passwordForm :FormGroup;
  materials = materials
  user:any = {}
  constructor(private builder: FormBuilder, private nav: Router,private fService: FirebaseService) {
    this.form = this.builder.group({
      name: ['', Validators.required],
      surname: ['', Validators.required],
      location: ['', Validators.required],
      openTime: ['', Validators.required],
      materials: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      registerType: [''],
      company: ['', Validators.required],
      contact: ['', [Validators.required, Validators.pattern('^\\+?\\d{1,4}?[-.\\s]?\\(?\\d{1,3}?\\)?[-.\\s]?\\d{1,4}[-.\\s]?\\d{1,4}[-.\\s]?\\d{1,9}$')]]
    });

    this.passwordForm = this.builder.group({
      password: ['', [Validators.required]],
      newPassword: ['', [Validators.required, Validators.minLength(8)]],
    });
    this.fService.loading.dismiss()
  }
  ngOnInit(): void {
    this.form.get('registerType')?.valueChanges.subscribe(() => {
      if (this.form.getRawValue().registerType === 'user') {
        this.form.get('company')?.clearValidators()
        this.form.get('company')?.updateValueAndValidity()
        this.form.get('openTime')?.clearValidators()
        this.form.get('openTime')?.updateValueAndValidity()
        this.form.get('materials')?.clearValidators()
        this.form.get('materials')?.updateValueAndValidity()
        this.form.get('name')?.setValidators(Validators.required)
        this.form.get('name')?.updateValueAndValidity()
        this.form.get('surname')?.setValidators(Validators.required)
        this.form.get('surname')?.updateValueAndValidity()
        this.form.updateValueAndValidity()
    
      } else {
        this.form.get('name')?.clearValidators()
        this.form.get('name')?.updateValueAndValidity()
        this.form.get('surname')?.clearValidators()
        this.form.get('surname')?.updateValueAndValidity()
        this.form.get('company')?.setValidators(Validators.required)
        this.form.get('company')?.updateValueAndValidity()
        this.form.get('materials')?.setValidators(Validators.required)
        this.form.get('materials')?.updateValueAndValidity()
        this.form.get('openTime')?.setValidators(Validators.required)
        this.form.get('openTime')?.updateValueAndValidity()
        this.form.updateValueAndValidity()
      }
    })
    this.info()
    this.fService.loading.dismiss()
  }

  updateProfile() {
    this.fService.updateProfile(this.form.value,this.user?.id)
    this.info()
  }

  info(){
    this.fService.auth.onAuthStateChanged((user)=>{
      this.fService.loading.create().then((loading: any) => loading.present())
      let id = user?.uid || ''
      this.fService.getUser(id).subscribe(userData=>{
        this.user =userData
        this.form.get('email')?.setValue(userData?.email)
        this.form.get('registerType')?.setValue(userData?.registerType)
        this.form.get('company')?.setValue(userData?.company)
        this.form.get('location')?.setValue(userData?.location)
        this.form.get('contact')?.setValue(userData?.contact)
        this.form.get('name')?.setValue(userData?.name)
        this.form.get('surname')?.setValue(userData?.surname)
        this.form.get('openTime')?.setValue(userData?.openTime)
        this.form.get('materials')?.setValue(userData?.materials)
        //this.form.get('surname')?.setValue(userData?.surname)
        //console.log('user',userData)
        this.fService.loading.dismiss()
      })
    })
  }
  changePassword() {
    this.fService.changePassword(this.user?.id,this.passwordForm.value)
  }
  goToLogin(){
  this.nav.navigate(["login"])
  }

}
