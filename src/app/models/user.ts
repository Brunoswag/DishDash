// Spencer Lommel 04/28/25

import { Timestamp } from '@angular/fire/firestore';

export interface User {
    uid: string;
    email: string;
    username: string;
    createdAt: Timestamp;  // Changed from Date to Timestamp
    lastLogin: Timestamp;  // Changed from Date to Timestamp
    profilePicture?: string; // Optional, if no pfp we use a default one
    likedRecipes?: string[]; // Array of recipe IDs
    savedRecipes?: string[]; // Array of recipe IDs
}