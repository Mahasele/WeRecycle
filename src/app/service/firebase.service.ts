import { Injectable } from '@angular/core';
import { Auth, createUserWithEmailAndPassword, EmailAuthProvider, reauthenticateWithCredential, sendEmailVerification, sendPasswordResetEmail, signInWithEmailAndPassword, signOut, updateEmail, updatePassword } from '@angular/fire/auth';
import { addDoc, collection, collectionData, doc, docData, Firestore, setDoc, updateDoc } from '@angular/fire/firestore';
import { Router } from '@angular/router';
import { AlertController, LoadingController, NavController, ToastController } from '@ionic/angular';
import { FirebaseError } from 'firebase/app';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class FirebaseService {

  constructor(private firestore:Firestore, public auth:Auth, private ctl:AlertController, private nav:NavController, private tost:ToastController , public loading:LoadingController) { }
  register(data:any){
    const {name, surname, email, location, registerType, contact, password,company,materials,days,openTime} = data
    const userData = registerType === "user" ? {name, surname, email, location, registerType, contact}:registerType === "admin"?{name,email,registerType} :{company, email, location, registerType, contact,materials,days,openTime}
    createUserWithEmailAndPassword(this.auth,email,password)
      .then((userCredential) => {
          sendEmailVerification(userCredential?.user).then(value=>{
          setDoc(doc(this.firestore, 'users', userCredential.user.uid),{
              ...userData,
              id: userCredential.user.uid
          })
          this.ctl.create({
            header:'Email verification',
            message:'You are registered, please verify your email to login',
            buttons:['Okay']
          }).then(c=>c.present())
        }).catch((err:FirebaseError)=>{
          console.log('Fail to register: ',err)
        })
      }).catch((err: FirebaseError) => {
            if (err.code ==='auth/email-already-in-use') {
                this.ctl.create({
                    header: 'Email',
                    message: 'Email already exists, go to login',
                    buttons: [{
                        text:'Okay',
                        handler: ()=>this.nav.navigateForward(['/login']),
                    }]
                }).then(c => c.present())
                return
            }
            console.log('Fail to register: ' + err.code)
      })
  }

  loginFireAuth(value:any) {
    //Sthis.loading.create().then(loading=>loading.present())
    return new Promise<any>((resolve, reject) => {
      signInWithEmailAndPassword(this.auth,value.email, value.password).then(
        (res) => {
          this.loading.dismiss()
          // if (res.user?.emailVerified) {
            this.getUser(res.user?.uid).subscribe(user=>{
              if (user && user.registerType==='admin') {
                this.nav.navigateForward(['/admin','dashboard'],{replaceUrl:true})
              }
            })
            this.nav.navigateForward(['/dashboard','stats'],{replaceUrl:true})
            resolve(res.user)
            
          // } else {
          //   this.ctl.create({
          //     header: 'Email verification',
          //     message: 'Please verify your email to login',
          //     buttons: ['Okay']
          //   }).then(c => c.present())
          // }
          
        },
        
      ).catch((error:FirebaseError) => {
          this.loading.dismiss()
            if (error.code ==='auth/invalid-credential') {
              this.tost.create({
                message: 'Wrong Email or password!!',
                position: 'bottom',
                duration: 5000
              }).then(e => e.present())
            }else if(error.code ==='auth/network-request-failed'){
              this.tost.create({
                message: 'Network request failed',
                position: 'bottom',
                duration: 5000
              }).then(e => e.present())
            } else{
              this.tost.create({
                message: error.message,
                position: 'bottom',
                duration: 5000
              }).then(e => e.present())
                // this.loginText = ""
            }
          reject(error);
        });
    });
  }

  resetPassword(email:string){
    sendPasswordResetEmail(this.auth,email).then(()=>{
      this.ctl.create({
        header: 'Reset',
        message: 'Please check your email to reset password',
        buttons: ['Okay']
      }).then(c => c.present())
    })
  }

  logout() {
    signOut(this.auth).then((res: any) =>{
      //this.session=false
      this.nav.navigateBack('/home')
    }).catch((err: any )=>console.log('logError',err))
  }
  getUser(id:string):Observable <any>{
    try{
      //this.loading.create().then((loading: any) => loading.present())
      //setTimeout(() => this.loading.dismiss(), 2000)
      return docData(doc(this.firestore,'users',id)) as Observable<any>;
    }catch(err:any){
      return new Observable(obs => {
        this.loading.dismiss()
        this.nav.navigateBack('/home')
        obs.error(new Error('there is error'))
      })
    } 
  }
  getUsers(): Observable<any[]> {
    try{
      //this.loading.create().then(loading => loading.present())
      //setTimeout(()=>this.loading.dismiss(),2000)
        return collectionData(collection(this.firestore,'users')) as Observable<any[]>
    } catch (err) {
      return new Observable(obs=>{
        obs.error(new Error('there is error'))
      })
    }
    
  }
  updateProfile(data:any,id:string) {
    console.log(data)
    const {name, surname, email, location, registerType, contact, openTime,company,materials,} = data
    const userData = registerType === "user" ? {name, surname, email, location, contact}:{company, email, location, contact, openTime, materials}
    try {
        this.auth.onAuthStateChanged( async(user)=>{
              if(user?.uid === id ) {
                //this.auth.updateCurrentUser()
                if (data?.email !== user?.email && this.auth?.currentUser) {
                  // await reauthenticateWithCredential(auth?.currentUser,credential)
                  //await updateEmail(this.auth?.currentUser,email)
                  
                  await updateDoc(doc(this.firestore,'users',id),userData)
                  this.tost.create({
                    message: 'user updated successfully',
                    position: 'bottom',
                    duration: 5000
                  }).then(e => e.present())
                } else {
                  await updateDoc(doc(this.firestore,'users',id),userData)
                  this.tost.create({
                    message: 'user updated successfully',
                    position: 'bottom',
                    duration: 5000
                  }).then(e => e.present())
                }
              } else {
                this.tost.create({
                  message: 'user updated successfully',
                  position: 'bottom',
                  duration: 5000
                }).then(e => e.present())
              }
            }) 
        
        return "user updated successfully"
      } catch (error:any) {
        this.tost.create({
          message: error?.message,
          position: 'bottom',
          duration: 5000
        }).then(e => e.present())
        return 'Failed to update user'
      }
  }
  changePassword = async (userId:string,data:{password:string,newPassword:string}) =>{
      try {
          const {password,newPassword} = data
          const user = this.auth.currentUser
          if(!password.trim() || !newPassword.trim()) {
            this.tost.create({
              message: 'Missing fields!!',
              position: 'bottom',
              duration: 5000
            }).then(e => e.present())
            return
          }
          if(newPassword.length<8) {
            this.tost.create({
                message: 'Password must be at least 8 characters',
                position: 'bottom',
                duration: 5000
              }).then(e => e.present())
              return
          }
          if(!user || !userId || user?.uid !==userId){
            this.tost.create({
              message: 'You are not authenticated',
              position: 'bottom',
              duration: 5000
            }).then(e => e.present())
            return
          } 
          const credential = EmailAuthProvider.credential(
              user?.email || '',
              password
          );
          if(user) {
            await reauthenticateWithCredential(user,credential)
            await updatePassword(user,newPassword)
            this.tost.create({
                message: 'Password updated successfully',
                position: 'bottom',
                duration: 5000
              }).then(e => e.present())
            return
          }
          
          
      } catch (err:any) {
          this.tost.create({
            message: err?.message,
            position: 'bottom',
            duration: 5000
          }).then(e => e.present())
      }
      
  }
  sendFeedback(data:any,id:string){
    addDoc(collection(this.firestore,'feedbacks'),{
      ...data,
      userId:id,
      createdAt: new Date()
    }).then(ref=>{
      this.tost.create({
        message: 'Feeback sent successfully',
        position: 'bottom',
        duration: 5000
      }).then(e => e.present())
    })
  }
  createRequest(data:any,id:string){
    addDoc(collection(this.firestore,'requests'),{
      ...data,
      userId:id
    }).then(ref=>{
      setDoc(ref,{
      ...data,
      userId:id,
      id:ref.id,
      status:'pending',
      createdAt: new Date()
    })
      this.tost.create({
        message: 'Request created successfully',
        position: 'bottom',
        duration: 5000
      }).then(e => e.present())
    }).catch((error:FirebaseError)=>{
      this.tost.create({
        message: error.message,
        position: 'bottom',
        duration: 5000
      }).then(e => e.present())
    })
  }
  getRequests(): Observable<any[]> {
    try{
      //this.loading.create().then(loading => loading.present())
      //setTimeout(()=>this.loading.dismiss(),2000)
        return collectionData(collection(this.firestore,'requests')) as Observable<any[]>
    } catch (err) {
      return new Observable(obs=>{
        obs.error(new Error('there is error'))
      })
    }
    
  }
  createEvent(data:any,id:string){
    addDoc(collection(this.firestore,'events'),{
      ...data,
      userId:id
    }).then(ref=>{
      setDoc(ref,{
      ...data,
      userId:id,
      id:ref.id,
      createdAt: new Date()
    })
      this.tost.create({
        message: 'Event created successfully',
        position: 'bottom',
        duration: 5000
      }).then(e => e.present())
    }).catch((error:FirebaseError)=>{
      this.tost.create({
        message: error.message,
        position: 'bottom',
        duration: 5000
      }).then(e => e.present())
    })
  }
  createGuideline(data:any,id:string){
    addDoc(collection(this.firestore,'guidelines'),{
      ...data,
      userId:id
    }).then(ref=>{
      setDoc(ref,{
      ...data,
      userId:id,
      id:ref.id,
      createdAt: new Date()
    })
      this.tost.create({
        message: 'Guideline created successfully',
        position: 'bottom',
        duration: 5000
      }).then(e => e.present())
    }).catch((error:FirebaseError)=>{
      this.tost.create({
        message: error.message,
        position: 'bottom',
        duration: 5000
      }).then(e => e.present())
    })
  }
  createTip(data:any,id:string){
    addDoc(collection(this.firestore,'tips'),{
      ...data,
      userId:id
    }).then(ref=>{
      setDoc(ref,{
      ...data,
      userId:id,
      id:ref.id,
      createdAt: new Date()
    })
      this.tost.create({
        message: 'Tip created successfully',
        position: 'bottom',
        duration: 5000
      }).then(e => e.present())
    }).catch((error:FirebaseError)=>{
      this.tost.create({
        message: error.message,
        position: 'bottom',
        duration: 5000
      }).then(e => e.present())
    })
  }
  getTips(): Observable<any[]> {
    return collectionData(collection(this.firestore, 'tips'))
  }
  getGuidelines(): Observable<any[]> {
    return collectionData(collection(this.firestore, 'guidelines'))
  }
  getFeedbacks(): Observable<any[]> {
    return collectionData(collection(this.firestore, 'feedbacks'))
  }
  getEvents(): Observable<any[]> {
    return collectionData(collection(this.firestore, 'events'))
  }
  changeStatusRequest(requestId:string,status:string) { 
    updateDoc(doc(this.firestore, 'requests', requestId), { status })
  }
}
