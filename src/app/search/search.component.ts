import { Component } from '@angular/core';
import { NavService } from '../navbar.service';

@Component({
  selector: 'app-search',
  standalone: true,
  imports: [],
  templateUrl: './search.component.html',
  styleUrl: './search.component.css'
})
export class SearchComponent {
  constructor(private navService: NavService) {}

  toggleNav() {
    this.navService.toggleSidebar();
  }
}