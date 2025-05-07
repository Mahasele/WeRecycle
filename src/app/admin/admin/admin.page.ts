import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { FirebaseService } from 'src/app/service/firebase.service';

@Component({
  selector: 'app-admin',
  templateUrl: './admin.page.html',
  styleUrls: ['./admin.page.scss'],
  standalone:false
})
export class AdminPage implements OnInit {

  form :FormGroup;
  user:any={}
  admins:any[]=[]
  show = true
  constructor(private builder: FormBuilder, private router: Router,private fService:FirebaseService) {
    this.form = this.builder.group({
      name: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(8)]],
    });
    
  }
  ngOnInit(): void {
    this.fService.auth.onAuthStateChanged(user=>{
      const id = user?.uid || ''
      if (!id) {
        this.router.navigate(['login'],{replaceUrl:true})
      }
      this.fService.getUser(id).subscribe(userData=>{
        if(userData && userData.registerType !=='admin'){
          this.router.navigate(['dashboard','stats'],{replaceUrl:true})
          return
        }
        this.user =userData
        this.fService.getUsers().subscribe(admins=>this.admins=admins.filter(admin=>admin.registerType==='admin'))
        this.fService.loading.dismiss()
      })
    })

    
  }

  register() {
    if(this.user?.id && this.user.registerType !== 'admin'){
      this.router.navigate(['dashboard','stats'],{replaceUrl:true})
      return
    }
    this.fService.register({...this.form.value,registerType:'admin'})
    this.form.reset()
  }
  changeShow() {
    this.show = !this.show
  }
  async delete(id:string) {
    await this.fService.delete(id,'events')
  }
}
