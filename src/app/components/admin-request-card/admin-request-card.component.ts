import { Component, Input, OnInit } from '@angular/core';
import { IonCol, IonCard } from "@ionic/angular/standalone";
import { FirebaseService } from 'src/app/service/firebase.service';

@Component({
  selector: 'app-admin-request-card',
  templateUrl: './admin-request-card.component.html',
  styleUrls: ['./admin-request-card.component.scss'],
  standalone:false
})
export class AdminRequestCardComponent  implements OnInit {
  @Input() req:any ={}
  constructor(private fService:FirebaseService) { }

  ngOnInit() {}
  changeStatus(requestId:string,status:string){
    this.fService.changeStatusRequest(requestId,status)
  }
}
