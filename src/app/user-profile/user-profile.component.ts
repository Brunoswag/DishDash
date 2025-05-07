import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { User } from '../models/user';
import { UserService } from '../services/user.service';
import { RecipeService } from '../services/recipe.service';
import { Subscription } from 'rxjs';
import { Timestamp } from '@angular/fire/firestore';
import { Recipe } from '../models/recipe';
import { SavedRecipeComponent } from '../saved-recipe/saved-recipe.component';

@Component({
  selector: 'app-user-profile',
  standalone: true,
  imports: [CommonModule, RouterLink],
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
  recipesLiked = 0;
  rating = 5;
  private routeSubscription?: Subscription;

  createdRecipes: Recipe[] = [];

  

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private userService: UserService,
    private recipeService: RecipeService
  ) {}

  ngOnInit() {
    // Subscribe to route parameter changes
    this.routeSubscription = this.route.paramMap.subscribe(params => {
      const username = params.get('username');
  
      if (!username) {
        this.error = 'No username provided';
        console.error('Error loading profile: No username provided');
        this.router.navigate(['/home']);
        return;
      }
  
      this.loading = true;
  
      this.userService.getUserByUsername(username).subscribe({
        next: (profileUser) => {
          if (!profileUser) {
            this.error = 'User not found';
            console.error('Error loading profile: User not found');
            this.router.navigate(['/home']);
            return;
          }
  
          this.profileUser = profileUser;
  
          // Check if this is the current user's profile
          const currentUser = this.userService.getCurrentUser();
          this.isOwnProfile = currentUser?.uid === profileUser.uid;
  
          // Load user's details and created recipes
          this.loadUserStats();
          this.loadUserRecipes(profileUser.uid);
        },
        error: (err) => {
          console.error('Error loading profile:', err);
          this.error = 'Error loading profile';
          this.router.navigate(['/home']);
        },
        complete: () => {
          this.loading = false;
        },
      });
    });
  }
  
  loadUserRecipes(userId: string) {
    // Load created recipes
    this.recipeService.getCreatedRecipesByUserId(userId).subscribe({
      
      next: (recipes) => {
        this.createdRecipes = recipes;
      },
      error: (err) => {
        console.error('Error loading created recipes:', err);
      },
  });
  }

  private async loadUserStats() {
    if (!this.profileUser) return;

    this.recipesCreated = await this.recipeService.getRecipeCountByUser(this.profileUser.uid);
    this.recipesSaved = this.profileUser.savedRecipes?.length || 0;
    this.recipesLiked = this.profileUser.likedRecipes?.length || 0;

  }

  onProfilePictureSelected(event: Event) {
    const input = event.target as HTMLInputElement;
    if (!input.files || input.files.length === 0) return;
  
    const file = input.files[0];
  
    // Upload the file to Firebase Storage
    this.userService.uploadProfilePicture(file).then(downloadURL => {
      if (this.profileUser) {
        this.userService.updateProfilePicture(this.profileUser.uid, downloadURL).then(() => {
          this.profileUser!.profilePicture = downloadURL;
        }).catch(err => {
          console.error('Error updating profile picture:', err);
        });
      }
    }).catch(err => {
      console.error('Error uploading profile picture:', err);
    });
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

  getLastOnlineDate(): Date | null {
    if (this.profileUser?.lastLogin instanceof Timestamp) {
      return this.profileUser.lastLogin.toDate();
    }
    return null;
  }

  handleImageError(event: Event): void {
    const img = event.target as HTMLImageElement;
    if (img) {
      img.src = 'https://placehold.co/600x400/png?text=Recipe';
    }
  }

  async toggleLike(recipe: Recipe, event: Event): Promise<void> {
    event.preventDefault();
    event.stopPropagation();
    if (!this.userService.getCurrentUser()) {
      return;
    }
    await this.recipeService.toggleLike(recipe);
  }

  async toggleSave(recipe: Recipe, event: Event): Promise<void> {
    event.preventDefault();
    event.stopPropagation();
    if (!this.userService.getCurrentUser()) {
      return;
    }
    await this.recipeService.toggleSave(recipe);
  }

  isLiked(recipe: Recipe): boolean {
    return this.recipeService.isLikedByUser(recipe);
  }

  isSaved(recipe: Recipe): boolean {
    return this.recipeService.isSavedByUser(recipe);
  }

  ngOnDestroy() {
    this.routeSubscription?.unsubscribe();
  }
}