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

  /**
   * Método genérico para POST requests
   * @param endpoint - O endpoint específico para a requisição
   * @param body - O corpo da requisição
   * @param customHeaders - (Opcional) Cabeçalhos adicionais para a requisição
   */
  post<T>(endpoint: string, body: any, customHeaders?: HttpHeaders): Observable<T> {
    const url = `${this.apiUrl}/${endpoint}`;
    const headers = customHeaders || new HttpHeaders({ 'Content-Type': 'application/json' });

    return this.http.post<T>(url, body, { headers })
      .pipe(
        catchError(this.handleError) // Tratar erro se ocorrer
      );
  }

  /**
   * Método para tratar erros nas requisições
   * @param error - O erro ocorrido durante a requisição HTTP
   */
  private handleError(error: HttpErrorResponse): Observable<never> {
    let errorMessage = 'Something bad happened; please try again later.';

    if (error.error instanceof ErrorEvent) {
      // Erro de client-side ou rede
      console.error('Client-side error:', error.error.message);
      errorMessage = `Client-side error: ${error.error.message}`;
    } else {
      // Erro retornado pelo backend
      console.error(`Backend returned code ${error.status}, body was: ${JSON.stringify(error.error)}`);
      errorMessage = `Backend error: ${error.status}, ${error.error?.message || errorMessage}`;
    }

    // Retornar um observable com uma mensagem de erro amigável
    return throwError(() => new Error(errorMessage));
  }
}
