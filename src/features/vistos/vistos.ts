import { Component } from '@angular/core';
import { HeaderComponent } from '../header/header';
import { SidebarComponent } from '../sidebar/sidebar';

@Component({
  standalone: true,
  selector: 'app-vistos',
  imports: [SidebarComponent, HeaderComponent],
  templateUrl: './vistos.html',
  styleUrls: ['./vistos.css']
})
export class VistosComponent {}