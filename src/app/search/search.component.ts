import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { NavService } from '../navbar.service';
import { UserService } from '../services/user.service';
import { User } from '../models/user';
import { Subscription } from 'rxjs';
import { Router } from '@angular/router';
import { Firestore, collection, orderBy, startAt, endAt, collectionData, query } from '@angular/fire/firestore';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { Observable } from 'rxjs';
import { FilterService } from '../filter.service';
import { debounceTime, switchMap } from 'rxjs';
@Component({
  selector: 'app-search',
  standalone: true,
  imports: [CommonModule, RouterModule, ReactiveFormsModule],
  templateUrl: './search.component.html',
  styleUrl: './search.component.css'
})
export class SearchComponent implements OnInit, OnDestroy {
  user: User | null = null;
  private userSubscription?: Subscription;
  searchControl = new FormControl('');


  constructor(
    private navService: NavService,
    private userService: UserService,
    private router: Router,
    private firestore: Firestore,
    private filterService: FilterService
  ) { 
     this.searchControl.valueChanges
     .pipe(debounceTime(300))
     .subscribe(searchText => {
       this.filterService.updateSearchTerm(searchText ?? '');
     });
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

  toggleNav() {
    this.navService.toggleSidebar();
  }

  getProfilePicture(): string {
    return this.userService.getProfilePicture(this.user);
  }

  signOut() {
    this.userService.signOut();
    this.router.navigate(['/login']);
  }

  navigateToProfile(): void {
    if (this.user?.username) {
      this.router.navigate(['/profile', this.user.username]);
    }
  }
}