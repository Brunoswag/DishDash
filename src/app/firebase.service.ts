import { Injectable } from '@angular/core';
import { Firestore, doc, getDoc } from '@angular/fire/firestore';

@Injectable({
  providedIn: 'root'
})
export class FirebaseService {
  constructor(private firestore: Firestore) {}

  async getRecipeById(id: string) {
    try {
      const docRef = doc(this.firestore, 'recipes', id);
      const docSnap = await getDoc(docRef);
      
      if (docSnap.exists()) {
        return { 
          id: docSnap.id,
          title: docSnap.data()['title'] || '',
          description: docSnap.data()['description'] || '',
          imageUrl: docSnap.data()['imageUrl'],
          ingredients: docSnap.data()['ingredients'] || [],
          instructions: docSnap.data()['instructions'] || []
        };
      } else {
        throw new Error('Recipe not found');
      }
    } catch (error) {
      console.error('Error getting recipe:', error);
      throw error;
    }
  }
}