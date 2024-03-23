import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ThemeService {
  private darkThemeSubject: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);
  public darkTheme: Observable<boolean> = this.darkThemeSubject.asObservable();

  constructor() { }

  setDarkTheme(isDarkTheme: boolean): void {
    this.darkThemeSubject.next(isDarkTheme);
  }
}
