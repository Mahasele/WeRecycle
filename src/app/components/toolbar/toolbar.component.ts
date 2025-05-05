import { Component, Input, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { MenuController } from '@ionic/angular';
import { FirebaseService } from 'src/app/service/firebase.service';

@Component({
  selector: 'app-toolbar',
  templateUrl: './toolbar.component.html',
  styleUrls: ['./toolbar.component.scss'],
  standalone:false
})
export class ToolbarComponent  implements OnInit {
  @Input() mainContent:string =''
  @Input() menuId:string =''
  constructor(private menu:MenuController, private route:Router, private fService:FirebaseService) { }

  ngOnInit() {}
  close(){
    this.menu.close('home')
  }
  go(route:string[]){
    this.route.navigate(route)
  }
  logout() {
    this.fService.logout()
  }
}
