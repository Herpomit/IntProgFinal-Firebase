import { Component } from '@angular/core';
import { FormGroup, FormControl } from '@angular/forms';
import { Sonuc } from 'src/app/models/sonuc';
import { Uye } from 'src/app/models/uye';
import { DataService } from 'src/app/services/data.service';
import { ToastrService } from 'ngx-toastr';
import { switchMap } from 'rxjs';
import { Router } from '@angular/router';
import { HotToastService } from '@ngneat/hot-toast';

@Component({
  selector: 'app-kayit',
  templateUrl: './kayit.component.html',
  styleUrls: ['./kayit.component.scss']
})
export class KayitComponent {
  sonuc: Sonuc = new Sonuc();
  frm: FormGroup = new FormGroup({
    uid: new FormControl(),
    id: new FormControl(),
    displayName: new FormControl(),
    email: new FormControl(),
    admin: new FormControl(),
    parola: new FormControl(),
    adres: new FormControl(),
    foto: new FormControl(),
    kaytarih: new FormControl(),
    duztarih: new FormControl(),
  });
  constructor(
    public servis: DataService,
    public htoast: HotToastService,
    public route: Router
  ) { }

  KayitOl(adsoyad:string,email: string, parola:string) {
    let duztarih = Date()
    let kaytarih = Date()
    let admin = '0'
    this.servis.KayitOl(email,parola).pipe(
      switchMap(({ user:  {uid} }) => 
        this.servis.UyeEkle( {
          uid, email, displayName: adsoyad, duztarih, kaytarih, admin
        })
      ),
      this.htoast.observe({
        success: 'Kayıt Olundu!',
        loading: 'Kayıt Oluşturuluyor...',
        error: ({ message }) => `${message}`
      })
    ).subscribe(() => {
      this.route.navigate([''])
    });
  }
}
