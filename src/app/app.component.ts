import { Component, inject, signal, Signal } from '@angular/core';
import { toObservable, toSignal } from "@angular/core/rxjs-interop";
import { ProductsApiService } from './api/products-api.service';
import { Observable, scan, switchMap, tap } from 'rxjs';
import { ProductsPaginator } from './models/models';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent {
  private api = inject(ProductsApiService);

  public paginator$: Observable<ProductsPaginator>;
  public paginator: Signal<ProductsPaginator | undefined>;

  public loading = signal(true);
  private page = signal(1);
  private page$ = toObservable(this.page);

  constructor() {
    this.paginator$ = this.loadProducts$();
    this.paginator = toSignal(this.paginator$);
  }

  private loadProducts$(): Observable<ProductsPaginator> {
    return this.page$.pipe(
      tap(() => this.loading.set(true)),
      switchMap((page) => this.api.getProducts$(page)),
      scan(this.updatePaginator, {items: [], page: 0, hasMorePages: true} as ProductsPaginator),
      tap(() => this.loading.set(false)),
    );
  }

  private updatePaginator(accumulator: ProductsPaginator, value: ProductsPaginator): ProductsPaginator {
    if (value.page === 1) {
      return value;
    }

    accumulator.items.push(...value.items);
    accumulator.page = value.page;
    accumulator.hasMorePages = value.hasMorePages;

    return accumulator;
  }

  public loadMoreProducts(paginator: ProductsPaginator) {
    if (!paginator.hasMorePages) {
      return;
    }
    this.page.set(paginator.page + 1);
  }
}
