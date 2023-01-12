import { Injectable } from '@angular/core';
import { Kategori } from '../models/kategori';
import { Uye } from '../models/uye';
import { HttpClient } from '@angular/common/http'
import { Urun } from '../models/urun';
import { YorumModel } from '../models/YorumModel';
import { collection, collectionData, deleteDoc, doc, docData, Firestore, getDoc, query, setDoc, where } from '@angular/fire/firestore';
import { concatMap, from, map, Observable, of, switchMap, take } from 'rxjs';
import { addDoc, updateDoc } from '@firebase/firestore';
import {
  Auth,
  authState,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  updateProfile,
  User,
  UserInfo,
  signInWithPopup,
} from '@angular/fire/auth';
import {
  getDownloadURL,
  ref,
  Storage,
  uploadBytes,
} from '@angular/fire/storage';


@Injectable({
  providedIn: 'root'
})
export class DataService {
  aktifUye = authState(this.auth);
  uye = this.AktifUyeBilgi
  constructor(
    public http: HttpClient,
    public fs : Firestore,
    public auth: Auth,
    public storage: Storage
  ) { }
  /* kategori servis başla*/

  OturumAc(mail: string, parola: string) {
    return from(signInWithEmailAndPassword(this.auth, mail, parola));
  }
  
  


  GoogleSignIn(){
    return 
  }

  KayitOl(mail: string, parola: string){
    return from(createUserWithEmailAndPassword(this.auth, mail,parola));
  }

  OturumKapat(){
    return from(this.auth.signOut());
  }

  get AktifUyeBilgi() {
    return this.aktifUye.pipe(
      switchMap((user) => {
        if (!user?.uid) {
          return of(null);
        }
        const ref = doc(this.fs, 'Uyeler', user?.uid);
        return docData(ref) as Observable<Uye>;
      })
    );
  }

  KategoriListele() {
    var ref = collection(this.fs,"Categories")
    return collectionData(ref, { idField: 'katId' }) as Observable<Kategori[]>
  }
  KategoriById(id: string) {
    const ref = doc(this.fs, "Categories/"+ id)
    return docData(ref) as Observable<Kategori>  
  }
  KategoriEkle(kat: Kategori) {
    var ref = collection(this.fs, "Categories");
    return addDoc(ref, kat)
  }
  KategoriDuzenle(kat: Kategori) {
    var ref = doc(this.fs, "Categories/" + kat.katId);
    return updateDoc(ref, { ...kat });
  }
  KategoriSil(kat: Kategori) {
    var ref = doc(this.fs,"Categories/"+ kat.katId);
    return deleteDoc(ref);
  }
  /* kategori servis bitiş*/

  /* Uye servis başla*/

  UyeListele() {
    var ref = collection(this.fs, "Uyeler");
    return collectionData(ref, { idField: 'uid' }) as Observable<Uye[]>;
  }
  UyeById(uid: string) {
    const ref = doc(this.fs, "Uyeler/"+ uid)
    return from(docData(ref)) as Observable<Uye>
  }
  UyeEkle(uye: Uye) {
    var ref = doc(this.fs, 'Uyeler', uye.uid);
    return from(setDoc(ref, uye));
  }
  UyeDuzenle(uye: Uye) {
    var ref = doc(this.fs, "Uyeler", uye.uid);
    return from(updateDoc(ref, { ...uye }));
  }
  UyeSil(uye: Uye) {
    var ref = doc(this.fs, "Uyeler", uye.uid);
    return from(deleteDoc(ref));
  }
  /* Uye servis bitiş*/

  /* Ürün servis başla*/

  UrunListele() {
    var ref = collection(this.fs,"Categories/"+"/Products")
    return collectionData(ref, { idField: 'urunId' }) as Observable<Urun[]>
  }
  UrunListeleByKatId(katId: string) {
    var ref = collection(this.fs,"Categories/"+ katId+ "/Products")
    return collectionData(ref, {idField:'urunId'}) as Observable<Urun[]>
  }
  UrunById(id: string,katId:string) {
    const ref = doc(this.fs,"Categories/"+ katId +"/Products/"+ id)
    return docData(ref) as Observable<Urun> 
  }
  UrunEkle(urun: Urun) {
    var ref = collection(this.fs,"Categories/"+ urun.categoryId + "/Products");
    return addDoc(ref, urun)
  }
  UrunDuzenle(urun: Urun) {
    var ref = doc(this.fs,"Categories/"+ urun.categoryId + "/Products/"+ urun.urunId);
    return updateDoc(ref, { ...urun });
  }
  UrunSil(urun: Urun) {
    var ref = doc(this.fs,"Categories/"+urun.categoryId + "/Products/"+ urun.urunId);
    return deleteDoc(ref);
  }
  /* Ürün servis bitiş*/
  /* Yorum servis başla*/
  YorumListele(){
    var ref = collection(this.fs,"Categories/"+"Products/"+"Comments")
    return collectionData(ref, { idField: 'yorumId' }) as Observable<YorumModel[]>
  }
  YorumEkle(yorum: YorumModel, katId: string, urunId:string) {
    var ref = collection(this.fs, "Categories/"+ katId+ "/Products/"+ urunId + "/Comments");
    return addDoc(ref, yorum)
  }
  YorumDuzenle(yorum: YorumModel, katId:string, urunId:string) {
    var ref = doc(this.fs, "Categories/" + katId+"/Products/"+urunId+"/Comments/"+yorum.yorumId);
    return updateDoc(ref, { ...yorum });
  }
  YorumListeleByUrunId(urunId: string,katId: string){
    var ref = collection(this.fs,"Categories/"+ katId+ "/Products/"+urunId+"/Comments")
    return collectionData(ref, {idField:'yorumId'}) as Observable<YorumModel[]>
  }
  YorumSil(yorum: YorumModel,katId:string,urunId:string) {
    var ref = doc(this.fs,"Categories/"+ katId+"/Products/"+urunId+"/Comments/"+yorum.yorumId);
    return deleteDoc(ref);
  }
  /* Yorum servis bitiş*/

  uploadImage(image: File,path:string): Observable<string>{
    const storageRef = ref(this.storage, path);
    const uploadTask = from(uploadBytes(storageRef, image));
    return uploadTask.pipe(switchMap((result) => getDownloadURL(result.ref)));
  }

  BegenEkle(urun:Urun, uye: Uye){
    var ref = collection(this.fs, "Uyeler/"+ uye.uid +"/LikesProducts");
    return addDoc(ref, urun)
  }
  BegenListele(uid: string){
    var ref = collection(this.fs,"Uyeler/"+ uid +"/LikesProducts")
    console.log(uid)
    return collectionData(ref, { idField: 'urunId' }) as Observable<Urun[]>
  }
  BegenById(uid: string,urunId:string) {
    const ref = doc(this.fs,"Uyeler/"+ uid +"/LikesProducts/"+ urunId)
    return docData(ref) as Observable<Urun> 
  }
  BegenSil(urun:Urun,uid:string) {
    var ref = doc(this.fs,"Uyeler/"+ uid+"/LikesProducts/"+urun.urunId);
    return deleteDoc(ref);
  }
}

