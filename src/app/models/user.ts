// Spencer Lommel 04/28/25

export interface User {
    uid: string;
    email: string;
    username: string;
    createdAt: Date;
    lastLogin: Date;
    profilePicture?: string; // Optional, if no pfp we use a default one
  }