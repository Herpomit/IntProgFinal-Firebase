import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { HotToastService } from '@ngneat/hot-toast';
import { concatMap } from 'rxjs';
import { Urun } from 'src/app/models/urun';
import { Uye } from 'src/app/models/uye';
import { DataService } from 'src/app/services/data.service';

@Component({
  selector: 'app-profil',
  templateUrl: './profil.component.html',
  styleUrls: ['./profil.component.scss']
})
export class ProfilComponent implements OnInit {
  uye = this.servis.AktifUyeBilgi
  begenilenUrunler: Urun[] = [];
  aktifUid:string = "";
  frm: FormGroup = new FormGroup({
    uid: new FormControl(),
    email: new FormControl(),
    displayName: new FormControl(),
    tel: new FormControl(),
    adres: new FormControl()
  });

  constructor(
    public servis: DataService,
    public htoast: HotToastService
  ){}

  ngOnInit(): void {
    this.servis.AktifUyeBilgi.subscribe((user) => {
      this.frm.patchValue({ ...user });
    });
    this.uye.subscribe(d=> {
      this.aktifUid = d?.uid as string
      this.BegeniListele(this.aktifUid);
    })
  }

  BegeniListele(id:string) {
    this.servis.BegenListele(id).subscribe(d=> {
      this.begenilenUrunler = d;
    })
  }
  BegenSil(urun:Urun){
    this.servis.BegenSil(urun,this.aktifUid)
    this.htoast.success(urun.adi + " adlı ürün beğenilenler arasından silindi!")
  }

  Kaydet(){
    this.servis
    .UyeDuzenle(this.frm.value)
    .pipe(
      this.htoast.observe({
        loading: 'Güncelleniyor',
        success:'Güncellendi',
        error: 'Hata Oluştu',
      })
    )
    .subscribe();
  }

  resimYukle(event: any, user:Uye){
    this.servis
    .uploadImage(event.target.files[0], 'images/profile/${user.uid}')
    .pipe(
      this.htoast.observe({
        loading: 'Fotoğraf Yükleniyor...',
        success: 'Fotoğraf Yüklendi!',
        error: 'Hata Oluştu!'
      }),
      concatMap((foto) =>
      this.servis.UyeDuzenle({uid: user.uid, foto})
      )
    )
    .subscribe()
  }
}
