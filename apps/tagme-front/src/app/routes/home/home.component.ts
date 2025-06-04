import { Component, inject } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatDividerModule } from '@angular/material/divider';
import { MatIconModule } from '@angular/material/icon';
import { MatTableModule } from '@angular/material/table';
import { MatCardModule } from '@angular/material/card';
import { HomeUserEditButton } from './components/home-user-edit-button/home-user-edit-button';
import { HomeService } from './home.service';
import { CommonModule } from '@angular/common';

@Component({
  standalone: true,
  selector: 'home',
  styleUrl: 'home.component.css',
  templateUrl: 'home.component.html',
  imports: [CommonModule, MatTableModule, MatButtonModule, MatDividerModule, MatIconModule, HomeUserEditButton, MatCardModule],
})
export class HomeComponent {
  private homeService = inject(HomeService)
  displayedColumns: string[] = ['name', 'description', 'id'];
  dataSource$ = this.homeService.getUsers();
}

