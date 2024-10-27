import { Component, computed, inject, signal, Signal, WritableSignal } from '@angular/core';
import { toObservable, toSignal } from "@angular/core/rxjs-interop";
import { ProductsApiService } from './api/products-api.service';
import { debounceTime, distinctUntilChanged, Observable, scan, switchMap, tap } from 'rxjs';
import { ProductsPaginator } from './models/models';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent {
  private api: ProductsApiService = inject(ProductsApiService);

  public loading: WritableSignal<boolean> = signal(true);
  private page: WritableSignal<number> = signal(1);
  private search: WritableSignal<string> = signal('');

  private filter: Signal<{
    page: number;
    search: string;
  }> = computed(() => {
    return {
      page: this.page(),
      search: this.search()
    }
  });
  private filter$ = toObservable(this.filter);

  public paginator$: Observable<ProductsPaginator> = this.filter$.pipe(
    debounceTime(300),
    distinctUntilChanged(),
    tap(() => this.loading.set(true)),
    switchMap((filter) => this.api.getProducts$(filter.search, filter.page)),
    scan(this.updatePaginator, {items: [], page: 0, hasMorePages: true} as ProductsPaginator),
    tap(() => this.loading.set(false)),
  );
  public paginator: Signal<ProductsPaginator | undefined> = toSignal(this.paginator$);

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

  public searchChange(event: Event) {
    const target = event.target as HTMLInputElement;
    this.page.set(1);
    this.search.set(target.value);
  }
}
