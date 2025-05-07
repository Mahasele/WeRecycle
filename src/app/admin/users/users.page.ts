import { Component, OnInit } from '@angular/core';
import { FirebaseService } from 'src/app/service/firebase.service';

@Component({
  selector: 'app-users',
  templateUrl: './users.page.html',
  styleUrls: ['./users.page.scss'],
  standalone:false
})
export class UsersPage implements OnInit {
  users:any[]=[]
  constructor(private fService:FirebaseService) { }

  ngOnInit() {
    this.fService.getUsers().subscribe(users=>this.users=users.filter(user=>user.registerType !== 'admin'))
  }
  async delete(id:string) {
    await this.fService.delete(id,'users')
  }
}
