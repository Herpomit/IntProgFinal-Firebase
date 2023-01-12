import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { Sonuc } from 'src/app/models/sonuc';
import { Urun } from 'src/app/models/urun';
import { Modal } from 'bootstrap';
import * as bootstrap from 'bootstrap';
import { YorumModel } from 'src/app/models/YorumModel';
import { DataService } from 'src/app/services/data.service';
import { Uye } from 'src/app/models/uye';

@Component({
  selector: 'app-commentspage',
  templateUrl: './commentspage.component.html',
  styleUrls: ['./commentspage.component.scss']
})
export class CommentspageComponent implements OnInit {
  sonuc: Sonuc = new Sonuc();
  yorum: YorumModel = new YorumModel()
  urunId: string = "";
  uyeName: string = "";
  uyeAdmin: string = "";
  katId: string = "";
  uyeAdi: string = "";
  modal!: Modal;
  yorumlar: YorumModel[] = [];
  uye = this.servis.AktifUyeBilgi
  urun: Urun = new Urun();
  modalBaslik: string = "";
  frm: FormGroup = new FormGroup({
    id: new FormControl(),
    yorumId: new FormControl(),
    productId: new FormControl(),
    uyeId: new FormControl(),
    name: new FormControl(),
    yorum: new FormControl()
  })

  constructor(
    public servis: DataService,
    public route: ActivatedRoute,
    public toast: ToastrService
  ) { }
  ngOnInit(): void {
    this.route.params.subscribe((p: any) => {
      if (p.urunId) {
        this.urunId = p.urunId;
        this.katId = p.categoryId;

        this.UrunListele(this.katId);
      }
    });
    this.UrunListele(this.katId);
    this.YorumListele();
    this.uye.subscribe((d)=> {
      this.uyeName = d?.displayName as string
      this.uyeAdmin = d?.admin as string
    })
  }

  UrunListele(katId: string) {
    this.servis.UrunById(this.urunId, katId).subscribe(p => {
      this.urun = p;
    })
  }
  YorumEkle(name:string) {
    let katId = this.katId
    let urunId = this.urunId
    this.yorum = this.frm.value
    this.yorum.name = name;
    this.servis.YorumEkle(this.yorum, katId, urunId).then(p => {
      this.sonuc.mesaj = "Yorum Gönderildi!";
      this.toast.success(this.sonuc.mesaj);
      this.UrunListele(katId);
      this.YorumListele();
    })
  }
  YorumListele() {
    this.servis.YorumListeleByUrunId(this.urunId, this.katId).subscribe(p => {
      this.yorumlar = p;
    })
  }
  Yorumsil(yorum: YorumModel) {
    let katId = this.katId
    let urunId = this.urunId
    this.servis.YorumSil(yorum, katId, urunId).then(p => {
      this.sonuc.mesaj = "Yorum Silindi!";
      this.toast.success(this.sonuc.mesaj);
      this.YorumListele();
    })
  }
  OturumKontrol(ad: string) {
    if (localStorage.getItem('adsoyad') == ad) {
      return true
    } else if (localStorage.getItem('admin') == '1') {
      return true
    } else {
      return false
    }
  }
  YorumDuzenle() {
    let katId = this.katId
    let urunId = this.urunId
    var yorum = this.frm.value;
    this.servis.YorumDuzenle(yorum, katId, urunId).then(d => {
      this.sonuc.mesaj = "Yorum Düzenlendi!";
      this.toast.success(this.sonuc.mesaj);
      this.YorumListele();
      this.modal.toggle();
    })
  }
  Duzenle(yorum: YorumModel, el: HTMLElement) {
    this.frm.patchValue(yorum);
    this.modalBaslik = "Ürün Düzenle";
    this.modal = new bootstrap.Modal(el);
    this.modal.show();
  }

  YorumCheck(ad: string){
    if (ad == this.uyeName) {
      return true
    } else if (this.uyeAdmin == '1') {
      return true
    } else {
      return false
    }
  }
}
