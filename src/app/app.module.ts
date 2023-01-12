import { NgModule} from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { HotToastModule } from '@ngneat/hot-toast';
import { HomeComponent } from './components/home/home.component';
import { KategoriComponent } from './components/kategori/kategori.component';
import { LoginComponent } from './components/login/login.component';
import { UyeComponent } from './components/uye/uye.component';
import { UrunComponent } from './components/urun/urun.component';
import { KayitComponent } from './components/kayit/kayit.component';
import { DataService } from './services/data.service';
import { MytoastService } from './services/MyToast.service';
import { FormsModule , ReactiveFormsModule} from '@angular/forms' 
import { HttpClientModule } from '@angular/common/http';
import { ToastrModule } from 'ngx-toastr'
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MainurunlerComponent } from './components/mainurunler/mainurunler.component';
import { CommentspageComponent } from './components/commentspage/commentspage.component';
import { initializeApp,provideFirebaseApp } from '@angular/fire/app';
import { environment } from '../environments/environment';
import { provideAuth,getAuth } from '@angular/fire/auth';
import { provideFirestore,getFirestore } from '@angular/fire/firestore';
import { provideStorage,getStorage } from '@angular/fire/storage';
import { ProfilComponent } from './components/profil/profil.component'
import { AngularFireModule } from '@angular/fire/compat'

@NgModule({
  declarations: [
    AppComponent,
    HomeComponent,
    KategoriComponent,
    LoginComponent,
    UyeComponent,
    UrunComponent,
    KayitComponent,
    MainurunlerComponent,
    CommentspageComponent,
    ProfilComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    HotToastModule.forRoot(),
    FormsModule,
    ReactiveFormsModule,
    HttpClientModule,
    AngularFireModule,
    BrowserAnimationsModule,
    ToastrModule.forRoot({
      closeButton:true,
      progressBar:true
    }),
    provideFirebaseApp(() => initializeApp(environment.firebase)),
    provideAuth(() => getAuth()),
    provideFirestore(() => getFirestore()),
    provideStorage(() => getStorage())
  ],
  providers: [ DataService, MytoastService],
  bootstrap: [AppComponent]
})
export class AppModule { }
