import { Component, inject, OnDestroy, OnInit } from '@angular/core';
import { User } from '../models/user';
import { UserService } from '../services/user.service';
import { Subscription, Observable } from 'rxjs';
import { CommonModule } from '@angular/common';
import { Timestamp } from 'firebase/firestore';

@Component({
  selector: 'app-user-profile',
  imports: [CommonModule],
  templateUrl: './user-profile.component.html',
  styleUrl: './user-profile.component.css'
})
export class UserProfileComponent implements OnInit, OnDestroy {
  user: User | null = null;
  private userSubscription?: Subscription;
  isExpanded$!: Observable<boolean>;

  rating = 5; //change once rating is implemented in recipes
  accountCreationDate:string = '';
  recipesCreated = 0; //change once recipes created is implemented
  recipesSaved = 0;

  constructor(
      private userService: UserService,
    ) {
    }

  ngOnInit() {
    this.userSubscription = this.userService.currentUser$.subscribe(user => {
      this.user = user;
    });
    if (this.user?.createdAt instanceof Timestamp) {
      this.user.createdAt = this.user.createdAt.toDate();
    }
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