import { Injectable } from '@angular/core';

import { HttpClient, HttpHeaders } from '@angular/common/http';

import { Observable, of } from 'rxjs';
import { catchError, map, tap } from 'rxjs';

import { Hero } from './hero';
import { HEROES } from './mock-heroes';

import { MessageService } from './message.service';

@Injectable({
  providedIn: 'root',
})
export class HeroService {
  private heroesUrl: string = 'api/heroes';

  private httpOptions = {
    headers: new HttpHeaders({ 'Content-Type': 'application/json' }),
  };

  constructor(
    private messageService: MessageService,
    private http: HttpClient
  ) {}

  private log(message: string): void {
    this.messageService.add(`HeroService: ${message}`);
  }

  private handleError<T>(operation: string = 'operation', result?: T) {
    return (err: any): Observable<T> => {
      console.error(err);

      this.log(`${operation} failed: ${err.message}`);

      return of(result as T);
    };
  }

  getHeroes(): Observable<Hero[]> {
    return this.http.get<Hero[]>(this.heroesUrl).pipe(
      tap((_) => this.log('fetched heroes')),
      catchError(this.handleError<Hero[]>('getHeroes', []))
    );
  }

  getHero(id: number): Observable<Hero> {
    const url = `${this.heroesUrl}/${id}`;
    return this.http
      .get<Hero>(url)
      .pipe(
        tap(
          (_) => this.log('fetched hero id=' + id),
          catchError(this.handleError<Hero>('getHero id=' + id))
        )
      );
  }

  updateHero(hero: Hero): Observable<any> {
    return this.http.put(this.heroesUrl, hero, this.httpOptions).pipe(
      tap((_) => this.log('updated hero id=' + hero.id)),
      catchError(this.handleError<any>('updateHero'))
    );
  }

  addHero(hero: Hero): Observable<Hero> {
    return this.http.post<Hero>(this.heroesUrl, hero, this.httpOptions).pipe(
      tap((newHero: Hero) => this.log('added hero w/ id=' + newHero.id)),
      catchError(this.handleError<Hero>('addHero'))
    );
  }

  deleteHero(id: number): Observable<Hero> {
    const url = `${this.heroesUrl}/${id}`;
    return this.http
      .delete<Hero>(url, this.httpOptions)
      .pipe(
        tap(
          (_) => this.log('deleted hero id=' + id),
          catchError(this.handleError<Hero>('deleteHero'))
        )
      );
  }

  searchHeroes(term: string): Observable<Hero[]> {
    if (!term.trim()) return of([]);

    const url = `${this.heroesUrl}/?name=${term}`;

    return this.http
      .get<Hero[]>(url)
      .pipe(
        tap(
          (x) =>
            x.length
              ? this.log(`found heroes matching "${term}"`)
              : this.log(`no heroes matching "${term}"`),
          catchError(this.handleError<Hero[]>('searchHeroes', []))
        )
      );
  }
}
