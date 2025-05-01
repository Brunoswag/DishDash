import { Injectable } from '@angular/core';
import { BehaviorSubject, combineLatest, switchMap } from 'rxjs';
import { Firestore, collection, query, where, orderBy, startAt, endAt, collectionData } from '@angular/fire/firestore';

@Injectable({
  providedIn: 'root',
})
export class FilterService {
  constructor(private firestore: Firestore) {}

  private searchTerm = new BehaviorSubject<string>('');
   searchTerm$ = this.searchTerm.asObservable();
 
   updateSearchTerm(term: string) {
     this.searchTerm.next(term);
   }
}
