import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { FirebaseService } from 'src/app/service/firebase.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
  standalone: false,
})
export class LoginPage implements OnInit{
  email: string = '';
  password: string = '';
  loginForm: FormGroup;

  constructor(private formBuilder:FormBuilder, private nav:Router, private fService:FirebaseService ) {
 
  
    this.loginForm = formBuilder.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required]],
    });}

  ngOnInit(): void {
  }

   async onSubmit() {
      if (this.loginForm.invalid) {
        return;
      }
      const loading = await this.fService.loading.create()
      loading.present()
      await this.fService.loginFireAuth(this.loginForm.value)
      this.loginForm.reset();
      loading.dismiss()
      this.fService.loading.dismiss()
  }
  goToSignUp() {
    this.nav.navigate(["register"])
  }
  resetPassword() {
    if (this.loginForm.get('email')?.valid) { 
      this.fService.resetPassword(this.loginForm.get('email')?.value)
    }
  }

}


