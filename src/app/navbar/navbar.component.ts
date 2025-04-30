import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { UserService } from '../services/user.service';
import { NavService } from '../navbar.service';
import { User } from '../models/user';
import { Subscription, Observable } from 'rxjs';

interface NavItem {
  icon: string;
  label: string;
  route?: string;
}

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css']
})
export class NavbarComponent implements OnInit, OnDestroy {
  user: User | null = null;
  private userSubscription?: Subscription;
  isExpanded$!: Observable<boolean>;

  navItems: NavItem[] = [
    { icon: 'bi bi-house', label: 'Home', route: '/home' },
    { icon: 'bi bi-search', label: 'Search', route: '/search' },
    { icon: 'bi bi-bookmark', label: 'Saved', route: '/saved' },
    { icon: 'bi bi-plus-square', label: 'Add', route: '/new-recipe' },
  ];

  constructor(
    private userService: UserService,
    private navService: NavService
  ) {
    this.isExpanded$ = this.navService.isExpanded$;
  }

  ngOnInit() {
    this.userSubscription = this.userService.currentUser$.subscribe(user => {
      this.user = user;
    });
  }

  ngOnDestroy() {
    if (this.userSubscription) {
      this.userSubscription.unsubscribe();
    }
  }

  getProfilePicture(): string {
    return this.userService.getProfilePicture(this.user);
  }
}