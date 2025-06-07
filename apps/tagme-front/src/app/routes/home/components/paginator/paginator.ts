import { Component, Input } from '@angular/core';
import { MatPaginatorModule, PageEvent } from '@angular/material/paginator';

@Component({
  selector: 'app-paginator',
  imports: [MatPaginatorModule],
  templateUrl: './paginator.html',
  styleUrl: './paginator.css'
})
export class PaginatorComponent {
  @Input('onChange') onPaginatorChange!: (event: PageEvent) => void
  @Input() totalItems!: number
  @Input() pageSize!: number
  @Input() pageIndex!: number
}
