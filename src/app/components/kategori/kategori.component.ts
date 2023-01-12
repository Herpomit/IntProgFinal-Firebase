import { Component, OnInit } from '@angular/core';
import { FormGroup , FormControl} from '@angular/forms';
import { Kategori } from 'src/app/models/kategori';
import { Sonuc } from 'src/app/models/sonuc';
import { DataService } from 'src/app/services/data.service';
import { ToastrService } from 'ngx-toastr';
import { Modal } from 'bootstrap';
import * as bootstrap from 'bootstrap'; 

@Component({
  selector: 'app-kategori',
  templateUrl: './kategori.component.html',
  styleUrls: ['./kategori.component.scss']
})
export class KategoriComponent implements OnInit{
  kategoriler!: Kategori[];
  modal!: Modal;
  uye = this.servis.AktifUyeBilgi
  modalBaslik: string = "";
  secKat!: Kategori;
  sonuc: Sonuc = new Sonuc();
  frm: FormGroup = new FormGroup({
    katId: new FormControl(),
    adi: new FormControl(),
    kaytarih: new FormControl(),
    duztarih: new FormControl(),
    uid: new FormControl()
  });
  constructor(
    public servis: DataService,
    public toast: ToastrService
  ) {}
  ngOnInit() {
    this.KategoriListele();
  }
  Ekle(el: HTMLElement) {
    this.frm.reset();
    this.modal = new bootstrap.Modal(el);
    this.modalBaslik = "Kategori Düzenle";
    this.modal.show();
  }
  Duzenle(kat: Kategori, el: HTMLElement) {
    this.frm.patchValue(kat);
    this.modalBaslik = "Kategori Düzenle";
    this.modal = new bootstrap.Modal(el);
    this.modal.show();
  }
  Sil(kat: Kategori, el:HTMLElement) {
    this.secKat = kat;
    this.modalBaslik = "Kategori Sil";
    this.modal = new bootstrap.Modal(el);
    this.modal.show()
  }
  KategoriListele() {
    this.servis.KategoriListele().subscribe(s => {
      this.kategoriler = s;
    });
  }

  KategoriEkleDuzenle() {
    var kat: Kategori = this.frm.value
    var tarih = new Date();
    if (!kat.katId) {
      var filtre = this.kategoriler.filter(s => s.adi == kat.adi);
      if (filtre.length > 0) {
        this.sonuc.islem = false;
        this.sonuc.mesaj = "Girilen Kategori Kayıtlıdır!";
        this.toast.error(this.sonuc.mesaj)
      } else {
        kat.kaytarih = tarih.getTime().toString();
        kat.duztarih = tarih.getTime().toString();
        this.servis.KategoriEkle(kat).then(s => {
          this.sonuc.islem = true;
          this.sonuc.mesaj = "Kategori Eklendi";
          this.toast.success(this.sonuc.mesaj)
          this.KategoriListele();
          this.modal.toggle();
        })
      }
    } else {
      kat.duztarih = tarih.getTime().toString();
      this.servis.KategoriDuzenle(kat).then(() => {
        this.sonuc.islem = true;
        this.sonuc.mesaj = "Kategori Güncellendi!";
        this.toast.success(this.sonuc.mesaj)
        this.KategoriListele();
        this.modal.toggle();
      })
    }
  }
  KategoriSil() {
    this.servis.KategoriSil(this.secKat).then(() => {
      this.sonuc.islem = true;
      this.sonuc.mesaj = "Kategori Silindi!"
      this.toast.success(this.sonuc.mesaj)
      this.KategoriListele();
      this.modal.toggle()
    })
  }
}
