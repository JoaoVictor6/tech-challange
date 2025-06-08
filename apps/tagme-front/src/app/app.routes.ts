import { Routes } from '@angular/router';
import { HomeComponent } from './routes/home/home.component';
import { HomeResolver } from './routes/home/home.resolver';

export const routes: Routes = [
  {
    path: '',
    component: HomeComponent,
    resolve: {
      home: HomeResolver
    },
    title: 'aaa'
  }
];
