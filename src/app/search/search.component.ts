import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { NavService } from '../navbar.service';
import { UserService } from '../services/user.service';
import { User } from '../models/user';
import { Subscription, Observable } from 'rxjs';
import { FormControl } from '@angular/forms';
import { Router } from '@angular/router';
import { Firestore, collection, query, orderBy, startAt, endAt, collectionData } from '@angular/fire/firestore';
import { debounceTime, switchMap } from 'rxjs/operators';
import { ReactiveFormsModule } from '@angular/forms';

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
  results$: Observable<any[]>;

  constructor(
    private navService: NavService,
    private userService: UserService,
    private router: Router,
    private firestore: Firestore
  ) {   this.results$ = this.searchControl.valueChanges.pipe(
    debounceTime(100),
    switchMap(searchText => this.searchFirestore(searchText ?? ''))
  );}

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

  onSubmit(event: Event) {
    event.preventDefault(); // Prevent form submission
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

  searchFirestore(searchText: string): Observable<any[]> {
    const recipiesRef = collection(this.firestore, 'recipes');

    const q = query(
      recipiesRef,
      orderBy('name'),
      startAt(searchText),
      endAt(searchText + '\uf8ff')
    );

    return collectionData(q, { idField: 'id' });
  }
}