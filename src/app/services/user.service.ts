// Spencer Lommel 4/25/25

import { Injectable } from '@angular/core';
import { Auth, User as FirebaseUser } from '@angular/fire/auth';
import { 
  Firestore, 
  doc, 
  getDoc, 
  setDoc, 
  updateDoc, 
  collection, 
  query, 
  where, 
  getDocs 
} from '@angular/fire/firestore';
import { User } from '../models/user'
import { BehaviorSubject, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class UserService {
  // Chef dog dot png 
  public readonly DEFAULT_PROFILE_PICTURE = 'https://t4.ftcdn.net/jpg/00/72/27/13/240_F_72271347_Upeb6J6n9PkS8kqEUpZltIkLlboW5B1P.jpg';
  private currentUserSubject = new BehaviorSubject<User | null>(null);
  currentUser$ = this.currentUserSubject.asObservable();

  constructor(
    private auth: Auth,
    private firestore: Firestore
  ) {
    // Listen to auth state changes
    this.auth.onAuthStateChanged((firebaseUser) => {
      if (firebaseUser) {
        this.getUserData(firebaseUser.uid).then((userData) => {
          this.currentUserSubject.next(userData);
        });
      } else {
        this.currentUserSubject.next(null);
      }
    });
  }

  async createUserData(firebaseUser: FirebaseUser, username: string): Promise<void> {
    const userData: User = {
      uid: firebaseUser.uid,
      email: firebaseUser.email!,
      username: username,
      createdAt: new Date(),
      lastLogin: new Date(),
      profilePicture: this.DEFAULT_PROFILE_PICTURE
    };

    const userRef = doc(this.firestore, `users/${firebaseUser.uid}`);
    await setDoc(userRef, userData);
  }

  async getUserData(uid: string): Promise<User | null> {
    const userRef = doc(this.firestore, `users/${uid}`);
    const userSnap = await getDoc(userRef);
    
    if (userSnap.exists()) {
      const userData = userSnap.data() as User;
      // Ensure profile picture has a value
      userData.profilePicture = userData.profilePicture || this.DEFAULT_PROFILE_PICTURE;
      return userData;
    }
    
    return null;
  }

  async updateLastLogin(uid: string): Promise<void> {
    const userRef = doc(this.firestore, `users/${uid}`);
    await updateDoc(userRef, {
      lastLogin: new Date()
    });
  }

  getCurrentUser(): User | null {
    return this.currentUserSubject.value;
  }

  signOut(): void {
    // Clear the current user
    this.currentUserSubject.next(null);
    
    // Clear any stored authentication tokens
    localStorage.removeItem('auth_token');
    
    // You might want to clear other user-related data from localStorage
    localStorage.removeItem('user_data');
  }

  getProfilePicture(user: User | null): string {
    if (user && user.profilePicture) {
      return user.profilePicture;
    }
    return 'assets/default-avatar.png';
  }

  async getUserByUsername(username: string): Promise<User | null> {
    try {
      const usersRef = collection(this.firestore, 'users');
      const q = query(usersRef, where('username', '==', username));
      const querySnapshot = await getDocs(q);
      
      if (querySnapshot.empty) {
        return null;
      }

      const userDoc = querySnapshot.docs[0];
      return {
        ...userDoc.data(),
        uid: userDoc.id
      } as User;
    } catch (error) {
      console.error('Error fetching user by username:', error);
      return null;
    }
  }
}