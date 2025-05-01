import { Component, OnInit, OnDestroy, EventEmitter, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { NavService } from '../navbar.service';
import { UserService } from '../services/user.service';
import { FilterService } from '../filter.service';
import { User } from '../models/user';
import { Subscription, Observable } from 'rxjs';
import { FormControl } from '@angular/forms';
import { Router } from '@angular/router';
import { Firestore, collection, query, orderBy, startAt, endAt, collectionData } from '@angular/fire/firestore';
import { debounceTime, switchMap } from 'rxjs/operators';
import { ReactiveFormsModule } from '@angular/forms';
import { orderByChild } from '@angular/fire/database';



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
  @Output() sortedRecipes = new EventEmitter<any[]>();

  constructor(
    private navService: NavService,
    private userService: UserService,
    private router: Router,
    private firestore: Firestore,
    private filterService: FilterService
  ) {   this.searchControl.valueChanges
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


  resetFilters() {
    // Reset sort mode (no filter)
    this.filterService.setSortMode(null);

    // Clear the search term
    this.filterService.updateSearchTerm('');

    // Optionally, clear the input field (reset the search input)
    this.searchControl.setValue('');
  }

  onClearFilters() {
    this.resetFilters(); // Reset both filters and search term
  }


  ngOnDestroy() {
    if (this.userSubscription) {
      this.userSubscription.unsubscribe();
    }
  }



  toggleNav() {
    this.navService.toggleSidebar();
  }

  onSubmit(event: Event) {
    event.preventDefault(); // Prevent form submission
  }

  
  

  getProfilePicture(): string {
    return this.userService.getProfilePicture(this.user);
  }

  signOut() {
    this.userService.signOut();
    this.router.navigate(['/login']);
  }

  // onSortByDate() {
  //   this.filterService.setSortMode('date');
  // }
  
  // onSortByCategory() {
  //   this.filterService.setSortMode('category');
  // }

  searchFirestore(searchText: string): Observable<any[]> {
    const recipiesRef = collection(this.firestore, 'recipes');
    const q = query(
      recipiesRef,
      orderBy('name'),
      startAt(searchText),
      endAt(searchText + "\uf8ff")
    );

    return collectionData(q, { idField: 'id' });
  }
}