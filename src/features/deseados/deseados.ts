import { Component } from '@angular/core';
import { HeaderComponent } from '../header/header';
import { SidebarComponent } from '../sidebar/sidebar';

@Component({
  standalone: true,
  selector: 'app-deseados',
  imports: [ SidebarComponent, HeaderComponent],
  templateUrl: './deseados.html',
  styleUrls: ['./deseados.css']
})
export class DeseadosComponent {}