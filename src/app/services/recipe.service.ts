import { Injectable, inject } from '@angular/core';
import { Firestore, doc, updateDoc, arrayUnion, arrayRemove, increment, collection, query, where, getDocs, getDoc, DocumentData, collectionData } from '@angular/fire/firestore';
import { UserService } from './user.service';
import { Recipe } from '../models/recipe';
import { User } from '../models/user';
import { Observable, from, map, of, switchMap, BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class RecipeService {
  private firestore: Firestore = inject(Firestore);
  private userService: UserService = inject(UserService);

  private savedRecipesSubject = new BehaviorSubject<Recipe[]>([]);
  savedRecipes$ = this.savedRecipesSubject.asObservable();
  
  private likedRecipesSubject = new BehaviorSubject<Recipe[]>([]);
  likedRecipes$ = this.likedRecipesSubject.asObservable();

  async loadSavedRecipes(): Promise<void> {
    const currentUser = this.userService.getCurrentUser();
    if (!currentUser) {
      this.savedRecipesSubject.next([]);
      return;
    }

    try {
      // First get the user's document to get their saved recipe IDs
      const userDoc = await getDoc(doc(this.firestore, 'users', currentUser.uid));
      const userData = userDoc.data() as User;
      const savedRecipeIds = userData?.savedRecipes || [];

      if (savedRecipeIds.length === 0) {
        this.savedRecipesSubject.next([]);
        return;
      }

      // Then fetch all saved recipes
      const recipesCollection = collection(this.firestore, 'recipes');
      const savedRecipesQuery = query(
        recipesCollection, 
        where('__name__', 'in', savedRecipeIds)
      );

      const querySnapshot = await getDocs(savedRecipesQuery);
      const recipes = querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      } as Recipe));

      this.savedRecipesSubject.next(recipes);
    } catch (error) {
      console.error('Error loading saved recipes:', error);
      this.savedRecipesSubject.next([]);
    }
  }

  async loadLikedRecipes(): Promise<void> {
    const currentUser = this.userService.getCurrentUser();
    if (!currentUser) {
      this.likedRecipesSubject.next([]);
      return;
    }

    try {
      // First get the user's document to get their liked recipe IDs
      const userDoc = await getDoc(doc(this.firestore, 'users', currentUser.uid));
      const userData = userDoc.data() as User;
      const likedRecipeIds = userData?.likedRecipes || [];

      if (likedRecipeIds.length === 0) {
        this.likedRecipesSubject.next([]);
        return;
      }

      // Then fetch all liked recipes
      const recipesCollection = collection(this.firestore, 'recipes');
      const likedRecipesQuery = query(
        recipesCollection, 
        where('__name__', 'in', likedRecipeIds)
      );

      const querySnapshot = await getDocs(likedRecipesQuery);
      const recipes = querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      } as Recipe));

      this.likedRecipesSubject.next(recipes);
    } catch (error) {
      console.error('Error loading liked recipes:', error);
      this.likedRecipesSubject.next([]);
    }
  }

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

      // Reload liked recipes after toggling
      await this.loadLikedRecipes();

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

      // Reload saved recipes after toggling
      await this.loadSavedRecipes();

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

  async getSavedRecipes(): Promise<Recipe[]> {
    const currentUser = this.userService.getCurrentUser();
    if (!currentUser?.savedRecipes) return [];

    try {
      const recipesCollection = collection(this.firestore, 'recipes');
      const savedRecipesQuery = query(
        recipesCollection, 
        where('__name__', 'in', currentUser.savedRecipes)
      );

      const querySnapshot = await getDocs(savedRecipesQuery);
      return querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      } as Recipe));
    } catch (error) {
      console.error('Error fetching saved recipes:', error);
      return [];
    }
  }

  getSavedRecipes$(): Observable<Recipe[]> {
    return from(this.getSavedRecipes());
  }

  async getLikedRecipes(): Promise<Recipe[]> {
    const currentUser = this.userService.getCurrentUser();
    if (!currentUser?.savedRecipes) return [];

    try {
      const recipesCollection = collection(this.firestore, 'recipes');
      const likedRecipesQuery = query(
        recipesCollection, 
        where('__name__', 'in', currentUser.likedRecipes)
      );

      const querySnapshot = await getDocs(likedRecipesQuery);
      return querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      } as Recipe));
    } catch (error) {
      console.error('Error fetching liked recipes:', error);
      return [];
    }
  }

  getLikedRecipes$(): Observable<Recipe[]> {
    return from(this.getLikedRecipes());
  }

  async getRecipeAuthor(userId: string): Promise<User | null> {
    try {
      const userDoc = await getDoc(doc(this.firestore, 'users', userId));
      if (!userDoc.exists()) return null;
      return { ...userDoc.data(), uid: userDoc.id } as User;
    } catch (error) {
      console.error('Error fetching recipe author:', error);
      return null;
    }
  }

  async getRecipeCountByUser(userId: string): Promise<number> {
    try {
      const recipesCollection = collection(this.firestore, 'recipes');
      const userRecipesQuery = query(
        recipesCollection,
        where('userId', '==', userId)
      );

      const querySnapshot = await getDocs(userRecipesQuery);
      return querySnapshot.size;
    } catch (error) {
      console.error('Error getting recipe count:', error);
      return 0;
    }
  }

  getCreatedRecipesByUserId(userId: string): Observable<Recipe[]> {
    const recipesRef = collection(this.firestore, 'recipes');
    const userRecipesQuery = query(recipesRef, where('userId', '==', userId));
    return collectionData(userRecipesQuery, { idField: 'id' }) as Observable<Recipe[]>;
  }
}
