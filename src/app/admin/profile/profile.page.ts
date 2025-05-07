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
  user:any = {}
  constructor(private builder: FormBuilder, private nav: Router,private fService: FirebaseService) {
    this.form = this.builder.group({
      email: ['', [Validators.required, Validators.email]],
      name: ['', Validators.required],
    });

    this.passwordForm = this.builder.group({
      password: ['', [Validators.required]],
      newPassword: ['', [Validators.required, Validators.minLength(8)]],
    });
  }
  ngOnInit(): void {
    this.info()
    this.fService.loading.dismiss()
  }

  updateProfile() {
    this.fService.updateProfile({...this.form.value,registerType:"admin"},this.user?.id)
    this.info()
  }

  info(){
    this.fService.auth.onAuthStateChanged((user)=>{
      this.fService.loading.create().then((loading: any) => {
        loading.present()
          let id = user?.uid || ''
        this.fService.getUser(id).subscribe(userData=>{
          this.user =userData
          this.form.get('email')?.setValue(userData?.email)
          this.form.get('name')?.setValue(userData?.name)
          //this.form.get('surname')?.setValue(userData?.surname)
          //console.log('user',userData)
          loading.dismiss()
          this.fService.loading.dismiss()
        })
      })
      
    })
  }
  changePassword() {
    this.fService.changePassword(this.user?.id,this.passwordForm.value)
    this.passwordForm.reset()
  }

}
