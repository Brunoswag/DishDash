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
    { label: 'Explore', icon: 'bi bi-compass' },
    { label: 'Reels', icon: 'bi bi-film' },
    { label: 'Messages', icon: 'bi bi-chat' },
    { label: 'Notifications', icon: 'bi bi-heart' },
    { label: 'Create', icon: 'bi bi-plus-square' }
  ];
}
