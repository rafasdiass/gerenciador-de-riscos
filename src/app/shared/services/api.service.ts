import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { catchError, Observable, throwError } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ApiService {

  private apiUrl = 'http://localhost:8080/api'; // URL base do backend

  constructor(private http: HttpClient) {}

  // Método genérico para POST requests
  post<T>(endpoint: string, body: any): Observable<T> {
    return this.http.post<T>(`${this.apiUrl}/${endpoint}`, body)
      .pipe(
        catchError(this.handleError) // Tratar erro se ocorrer
      );
  }

  // Método para tratar erros nas requisições
  private handleError(error: HttpErrorResponse): Observable<never> {
    console.error('An error occurred:', error.message);
    
    if (error.error instanceof ErrorEvent) {
      // Erro de client-side ou rede
      console.error('Client-side error:', error.error.message);
    } else {
      // Erro retornado pelo backend
      console.error(`Backend returned code ${error.status}, ` +
                    `body was: ${error.error}`);
    }

    // Retornar um observable com uma mensagem de erro amigável
    return throwError(() => new Error('Something bad happened; please try again later.'));
  }
}
