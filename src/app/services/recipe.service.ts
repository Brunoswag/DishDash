import { Injectable } from '@angular/core';
import { Firestore, doc, updateDoc, arrayUnion, arrayRemove, increment } from '@angular/fire/firestore';
import { UserService } from './user.service';
import { Recipe } from '../models/recipe';
import { Observable, map, of } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class RecipeService {
  constructor(
    private firestore: Firestore,
    private userService: UserService
  ) {}

  async toggleLike(recipe: Recipe): Promise<boolean> {
    const currentUser = this.userService.getCurrentUser();
    if (!currentUser || !recipe.id) return false;

    const recipeRef = doc(this.firestore, `recipes/${recipe.id}`);
    const userRef = doc(this.firestore, `users/${currentUser.uid}`);
    
    const isLiked = recipe.likedBy?.includes(currentUser.uid);
    
    try {
      // Update recipe document
      await updateDoc(recipeRef, {
        likes: increment(isLiked ? -1 : 1),
        likedBy: isLiked ? arrayRemove(currentUser.uid) : arrayUnion(currentUser.uid)
      });

      // Update user's liked recipes
      await updateDoc(userRef, {
        likedRecipes: isLiked ? arrayRemove(recipe.id) : arrayUnion(recipe.id)
      });

      return true;
    } catch (error) {
      console.error('Error toggling like:', error);
      return false;
    }
  }

  async toggleSave(recipe: Recipe): Promise<boolean> {
    const currentUser = this.userService.getCurrentUser();
    if (!currentUser || !recipe.id) return false;

    const recipeRef = doc(this.firestore, `recipes/${recipe.id}`);
    const userRef = doc(this.firestore, `users/${currentUser.uid}`);
    
    const isSaved = recipe.savedBy?.includes(currentUser.uid);
    
    try {
      // Update recipe document
      await updateDoc(recipeRef, {
        saves: increment(isSaved ? -1 : 1),
        savedBy: isSaved ? arrayRemove(currentUser.uid) : arrayUnion(currentUser.uid)
      });

      // Update user's saved recipes
      await updateDoc(userRef, {
        savedRecipes: isSaved ? arrayRemove(recipe.id) : arrayUnion(recipe.id)
      });

      return true;
    } catch (error) {
      console.error('Error toggling save:', error);
      return false;
    }
  }

  isLikedByUser(recipe: Recipe): boolean {
    const currentUser = this.userService.getCurrentUser();
    return currentUser ? recipe.likedBy?.includes(currentUser.uid) ?? false : false;
  }

  isSavedByUser(recipe: Recipe): boolean {
    const currentUser = this.userService.getCurrentUser();
    return currentUser ? recipe.savedBy?.includes(currentUser.uid) ?? false : false;
  }
}
