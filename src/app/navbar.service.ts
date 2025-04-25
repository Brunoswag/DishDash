import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class NavService {
  private isExpandedSource = new BehaviorSubject<boolean>(true);
  isExpanded$ = this.isExpandedSource.asObservable();

  toggleSidebar() {
    this.isExpandedSource.next(!this.isExpandedSource.value);
  }
}