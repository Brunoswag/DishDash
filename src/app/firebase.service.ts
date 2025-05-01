import { Injectable } from '@angular/core';
import { Firestore, doc, getDoc } from '@angular/fire/firestore';

@Injectable({
  providedIn: 'root'
})
export class FirebaseService {
  constructor(private firestore: Firestore) {}

  async getRecipeById(id: string) {
    try {
      console.log('Fetching recipe with ID:', id); // Debug log
      const docRef = doc(this.firestore, 'recipes', id);
      const docSnap = await getDoc(docRef);
      
      if (!docSnap.exists()) {
        console.log('No recipe found with ID:', id); // Debug log
        return null;
      }

      const data = docSnap.data();
      console.log('Recipe data from Firestore:', data); // Debug log
      
      return {
        id: docSnap.id,
        ...data
      };
    } catch (error) {
      console.error('Error in getRecipeById:', error);
      throw error;
    }
  }
}