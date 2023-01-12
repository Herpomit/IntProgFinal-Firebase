import { Component, OnInit } from '@angular/core';
import { Urun } from 'src/app/models/urun';
import { Modal } from 'bootstrap';
import * as bootstrap from 'bootstrap';
import { Sonuc } from 'src/app/models/sonuc';
import { ActivatedRoute } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { DataService } from 'src/app/services/data.service';
import { Basket } from 'src/app/models/Basket';
import { Kategori } from 'src/app/models/kategori';
import { FormGroup, FormControl } from '@angular/forms';
import { YorumModel } from 'src/app/models/YorumModel';
import { Uye } from 'src/app/models/uye';

@Component({
  selector: 'app-mainurunler',
  templateUrl: './mainurunler.component.html',
  styleUrls: ['./mainurunler.component.scss']
})
export class MainurunlerComponent implements OnInit{
  uye = this.servis.AktifUyeBilgi
  urunler!: Urun[];
  modal!: Modal;
  modalBaslik: string = ""
  kategoriler!: Kategori[];
  begenilenUrunler: Urun[] = [];
  aktifUid:string = "";
  secUrun!: Urun;
  yorumlar!: YorumModel[];
  katId: string = "";
  secKat: Kategori = new Kategori();
  sonuc: Sonuc = new Sonuc();
  toplam: number = 0
  baskets: Basket[] = [];
  frm: FormGroup = new FormGroup({
    id: new FormControl(),
    adi: new FormControl(),
    categoryId: new FormControl(),
    adedi: new FormControl(),
    fiyati: new FormControl(),
  });
  constructor(
    public servis: DataService,
    public toast: ToastrService,
    public route: ActivatedRoute
  ) {

  }
  ngOnInit(): void {
    this.route.params.subscribe((p: any) => {
      if (p.katId) {
        this.katId = p.katId;
        this.KategoriGetir();

      }
    });
    this.KategoriListele()
    this.uye.subscribe(d=> {
      this.aktifUid = d?.uid as string
      this.BegenilenGetir(this.aktifUid)
    })
    
  }
  BegenilenGetir(aktifUid:string){
    this.servis.BegenListele(aktifUid).subscribe(d => {
      this.begenilenUrunler = d;
    })
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
  OdemeYap(el:HTMLElement) {
    this.modalBaslik = "Ödeme Ekranı";
    this.modal = new bootstrap.Modal(el);
    this.modal.show()
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
  KatSec(katId: string) {
    this.katId = katId;
    this.KategoriGetir();
  }
  KategoriGetir() {
    this.servis.KategoriById(this.katId).subscribe(d => {
      this.secKat = d;
      this.UrunListele();
    });
  }
  DataDegistir(basket: Basket) {
    var sepetAdeti: number = parseInt((<HTMLInputElement>document.getElementById("adet-" + basket.urun.adi)).value);
    let index = this.baskets.indexOf(basket);

    this.baskets.splice(index,1)

    basket.adet = sepetAdeti;
    this.baskets.push(basket)
  }
  SepetUrunSil(item: Basket) {
    let index = this.baskets.indexOf(item)
    this.baskets.splice(index,1)
    this.toplam = this.toplam - (item.urun.fiyati * item.adet)
    this.sonuc.islem = true;
    this.sonuc.mesaj = "Ürün Sepetinizden Kaldırıldı!";
    this.toast.success(this.sonuc.mesaj)
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
  Begen(urun:Urun, uye:Uye){
    var filtre = this.begenilenUrunler.filter(s => s.adi == urun.adi)
    if (filtre.length > 0){
      this.toast.error("Ürünü Zaten Beğendiniz!")
    } else {
      this.servis.BegenEkle(urun,uye).then(d => {
        this.toast.success("Beğendin!")
      })
    }
  }
}
