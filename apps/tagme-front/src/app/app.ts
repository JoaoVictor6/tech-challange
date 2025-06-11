import { Component } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatToolbarModule } from '@angular/material/toolbar';
import { RouterLink, RouterOutlet } from '@angular/router';

@Component({
  selector: 'app-root',
  imports: [ RouterOutlet, RouterLink,
    MatToolbarModule,
    MatButtonModule, ],
  standalone: true,
  styles: `
    #root {
      display: flex;
      flex-direction: column;
      height: 100vh;
    }
    #root > #content {
      flex: 1;
    }
  `,
  template: `
    <div id="root">
      <mat-toolbar>
        <button mat-button routerLink="/">Página Inicial</button>
        <button mat-button routerLink="/items/new">Novo</button>
      </mat-toolbar>
      <div id="content">
        <router-outlet></router-outlet>
      </div>
    </div>
  `
})
export class App {
  protected title = 'tagme-front';
}
