import { Component } from '@angular/core';

@Component({
  selector: 'app-navbar',
  imports: [],
  templateUrl: './navbar.component.html',
  styleUrl: './navbar.component.css'
})
export class NavbarComponent {
  navItems = [
    { label: 'Home', icon: 'bi bi-house-door' },
    { label: 'Search', icon: 'bi bi-search' },
    { label: 'Create', icon: 'bi bi-plus-square' },
    { label: 'Settings', icon: 'bi bi-gear' }
  ];
}
