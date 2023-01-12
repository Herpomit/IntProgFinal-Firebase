import { ActivatedRoute } from '@angular/router';
import { Kategori } from 'src/app/models/kategori';
import { Sonuc } from 'src/app/models/sonuc';
import { ToastrService } from 'ngx-toastr';
import { Urun } from 'src/app/models/urun';
import { DataService } from './../../services/data.service';
import { Component, OnInit } from '@angular/core';
import { Modal } from 'bootstrap';
import * as bootstrap from 'bootstrap';
import { FormGroup, FormControl } from '@angular/forms';
import { Basket } from 'src/app/models/Basket';

@Component({
  selector: 'app-urun',
  templateUrl: './urun.component.html',
  styleUrls: ['./urun.component.scss']
})
export class UrunComponent implements OnInit {
  urunler!: Urun[];
  kategoriler!: Kategori[];
  modal!: Modal;
  modalBaslik: string = "";
  secUrun!: Urun;
  katId: string = "";
  toplam: number = 0
  secKat: Kategori = new Kategori();
  sonuc: Sonuc = new Sonuc();
  frm: FormGroup = new FormGroup({
    urunId: new FormControl(),
    uid: new FormControl(),
    adi: new FormControl(),
    categoryId: new FormControl(),
    imgUrl: new FormControl(),
    adedi: new FormControl(),
    fiyati: new FormControl(),
  });
  uye = this.servis.AktifUyeBilgi
  baskets: Basket[] = [];
  constructor(
    public servis: DataService,
    public toast: ToastrService,
    public route: ActivatedRoute
  ) { }

  ngOnInit() {
    this.route.params.subscribe((p: any) => {
      if (p.katId) {
        this.katId = p.katId;
        this.KategoriGetir();

      }
    });
    this.KategoriListele();
  }
  KatSec(katId: string) {
    this.katId = katId;
    this.KategoriGetir();
  }

  Ekle(el: HTMLElement) {
    this.frm.reset();
    this.frm.patchValue({
      categoryId: this.katId
    });
    this.modal = new bootstrap.Modal(el);
    this.modalBaslik = "Ürün Ekle";
    this.modal.show();
  }
  Duzenle(urun: Urun, el: HTMLElement) {
    this.frm.patchValue(urun);
    this.modalBaslik = "Ürün Düzenle";
    this.modal = new bootstrap.Modal(el);
    this.modal.show();
  }
  Sil(urun: Urun, el: HTMLElement) {
    this.secUrun = urun;
    this.modalBaslik = "Ürün Sil";
    this.modal = new bootstrap.Modal(el);
    this.modal.show();
  }
  OdemeYap(el:HTMLElement) {
    this.modalBaslik = "Ödeme Ekranı";
    this.modal = new bootstrap.Modal(el);
    this.modal.show()
  }

  UrunListele() {
    this.servis.UrunListeleByKatId(this.katId).subscribe(d => {
      this.urunler = d;
    });
  }
  KategoriListele() {
    this.servis.KategoriListele().subscribe(d => {
      this.kategoriler = d;
    });
  }
  KategoriGetir() {
    this.servis.KategoriById(this.katId).subscribe(d => {
      this.secKat = d;
      this.UrunListele();
    });
  }
  UrunEkleDuzenle() {
    var urun: Urun = this.frm.value
    if (!urun.urunId) {
      var filtre = this.urunler.filter(s => s.adi == urun.adi);
      if (filtre.length > 0) {
        this.sonuc.islem = false;
        this.sonuc.mesaj = "Girilen Ürün Adı Kayıtlıdır!";
        this.toast.error(this.sonuc.mesaj)
      } else {
        this.servis.UrunEkle(urun).then(d => {
          this.sonuc.islem = true;
          this.sonuc.mesaj = "Ürün Eklendi";
          this.toast.success(this.sonuc.mesaj)
          this.UrunListele();
          this.modal.toggle();
        });
      }
    } else {
      this.servis.UrunDuzenle(urun).then(d => {
        this.sonuc.islem = true;
        this.sonuc.mesaj = "Ürün Düzenlendi";
        this.toast.success(this.sonuc.mesaj)
        this.UrunListele();
        this.modal.toggle();
      });
    }

  }
  UrunSil() {
    this.servis.UrunSil(this.secUrun).then(d => {
      this.sonuc.islem = true;
      this.sonuc.mesaj = "Ürün Silindi";
      this.toast.success(this.sonuc.mesaj)
      this.UrunListele();
      this.modal.toggle();
    });
  }
  SepeteEkle(urun: Urun , adet: string) {
    let basketModel = new Basket();
    basketModel.urun = urun;
    basketModel.adet = parseInt(adet)
    this.toplam = this.toplam + (parseInt(adet) * urun.fiyati) 
    this.baskets.push(basketModel);
    this.sonuc.islem = true;
    this.sonuc.mesaj = "Ürün Başarıyla Sepete Eklendi!";
    this.toast.success(this.sonuc.mesaj)
  }
  SepetUrunSil(item: Basket) {
    let index = this.baskets.indexOf(item)
    this.baskets.splice(index,1)
    this.toplam = this.toplam - (item.urun.fiyati * item.adet)
    this.sonuc.islem = true;
    this.sonuc.mesaj = "Ürün Sepetinizden Kaldırıldı!";
    this.toast.success(this.sonuc.mesaj)
  }
  DataDegistir(basket: Basket) {
    var sepetAdeti: number = parseInt((<HTMLInputElement>document.getElementById("adet-" + basket.urun.adi)).value);
    let index = this.baskets.indexOf(basket);

    this.baskets.splice(index,1)

    basket.adet = sepetAdeti;
    this.baskets.push(basket)
  }
  calc() {
    this.toplam = 0;
    this.baskets.forEach(element => {
      this.toplam =  this.toplam + (element.adet * element.urun.fiyati)
    });
    return this.toplam;
  }
  Odeme(){
    this.baskets = [];
    this.toplam = 0;
    this.modal.toggle();
    this.sonuc.islem = true;
    this.sonuc.mesaj = "Ödeme İşlemi Gerçekleşti! Ürünleriniz Hazırlanıyor!"
    this.toast.success(this.sonuc.mesaj)
  }
}