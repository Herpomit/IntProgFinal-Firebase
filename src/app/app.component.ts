import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { DataService } from './services/data.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  title = 'IntProgVize';
  uye = this.servis.AktifUyeBilgi;
  constructor(
    public servis: DataService,
    public router: Router
  ) {
  }

  OturumKapat() {
    this.servis.OturumKapat().subscribe(() => {
      this.router.navigate(['login']);
    });
  }
}
