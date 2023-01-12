import { Component, OnInit } from '@angular/core';
import { DataService } from 'src/app/services/data.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit{
  uye = this.servis.AktifUyeBilgi
  constructor(
    public servis: DataService
  ) {}

  ngOnInit(): void {
    
  }
}
