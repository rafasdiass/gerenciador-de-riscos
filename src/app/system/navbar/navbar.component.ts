import { Component, HostListener } from '@angular/core';
import { Router } from '@angular/router';
import { NavbarService } from '../../shared/services/navbar.service';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.scss']
})
export class NavbarComponent {

  constructor(private navbarService: NavbarService, private router: Router) {}

  navigateTo(route: string, event: Event) {
    event.preventDefault();
    this.router.navigate([route]).then(() => {
      this.navbarService.closeMenu(); // Fecha o menu após a navegação
    });
  }

  toggleMenu() {
    this.navbarService.toggleMenu();
  }

  isMenuToggled(): boolean {
    return this.navbarService.isMenuToggled();
  }

  @HostListener('document:click', ['$event'])
  onDocumentClick(event: Event) {
    const target = event.target as HTMLElement;
    if (!target.closest('.navbar')) {
      this.navbarService.closeMenu();
    }
  }
}
