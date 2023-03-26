import { Component, OnInit, ElementRef, OnDestroy } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { CacheService } from 'src/app/services/cache.service';
import { ConnectDialogComponent } from './connect/connect-dialog.component';

@Component({
  selector: 'app-smx',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit, OnDestroy {

  constructor(private router: Router, public dialog: MatDialog, private cacheService: CacheService) { }

  ngOnInit() {
    const self = this;
    const active = self.cacheService.get('active');
    if (active === 'true') {
      self.router.navigate(['/account/wallet']);
    }
  }

  ngAfterViewInit() {
  }
  ngOnDestroy() {
  }

  async openConnectDialog() {
    this.dialog.open(ConnectDialogComponent, {
      width: '400px',
      panelClass: 'connect-dialog',
      hasBackdrop: true,
      backdropClass:'bdrop',
      disableClose:true
    });
  }
}
