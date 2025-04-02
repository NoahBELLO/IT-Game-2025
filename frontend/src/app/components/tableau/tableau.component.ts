import { Component, Input } from '@angular/core';
import { NgFor } from '@angular/common';

@Component({
  selector: 'app-tableau',
  standalone: true,
  imports: [NgFor],
  templateUrl: './tableau.component.html',
  styleUrl: './tableau.component.scss'
})
export class TableauComponent {
  @Input() data: any;
}
