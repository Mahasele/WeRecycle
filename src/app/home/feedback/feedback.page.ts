import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { FirebaseService } from 'src/app/service/firebase.service';

@Component({
  selector: 'app-feedback',
  templateUrl: './feedback.page.html',
  styleUrls: ['./feedback.page.scss'],
  standalone:false
})
export class FeedbackPage implements OnInit {
  feedbackForm: FormGroup;
  ratings=[1,2,3,4,5]
  user:any={}

  constructor(private formBuilder:FormBuilder, private fService:FirebaseService) {
     this.feedbackForm = this.formBuilder.group({
      rating: ['', Validators.required],
      comments: ['',Validators.required],
    });
   }

  ngOnInit() {
    this.fService.auth.onAuthStateChanged(user=>{
      this.user = user
    })
  }

  onSubmit() {
    if (this.feedbackForm.valid) {
      const formData = this.feedbackForm.value;
      // Send the form data to your backend or process it as needed
      this.fService.sendFeedback(formData,this.user?.uid)
      this.feedbackForm.get('rating')?.reset()
      this.feedbackForm.get('comments')?.reset()
    }
  }

}
