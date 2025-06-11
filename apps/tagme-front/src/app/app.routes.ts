import { Routes } from '@angular/router';
import { HomeComponent } from './routes/home/home.component';
import { HomeResolver } from './routes/home/home.resolver';
import { NewItemPageComponent } from './routes/new-item/new-item-page.component';
import { EditItemPageComponent } from './routes/edit-item/edit-item-page.component';
import { EditItemResolve } from './routes/edit-item/edit-item.resolve';

export const routes: Routes = [
  {
    path: '',
    component: HomeComponent,
    resolve: {
      home: HomeResolver
    },
  },
  { path: 'items/new', component: NewItemPageComponent },
  { path: 'item/:id', component: EditItemPageComponent, resolve: { item: EditItemResolve } }
];
