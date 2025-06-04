import { Component } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatDividerModule } from '@angular/material/divider';
import { MatIconModule } from '@angular/material/icon';
import { MatTableModule } from '@angular/material/table';
import { HomeUserEditButton } from './components/home-user-edit-button/home-user-edit-button';

export interface users {
  name: string;
  description: string;
  id: string;
}

const USERS_DATA: users[] = [
  {
    name: "jogn",
    description: "testess",
    id: "assad"
  }
];

/**
 * @title Basic use of `<table mat-table>`
 */
@Component({
  standalone: true,
  selector: 'home',
  styleUrl: 'home.component.css',
  templateUrl: 'home.component.html',
  imports: [MatTableModule, MatButtonModule, MatDividerModule, MatIconModule, HomeUserEditButton],
})
export class HomeComponent {
  displayedColumns: string[] = ['name', 'description', 'id'];
  dataSource = USERS_DATA;
}

