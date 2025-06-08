import { Component } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatDividerModule } from '@angular/material/divider';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'app-home-user-edit-button',
  standalone: true,
  imports: [ MatButtonModule, MatDividerModule, MatIconModule ],
  templateUrl: './home-user-edit-button.html',
  styleUrl: './home-user-edit-button.css'
})
export class HomeUserEditButton {

}
