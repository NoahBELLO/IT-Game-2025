import { Component, Inject, AfterViewInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-popup',
  imports: [CommonModule],
  templateUrl: './popup.component.html',
  styleUrl: './popup.component.scss'
})
export class PopupComponent implements AfterViewInit {
  constructor(public dialogRef: MatDialogRef<PopupComponent>, @Inject(MAT_DIALOG_DATA) public data: any) { }
  ngAfterViewInit() {
    // Désactiver aria-hidden sur <app-root> au moment où le dialog est ouvert
    document.querySelector('app-root')?.setAttribute('aria-hidden', 'false');
  }
  close() {
    document.querySelector('app-root')?.setAttribute('aria-hidden', 'true');
    this.dialogRef.close();
  }
}
