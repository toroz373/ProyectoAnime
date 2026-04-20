import { Component } from '@angular/core';
import { HeaderComponent } from '../header/header';
import { SidebarComponent } from '../sidebar/sidebar';

@Component({
  standalone: true,
  selector: 'app-procesos',
  imports: [ SidebarComponent, HeaderComponent],
  templateUrl: './procesos.html',
  styleUrls: ['./procesos.css']
})
export class ProcesosComponent {}