import { AfterViewInit, Component, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-popup-information',
  imports: [CommonModule],
  templateUrl: './popup-information.component.html',
  styleUrl: './popup-information.component.scss'
})
export class PopupInformationComponent implements AfterViewInit {
  constructor(public dialogRef: MatDialogRef<PopupInformationComponent>, @Inject(MAT_DIALOG_DATA) public data: any) { }
  ngAfterViewInit() {
    // Désactiver aria-hidden sur <app-root> au moment où le dialog est ouvert
    document.querySelector('app-root')?.setAttribute('aria-hidden', 'false');
  }
  close() {
    document.querySelector('app-root')?.setAttribute('aria-hidden', 'true');
    this.dialogRef.close();
  }
}
