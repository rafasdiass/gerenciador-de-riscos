import { Injectable } from '@angular/core';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class NavbarService {
  private isMenuOpen = false;

  constructor(private router: Router) {}

  navigateTo(route: string) {
    this.router.navigate([route]).then(() => {
      this.closeMenu(); // Certifique-se de fechar o menu após a navegação ser concluída
    });
  }

  toggleMenu() {
    this.isMenuOpen = !this.isMenuOpen;
  }

  closeMenu() {
    this.isMenuOpen = false;
  }

  isMenuToggled(): boolean {
    return this.isMenuOpen;
  }
}
