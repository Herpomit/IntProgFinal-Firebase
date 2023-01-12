import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { mainModule } from 'process';
import { CommentspageComponent } from './components/commentspage/commentspage.component';
import { HomeComponent } from './components/home/home.component';
import { KategoriComponent } from './components/kategori/kategori.component';
import { KayitComponent } from './components/kayit/kayit.component';
import { LoginComponent } from './components/login/login.component';
import { MainurunlerComponent } from './components/mainurunler/mainurunler.component';
import { UrunComponent } from './components/urun/urun.component';
import { UyeComponent } from './components/uye/uye.component';

import {
  canActivate,
  redirectUnauthorizedTo,
  redirectLoggedInTo,
} from '@angular/fire/auth-guard';
import { ProfilComponent } from './components/profil/profil.component';

const redirectToLogin = () => redirectUnauthorizedTo(['login']);
const redirectToHome = () => redirectLoggedInTo(['']);
const routes: Routes = [
  {
    path: '',
    component : HomeComponent,
  },
  {
    path: 'kategoriler',
    component: KategoriComponent,
    ...canActivate(redirectToLogin),
  },
  {
    path: 'login',
    component: LoginComponent
  },
  {
    path: 'urunler',
    component: UrunComponent,
  },
  {
    path: 'urunler/:katId',
    component: UrunComponent
  },
  {
    path: 'uyeler',
    component: UyeComponent
  },
  {
    path: 'kayit',
    component : KayitComponent,
    ...canActivate(redirectToHome),
  },
  {
    path: 'mainurunler',
    component: MainurunlerComponent,
    ...canActivate(redirectToLogin),
  },
  {
    path: 'mainurunler/:katId',
    component: MainurunlerComponent,
    ...canActivate(redirectToLogin),
  },
  {
    path: 'commentspage/:urunId/:categoryId',
    component: CommentspageComponent,
    ...canActivate(redirectToLogin),
  },
  {
    path: 'profil',
    component: ProfilComponent,
    ...canActivate(redirectToLogin),
  }

];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
