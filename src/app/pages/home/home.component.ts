import { Component } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [],
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent {

  constructor(private router: Router) {}

  goToDashboard() {
    this.router.navigate(['/dashboard']);
  }

  goToOperations() {
    this.router.navigate(['/operations']);
  }

  goToSettings() {
    this.router.navigate(['/settings']);
  }

  goToHistory() {
    this.router.navigate(['/history']);
  }
}
