import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NavService } from '../navbar.service';

interface NavItem {
  icon: string;
  label: string;
}

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './navbar.component.html',
  styleUrl: './navbar.component.css'
})
export class NavbarComponent {
  navItems: NavItem[] = [
    { icon: 'bi bi-house', label: 'Home' },
    { icon: 'bi bi-heart', label: 'Favorites' },
    { icon: 'bi bi-clock-history', label: 'History' },
    { icon: 'bi bi-gear', label: 'Settings' }
  ];

  readonly isExpanded$;

  constructor(private navService: NavService) {
    this.isExpanded$ = this.navService.isExpanded$;
  }

  toggleSidebar() {
    this.navService.toggleSidebar();
  }
}