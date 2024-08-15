import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse, HttpHeaders } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class ApiService {

  private readonly apiUrl = 'http://localhost:8080/api'; 
  constructor(private http: HttpClient) {}

  post<T>(endpoint: string, body: any, customHeaders?: HttpHeaders): Observable<T> {
    const url = `${this.apiUrl}/${endpoint}`;
    const headers = customHeaders || new HttpHeaders({ 'Content-Type': 'application/json' });

    return this.http.post<T>(url, body, { headers })
      .pipe(
        catchError(this.handleError)
      );
  }

  private handleError(error: HttpErrorResponse): Observable<never> {
    let errorMessage = 'Something bad happened; please try again later.';

    if (error.error instanceof ErrorEvent) {
      console.error('Client-side error:', error.error.message);
      errorMessage = `Client-side error: ${error.error.message}`;
    } else {
      console.error(`Backend returned code ${error.status}, body was: ${JSON.stringify(error.error)}`);
      errorMessage = `Backend error: ${error.status}, ${error.error?.message || errorMessage}`;
    }

    return throwError(() => new Error(errorMessage));
  }
}
