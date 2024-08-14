import { Injectable, Inject, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';

@Injectable({
  providedIn: 'root'
})
export class LocalStorageService {
  constructor(@Inject(PLATFORM_ID) private platformId: Object) {}

  private isBrowser(): boolean {
    return isPlatformBrowser(this.platformId);
  }

  setItem(key: string, value: string): void {
    if (this.isBrowser()) {
      try {
        localStorage.setItem(key, value);
      } catch (e) {
        console.warn(`Erro ao tentar definir a chave ${key} no localStorage:`, e);
      }
    }
  }

  getItem(key: string): string | null {
    if (this.isBrowser()) {
      try {
        return localStorage.getItem(key);
      } catch (e) {
        console.warn(`Erro ao tentar recuperar a chave ${key} do localStorage:`, e);
        return null;
      }
    }
    return null;
  }

  removeItem(key: string): void {
    if (this.isBrowser()) {
      try {
        localStorage.removeItem(key);
      } catch (e) {
        console.warn(`Erro ao tentar remover a chave ${key} do localStorage:`, e);
      }
    }
  }

  clear(): void {
    if (this.isBrowser()) {
      try {
        localStorage.clear();
      } catch (e) {
        console.warn(`Erro ao tentar limpar o localStorage:`, e);
      }
    }
  }
}
