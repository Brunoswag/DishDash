
import { Injectable } from '@angular/core';
import { BehaviorSubject, combineLatest, switchMap } from 'rxjs';
import { Firestore, collection, query, where, orderBy, startAt, endAt, collectionData } from '@angular/fire/firestore';

@Injectable({ providedIn: 'root' })
export class FilterService {
  public searchTerm$ = new BehaviorSubject<string>('');
  private sortMode$ = new BehaviorSubject<'date' | 'category' | null>(null);

  constructor(private firestore: Firestore) {}

  updateSearchTerm(term: string) {
    this.searchTerm$.next(term.toLowerCase());
  }

  setSortMode(mode: 'date' | 'category' | null) {
    this.sortMode$.next(mode);
  }

  getFilteredRecipes() {
    return combineLatest([this.searchTerm$, this.sortMode$]).pipe(
      switchMap(([term, sort]) => {
        const recipesRef = collection(this.firestore, 'recipes');
        let q = query(recipesRef);

        if (term) {
          q = query(recipesRef, orderBy('nameLowercase'), startAt(term), endAt(term + '\uf8ff'));
        }

        if (sort === 'date') {
          q = query(recipesRef, orderBy('createdAt', 'desc'));
        } else if (sort === 'category') {
          q = query(recipesRef, orderBy('tags'));
        }

        return collectionData(q, { idField: 'id' });
      })
    );
  }
}