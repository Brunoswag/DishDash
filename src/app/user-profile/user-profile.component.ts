import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { User } from '../models/user';
import { UserService } from '../services/user.service';
import { RecipeService } from '../services/recipe.service';
import { Subscription } from 'rxjs';
import { Timestamp } from '@angular/fire/firestore';

@Component({
  selector: 'app-user-profile',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './user-profile.component.html',
  styleUrl: './user-profile.component.css'
})
export class UserProfileComponent implements OnInit, OnDestroy {
  profileUser: User | null = null;
  isOwnProfile = false;
  loading = true;
  error: string | null = null;
  recipesCreated = 0;
  recipesSaved = 0;
  rating = 5;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private userService: UserService,
    private recipeService: RecipeService
  ) {}

  async ngOnInit() {
    try {
      this.loading = true;
      const username = this.route.snapshot.paramMap.get('username');
      
      if (!username) {
        throw new Error('No username provided');
      }

      const profileUser = await this.userService.getUserByUsername(username);
      
      if (!profileUser) {
        throw new Error('User not found');
      }

      this.profileUser = profileUser;
      
      // Check if this is the current user's profile
      const currentUser = this.userService.getCurrentUser();
      this.isOwnProfile = currentUser?.uid === profileUser.uid;

      // Load user's stats
      await this.loadUserStats();
    } catch (error) {
      console.error('Error loading profile:', error);
      this.error = 'Profile not found';
      this.router.navigate(['/home']);
    } finally {
      this.loading = false;
    }
  }

  private async loadUserStats() {
    if (!this.profileUser) return;

    // You'll need to implement these methods in your RecipeService
    this.recipesCreated = await this.recipeService.getRecipeCountByUser(this.profileUser.uid);
    this.recipesSaved = this.profileUser.savedRecipes?.length || 0;
  }

  getProfilePicture(): string {
    return this.userService.getProfilePicture(this.profileUser);
  }

  getCreatedAtDate(): Date | null {
    if (this.profileUser?.createdAt instanceof Timestamp) {
      return this.profileUser.createdAt.toDate();
    }
    return null;
  }

  ngOnDestroy() {}
}