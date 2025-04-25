import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NavService } from '../navbar.service';
import { UserService } from '../services/user.service';

interface NavItem {
  icon: string;
  label: string;
}

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css'], // Fixed typo: styleUrl -> styleUrls
})
export class NavbarComponent implements OnInit {
  user: { username: string; profilePicture: string } | null = null;

  navItems: NavItem[] = [
    { icon: 'bi bi-house', label: 'Home' },
    { icon: 'bi bi-heart', label: 'Favorites' },
    { icon: 'bi bi-clock-history', label: 'History' },
    { icon: 'bi bi-gear', label: 'Settings' },
  ];

  readonly isExpanded$: any; // Add a proper type if possible (e.g., Observable<boolean>)

  constructor(private userService: UserService, private navService: NavService) {
    this.isExpanded$ = this.navService.isExpanded$;
  }

  toggleSidebar() {
    this.navService.toggleSidebar();
  }

  ngOnInit(): void {
    this.user = this.userService.getUser();
    // console.log('User data:', this.user);
  }
}