import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { FirebaseService } from 'src/app/service/firebase.service';

@Component({
  selector: 'app-register',
  templateUrl: './register.page.html',
  styleUrls: ['./register.page.scss'],
  standalone: false,
})

export class RegisterPage implements OnInit {
  // user:User = User.none
  form :FormGroup;
  constructor(private builder: FormBuilder, private nav: Router,private db:FirebaseService) {
    this.form = this.builder.group({
      name: ['', Validators.required],
      surname: ['', Validators.required],
      location: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(8)]],
      contact: ['', [Validators.required, Validators.pattern('^\\+?\\d{1,4}?[-.\\s]?\\(?\\d{1,3}?\\)?[-.\\s]?\\d{1,4}[-.\\s]?\\d{1,4}[-.\\s]?\\d{1,9}$')]]
    });
    
  }
  ngOnInit(): void {
    
  }

  register() {
    this.db.register({...this.form.value,registerType:'user'})
    this.form.reset()
  }

  goToLogin(){
  this.nav.navigate(["login"])
  }
  
}
 






 



