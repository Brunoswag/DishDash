import { Injectable } from '@angular/core';
import { BehaviorSubject, combineLatest, switchMap } from 'rxjs';
import {
  Firestore,
  collection,
  query,
  where,
  orderBy,
  startAt,
  endAt,
  collectionData,
} from '@angular/fire/firestore';

@Injectable({
  providedIn: 'root',
})
export class FilterService {
  constructor(private firestore: Firestore) {}

  private searchTerm = new BehaviorSubject<string>('');
  private filterTerm = new BehaviorSubject<string>('');
  searchTerm$ = this.searchTerm.asObservable();
  filterTerm$ = this.filterTerm.asObservable();

  updateSearchTerm(term: string) {
    this.searchTerm.next(term);
  }

  updateFilterTermDate() {
    this.filterTerm.next('date');
  }

  updateFilterTermCategory() {
    this.filterTerm.next('category');
  }
  resetFilterTerm() {
    this.filterTerm.next('');
  }
}
